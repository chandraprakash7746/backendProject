
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.status = "fail";
    this.isOperational = true;

    Error.captureStackTrace?.(this, AppError);
  }
}
 