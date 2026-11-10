import { Router, Request, Response } from 'express';
import { searchProperties } from '../services/propertyService';
import { SearchParams, Currency } from '../types';
import { currencyValidationMiddleware } from '../middleware/validateCurrency';
import { parseBoolean, parseEnum, parsePositiveInt, parseStringLimited } from '../utils/validators';

const router = Router();

router.get('/search', currencyValidationMiddleware, async (req: Request, res: Response) => {
  const location = parseStringLimited(req.query.location, {
    fieldName: 'location',
    maxLength: 100
  });

  const freeWifi = parseBoolean(req.query.freeWifi, 'freeWifi');

  const currency = parseEnum<Currency>(req.query.currency, ['USD', 'EUR', 'GBP'], {
    fieldName: 'currency',
    default: 'USD'
  });

  const sortBy = parseEnum<string>(req.query.sortBy, ['name', 'location', 'nightly_price_usd_cents'], {
    fieldName: 'sortBy',
    default: 'name'
  });

  const sortOrder = parseEnum<'asc' | 'desc'>(req.query.sortOrder, ['asc', 'desc'], {
    fieldName: 'sortOrder',
    default: 'asc'
  });

  const page = parsePositiveInt(req.query.page, { fieldName: 'page', default: 1, min: 1 });
  const limit = parsePositiveInt(req.query.limit, { fieldName: 'limit', default: 10, min: 1, max: 50 });

  const params: SearchParams = {
    location,
    freeWifi,
    currency,
    sortBy,
    sortOrder,J
    page,
    limit
  };

  const result = await searchProperties(params);
  res.json(result);
});

export default router;
