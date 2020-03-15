export interface Handler {
  event: string;
  handler: (...args) => any;
}
