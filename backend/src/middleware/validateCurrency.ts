import { Request, Response, NextFunction } from 'express';
import { validateCurrency } from '../services/currencyService';

export function currencyValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  const currency = req.query.currency as string || req.body.currency as string;

  if (currency) {
    try {
      validateCurrency(currency);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : 'Invalid currency'
      });
    }
  }

  next();
}
