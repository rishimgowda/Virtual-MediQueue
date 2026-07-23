/**
 * Standard success response envelope: { success: true, data, message }
 */
export class ApiResponse {
    constructor(statusCode, data = null, message = "Success") {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

export const sendResponse = (res, statusCode, data, message) =>
    res.status(statusCode).json(new ApiResponse(statusCode, data, message));
