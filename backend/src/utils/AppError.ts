export class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    // Jab bhi object banega tab ye constructor chalega.
    constructor(message: string, statusCode: number) {
        super(message);
        // Ye parent class (Error) ke constructor ko call karta hai.

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        // Ye error ka stack trace banata hai - node js feature
        Error.captureStackTrace(this, this.constructor);
    }
}