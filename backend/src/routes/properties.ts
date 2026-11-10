import { Router, Request, Response } from 'express';
import { getPropertyById } from '../services/propertyService';
import { Currency } from '../types';
import { currencyValidationMiddleware } from '../middleware/validateCurrency';

const router = Router();

router.get('/properties/:id', currencyValidationMiddleware, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const currency = (req.query.currency as Currency) || 'USD';

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const property = await getPropertyById(id, currency);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
