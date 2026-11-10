import { NextFunction, Request, Response } from 'express';

import { isHttpError } from '../utils/httpError';

/**
 * Centralized Express error handler.
 * - Known HttpError => return status + message
 * - Unknown errors => log once and return 500
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
 */ / eslint-disable-line @typescript-eslint/no-explicit-any
) {
  // Express requires next param to treat this as error middleware
  void next;

  if (isHttpError(err)) {
    return res.status(err.status).json( { error: err.message });
  }

  // Default: don't leak internal error details
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  return res.status(500).json( { error: 'Internal server error' });
}
