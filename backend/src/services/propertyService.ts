import { allQuery, getQuery } from '../db/database';
import { Property, PropertyResponse, SearchParams, SearchResponse, Currency } from '../types';
import { convertPrice } from './currencyService';

export async function searchProperties(params: SearchParams): Promise<SearchResponse> {
  let sql = 'SELECT * FROM properties WHERE 1=1';
  const sqlParams: any[] = [];

  // Filter by location
  if (params.location) {
    sql += ' AND location LIKE ?';
    sqlParams.push(`%${params.location}%`);
  }

  // Filter by Wi-Fi
  if (params.freeWifi !== undefined) {
    sql += ' AND free_wifi = ?';
    sqlParams.push(params.freeWifi ? 1 : 0);
  }

  // Get total count for pagination
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count');
  const countResult = await getQuery<{ count: number }>(countSql, sqlParams);
  const total = countResult?.count || 0;

  // Apply sorting
  const validSortColumns = ['name', 'location', 'nightly_price_usd_cents'];
  const sortColumn = validSortColumns.includes(params.sortBy) ? params.sortBy : 'name';
  const sortOrder = params.sortOrder === 'desc' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

  // Apply pagination
  const limit = params.limit || 10;
  const page = params.page || 1;
  const offset = (page - 1) * limit;
  sql += ' LIMIT ? OFFSET ?';
  sqlParams.push(limit, offset);

  // Execute query
  const properties = await allQuery<Property>(sql, sqlParams);

  // Convert prices to target currency
  const convertedProperties: PropertyResponse[] = properties.map(prop => ({
    id: prop.id,
    name: prop.name,
    location: prop.location,
    description: prop.description,
    nightly_price_cents: convertPrice(prop.nightly_price_usd_cents, params.currency as Currency),
    currency: params.currency,
    free_wifi: Boolean(prop.free_wifi),
    image_url: prop.image_url
  }));

  return {
    properties: convertedProperties,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    filters: params
  };
}

export async function getPropertyById(id: number, currency: Currency): Promise<PropertyResponse | null> {
  const property = await getQuery<Property>('SELECT * FROM properties WHERE id = ?', [id]);

  if (!property) {
    return null;
  }

  return {
    id: property.id,
    name: property.name,
    location: property.location,
    description: property.description,
    nightly_price_cents: convertPrice(property.nightly_price_usd_cents, currency),
    currency,
    free_wifi: Boolean(property.free_wifi),
    image_url: property.image_url
  };
}
