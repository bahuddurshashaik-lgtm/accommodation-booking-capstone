import { Router, Request, Response } from 'express';
import { getPropertyById } from '../services/propertyService';
import { BookingQuoteResponse, Currency } from '../types';
import { currencyValidationMiddleware } from '../middleware/validateCurrency';

const router = Router();

async function generateQuote(
  propertyId: number,
  nights: number,
  currency: Currency
): Promise<BookingQuoteResponse | null> {
  const property = await getPropertyById(propertyId, currency);

  if (!property) {
    return null;
  }

  const subtotalCents = property.nightly_price_cents * nights;

  return {
    property_id: property.id,
    property_name: property.name,
    nightly_price_cents: property.nightly_price_cents,
    nights,
    subtotal_cents: subtotalCents,
    currency
  };
}

router.get('/booking/quote', currencyValidationMiddleware, async (req: Request, res: Response) => {
  try {
    const propertyId = parseInt(req.query.property_id as string);
    const nights = parseInt(req.query.nights as string);
    const currency = (req.query.currency as Currency) || 'USD';

    if (isNaN(propertyId) || isNaN(nights) || nights <= 0) {
      return res.status(400).json({ error: 'Invalid property_id or nights' });
    }

    const quote = await generateQuote(propertyId, nights, currency);

    if (!quote) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(quote);
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/booking/quote', currencyValidationMiddleware, async (req: Request, res: Response) => {
  try {
    const { property_id, nights, currency = 'USD' } = req.body;

    if (!property_id || !nights || nights <= 0) {
      return res.status(400).json({ error: 'Invalid property_id or nights' });
    }

    const quote = await generateQuote(property_id, nights, currency as Currency);

    if (!quote) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(quote);
  } catch (error) {
    console.error('Post quote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
