export class ErrorResponse extends Error {
  constructor(message = "Something went wrong", status = 500) {
    super(message);
    this.statusCode = status;
  }
}
