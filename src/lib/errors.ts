export class RSSParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RSSParserError";
  }
}

export class RSSValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RSSValidationError";
  }
}
