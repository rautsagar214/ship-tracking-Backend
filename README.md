# ShipTrack Backend

Backend API for the ShipTrack application, a comprehensive shipping and tracking management system.

## Features

- User Authentication (Admin)
- Shipment Management
- Contact/Enquiry Management
- Real-time Tracking
- Status Updates

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ship-tracking-backend.git
cd ship-tracking-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_PASSKEY=your_admin_password
NODE_ENV=development
```

4. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login

### Shipments

- `GET /api/shipments` - Get all shipments
- `POST /api/shipments` - Create new shipment
- `PATCH /api/shipments/:id/status` - Update shipment status
- `PATCH /api/shipments/:id/location` - Update shipment location

### Contact/Enquiries

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all enquiries (protected)
- `PATCH /api/contact/:id` - Update enquiry status (protected)

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `ADMIN_PASSKEY` - Admin login password
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
