# Fluxo Frontend v2

A modern marketplace dashboard built with Nuxt 3, Pinia, Vue Router, and Naive UI.

## Features

- 🎨 **Modern UI** - Beautiful interface with purple, yellow, and white color scheme
- 🌓 **Dark Mode** - Full dark mode support
- 💱 **Multi-Currency** - Support for CHF (default), USD, and EUR
- 📊 **Analytics Dashboard** - Charts and statistics for business insights
- 💬 **Real-time Chat** - Messaging system between users and providers
- 📅 **Booking Management** - Easy booking creation and management
- 🧾 **Invoice System** - Complete invoicing workflow
- 🔔 **Notifications** - Real-time notification system
- 🔐 **Authentication** - Secure login and registration with Laravel Sanctum
- 📱 **Responsive** - Works on all devices

## Tech Stack

- **Nuxt 3** - Vue.js framework
- **Pinia** - State management
- **Naive UI** - Component library
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **TypeScript** - Type safety

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Create a `.env` file in the root directory:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
NUXT_PUBLIC_API_PUBLIC=http://localhost:8000/api
```

3. **Run the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

## Currency Support

The application supports three currencies:
- **CHF** (Swiss Franc) - Default currency
- **USD** (US Dollar)
- **EUR** (Euro)

Users can switch between currencies using the currency selector in the dashboard header.

## Color Scheme

### Primary Colors (Purple)
- Primary: `#a855f7`

### Secondary Colors (Yellow)
- Secondary: `#eab308`

### Dark Mode Support
Full light and dark mode theme support with automatic persistence.

## License

MIT
