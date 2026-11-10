export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototype(new.target.prototype);
  }
}

export function isHttpError(err: unknown): err is HttpError {
  return (
    err instanceof Error &&
    typeof (err as any).status === 'number'
  );
}

export function badRequest(message: string): HttpError {
  return new HttpError(400, message);
}

export function notFound(message: string): HttpError {
  return new HttpError(404, message);
}
