import { User } from "../models/user.model.js";
import { ApiError, asyncHandler } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import {
    cookieOptions,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.js";

const issueTokens = async (user, res) => {
    const payload = { sub: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("accessToken", accessToken, cookieOptions("access"));
    res.cookie("refreshToken", refreshToken, cookieOptions("refresh"));

    return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
    const { username, email, phone, password, role } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }, { phone }] });
    if (existing) {
        throw new ApiError(409, "A user with this email, username, or phone already exists");
    }

    const user = await User.create({
        username,
        email,
        phone,
        password,
        role: role === "doctor" ? "doctor" : "patient",
    });

    const tokens = await issueTokens(user, res);
    sendResponse(res, 201, { user: user.toSafeObject(), ...tokens }, "Registered successfully");
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(401, "Invalid credentials");

    const ok = await user.comparePassword(password);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    const tokens = await issueTokens(user, res);
    sendResponse(res, 200, { user: user.toSafeObject(), ...tokens }, "Login successful");
});

export const logout = asyncHandler(async (req, res) => {
    if (req.user?.id) {
        await User.findByIdAndUpdate(req.user.id, { $unset: { refreshToken: 1 } });
    }
    res.clearCookie("accessToken", cookieOptions("access"));
    res.clearCookie("refreshToken", cookieOptions("refresh"));
    sendResponse(res, 200, null, "Logged out successfully");
});

export const refresh = asyncHandler(async (req, res) => {
    const incoming =
        req.cookies?.refreshToken ||
        (req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.slice(7)
            : null);
    if (!incoming) throw new ApiError(401, "Refresh token missing");

    let payload;
    try {
        payload = verifyRefreshToken(incoming);
    } catch {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(payload.sub).select("+refreshToken");
    if (!user || user.refreshToken !== incoming) {
        throw new ApiError(401, "Refresh token rejected");
    }

    const tokens = await issueTokens(user, res);
    sendResponse(res, 200, tokens, "Tokens refreshed");
});

export const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");
    sendResponse(res, 200, { user: user.toSafeObject() });
});
