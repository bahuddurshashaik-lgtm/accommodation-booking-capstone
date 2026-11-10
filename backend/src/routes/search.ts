import { Router, Request, Response } from 'express';
import { searchProperties } from '../services/propertyService';
import { SearchParams } from '../types';
import { currencyValidationMiddleware } from '../middleware/validateCurrency';

const router = Router();

router.get('/search', currencyValidationMiddleware, async (req: Request, res: Response) => {
  try {
    const params: SearchParams = {
      location: req.query.location as string,
      freeWifi: req.query.freeWifi === 'true' ? true : req.query.freeWifi === 'false' ? false : undefined,
      currency: (req.query.currency as string) || 'USD',
      sortBy: (req.query.sortBy as string) || 'name',
      sortOrder: (req.query.sortOrder === 'desc' ? 'desc' : 'asc'),
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10
    };

    const result = await searchProperties(params);
    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
