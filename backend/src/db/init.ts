import fs from 'fs';
import path from 'path';
import { db, runQuery } from './database';

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await runQuery(schema);
    console.log('Schema created successfully');

    // Seed data - 30 properties with mix of locations, prices, and Wi-Fi
    const seedData = [
      // Wi-Fi properties (15)
      { name: 'Cozy Studio Paris', location: 'Paris', description: 'A comfortable studio in the heart of Paris', price: 8500, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Luxury Apartment Paris', location: 'Paris', description: 'Spacious luxury apartment with city views', price: 25000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Beach House Barcelona', location: 'Barcelona', description: 'Beautiful beach house near the sea', price: 15000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Modern Loft Barcelona', location: 'Barcelona', description: 'Contemporary loft in Gothic Quarter', price: 18000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Central Flat London', location: 'London', description: 'Central London flat near attractions', price: 22000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Thames View London', location: 'London', description: 'Apartment with stunning Thames views', price: 28000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Canal House Amsterdam', location: 'Amsterdam', description: 'Historic canal house with modern amenities', price: 20000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Garden Suite Amsterdam', location: 'Amsterdam', description: 'Peaceful suite with private garden', price: 16500, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Alpine Chalet Berlin', location: 'Berlin', description: 'Cozy chalet near city center', price: 14000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Design Studio Berlin', location: 'Berlin', description: 'Minimalist design studio', price: 12000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Riverside Apartment Rome', location: 'Rome', description: 'Beautiful riverside location', price: 17500, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Historic Villa Rome', location: 'Rome', description: 'Restored historic villa', price: 30000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Harbor View Lisbon', location: 'Lisbon', description: 'Stunning harbor views', price: 13500, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'Hillside Retreat Lisbon', location: 'Lisbon', description: 'Peaceful hillside location', price: 11000, wifi: 1, image: 'https://via.placeholder.com/400x300' },
      { name: 'City Center Prague', location: 'Prague', description: 'Prime city center location', price: 9500, wifi: 1, image: 'https://via.placeholder.com/400x300' },

      // Non-Wi-Fi properties (15)
      { name: 'Budget Room Paris', location: 'Paris', description: 'Affordable room in Paris', price: 6000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'City Apartment London', location: 'London', description: 'Standard city apartment', price: 12000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Town House Barcelona', location: 'Barcelona', description: 'Traditional town house', price: 10500, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Basic Studio Amsterdam', location: 'Amsterdam', description: 'No-frills studio apartment', price: 8000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Simple Flat Berlin', location: 'Berlin', description: 'Simple and clean flat', price: 7500, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Economy Room Rome', location: 'Rome', description: 'Economy accommodation', price: 9000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Standard Suite Lisbon', location: 'Lisbon', description: 'Standard suite accommodation', price: 8500, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Classic Room Prague', location: 'Prague', description: 'Classic room style', price: 7000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Vintage Apartment Paris', location: 'Paris', description: 'Vintage style apartment', price: 11000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Traditional Flat London', location: 'London', description: 'Traditional English flat', price: 14000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Seaside Cottage Barcelona', location: 'Barcelona', description: 'Charming seaside cottage', price: 13000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Old Town Suite Amsterdam', location: 'Amsterdam', description: 'Suite in old town', price: 15000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Quiet Studio Berlin', location: 'Berlin', description: 'Quiet residential area', price: 10000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Countryside Villa Rome', location: 'Rome', description: 'Villa on the countryside', price: 19000, wifi: 0, image: 'https://via.placeholder.com/400x300' },
      { name: 'Port District Lisbon', location: 'Lisbon', description: 'Property in port district', price: 12500, wifi: 0, image: 'https://via.placeholder.com/400x300' },
    ];

    for (const prop of seedData) {
      await runQuery(
        'INSERT INTO properties (name, location, description, nightly_price_usd_cents, free_wifi, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [prop.name, prop.location, prop.description, prop.price, prop.wifi, prop.image]
      );
    }

    console.log(`Seeded ${seedData.length} properties`);
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
