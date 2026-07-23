import { ContactMessage } from "../models/contact.model.js";
import { asyncHandler } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";

export const submitContact = asyncHandler(async (req, res) => {
    const message = await ContactMessage.create(req.body);
    sendResponse(res, 201, { id: message._id }, "Message sent. We'll get back to you soon.");
});

export const listContacts = asyncHandler(async (_req, res) => {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    sendResponse(res, 200, { messages });
});
