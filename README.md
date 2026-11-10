# Accommodation Booking Capstone

A simple accommodation booking application with search, filtering, and currency conversion features.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite
- **E2E Testing**: Playwright

## Features Implemented

### EPMCDMETST-71236: Free Wi-Fi Filter
- Filter properties by free Wi-Fi availability
- Filter persists across sorting and pagination
- Filter state maintained in URL

### EPMCDMETST-71235: Currency Selector
- Support for USD, EUR, GBP currencies
- Currency selection persists across navigation
- Accurate currency conversion with static exchange rates
- Prices displayed in integer cents, formatted on frontend

## Quick Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Install all dependencies:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../e2e && npm install
cd ..
```

2. Initialize the database:
```bash
cd backend
npm run db:init
cd ..
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Running E2E Tests

Make sure both backend and frontend are running, then:
```bash
cd e2e
npx playwright install chromium
npm run test
```

## API Endpoints

- `GET /api/search` - Search properties with filters, sorting, pagination
- `GET /api/properties/:id` - Get property details
- `GET /api/booking/quote` - Get booking quote
- `POST /api/booking/quote` - Get booking quote (POST method)

## Database

SQLite database located at: `backend/data/accommodations.db`
Contains 30 sample properties (15 with Wi-Fi, 15 without)

## Currency Conversion

- **Exchange Rates** (USD-based):
  - USD: 1.00
  - EUR: 0.92
  - GBP: 0.78
  
- **Conversion Rule**: `Math.round(usdCents * exchangeRate)`
- Backend stores prices in USD cents
- Backend returns prices in integer cents (converted)
- Frontend formats cents to readable amounts with currency symbols

## Project Structure

```
accommodation-booking-capstone/
├── backend/          # Express API server
├── frontend/         # React application
├── e2e/             # Playwright tests
└── README.md
```

## Testing the Features

1. **Free Wi-Fi Filter**:
   - Check "Free Wi-Fi only" checkbox
   - Change sort order → filter persists
   - Navigate pages → filter persists
   
2. **Currency Selector**:
   - Change currency dropdown (USD/EUR/GBP)
   - Click property → currency persists
   - Get booking quote → uses same currency

## Repository

https://github.com/bahuddurshashaik-lgtm/accommodation-booking-capstone.git
