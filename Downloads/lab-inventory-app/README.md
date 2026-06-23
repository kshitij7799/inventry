# Lab Inventory Manager

A professional web application for managing laboratory equipment inventory, tracking checkouts and returns, and maintaining equipment accountability. Built with Next.js 16, MongoDB, and TypeScript.

## Features

### Admin Features
- **Equipment Management**: Add, edit, and track all lab equipment with quantity and condition status
- **Employee Management**: Register and manage employee accounts with unique codes
- **Registration Codes**: Generate secure registration codes for employee onboarding
- **Checkout Tracking**: View all active and historical equipment checkouts
- **Reports & Analytics**: Generate insights on equipment usage and availability
- **Status Management**: Activate/deactivate employee accounts
- **Dashboard Overview**: Real-time statistics on equipment and checkouts

### Employee Features
- **Equipment Checkout**: Browse available equipment and request checkouts
- **My Checkouts**: View and manage currently checked-out equipment
- **Return Equipment**: Return equipment with condition assessment
- **Checkout History**: Complete audit trail of all checkout and return transactions
- **Personal Dashboard**: Quick access to checkout status and statistics

### System Features
- **Role-Based Access Control**: Separate admin and employee portals with appropriate permissions
- **Secure Authentication**: JWT-based authentication with password hashing (bcryptjs)
- **Data Persistence**: MongoDB database for reliable data storage
- **Real-Time Inventory**: Automatic quantity updates on checkout/return
- **Audit Trail**: Complete history of all equipment transactions
- **Professional UI**: Dark theme with responsive design

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes, Server Components
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs, HTTP-only cookies
- **Styling**: Tailwind CSS, shadcn/ui
- **Validation**: Zod
- **Development**: Turbopack, pnpm

## Prerequisites

Before running the application, ensure you have:
- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- A MongoDB connection string (URI)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd lab-inventory
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy from the example file
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
# MongoDB Connection URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lab-inventory

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_random_secret_key_here
```

### 3. Seed Demo Data

Run the seed script to insert demo users, sample equipment, registration codes, and checkout records into MongoDB.

```bash
pnpm run seed
```

This script will automatically load `.env.local` if it exists, or fall back to `mongodb://localhost:27017/lab-inventory`.

> Note: MongoDB must be running and accessible at the configured URI before seeding. If you are using a local database, start `mongod` first.

### 4. Start the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Initial Setup

### 1. Seed Demo Data

If you have already set up your MongoDB connection, run:

```bash
pnpm run seed
```

This creates demo accounts and sample inventory data in MongoDB:
- Admin user: `admin01 / password123`
- Employee user: `emp001 / password123`
- Employee user: `emp002 / password123`
- Sample equipment items, registration codes, and checkout records

### 2. Login and Generate Codes

1. Go to `http://localhost:3000/login`
2. Use credentials: `admin01` / `password123`
3. Navigate to Dashboard
4. Click "Generate Code" to create employee registration codes
5. Share codes with employees for registration

### 3. Employee Registration

1. Go to `http://localhost:3000/register`
2. Fill in the form with personal details
3. Enter the registration code provided by admin
4. Submit to create account

## Database Schema

### Employees Collection
```javascript
{
  employeeId: String (unique),
  name: String,
  email: String (unique),
  password: String (hashed),
  registrationCode: String,
  role: "admin" | "employee",
  department: String,
  phoneNumber: String,
  createdAt: Date,
  isActive: Boolean
}
```

### Equipment Collection
```javascript
{
  equipmentId: String (unique),
  name: String,
  description: String,
  totalQuantity: Number,
  availableQuantity: Number,
  category: String,
  location: String,
  condition: "good" | "fair" | "damaged",
  dateAdded: Date,
  lastUpdated: Date
}
```

### Checkouts Collection
```javascript
{
  checkoutId: String (unique),
  equipmentId: ObjectId,
  employeeId: ObjectId,
  quantityCheckout: Number,
  checkoutDateTime: Date,
  returnDateTime: Date,
  status: "checked_out" | "returned" | "overdue",
  returnCondition: "good" | "fair" | "damaged",
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Registration Codes Collection
```javascript
{
  code: String (unique),
  createdBy: ObjectId,
  usedBy: ObjectId,
  isUsed: Boolean,
  expiresAt: Date,
  createdAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New employee registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Admin Routes
- `GET /api/admin/equipment` - List all equipment
- `POST /api/admin/equipment` - Add new equipment
- `GET /api/admin/employees` - List all employees
- `PUT /api/admin/employees` - Update employee status
- `POST /api/admin/generate-code` - Generate registration code
- `GET /api/admin/checkouts` - View all checkouts

### Employee Routes
- `GET /api/equipment` - Get available equipment
- `POST /api/employee/checkout` - Checkout equipment
- `GET /api/employee/checkout` - Get user's active checkouts
- `POST /api/employee/return` - Return equipment
- `GET /api/employee/history` - Get checkout history

## Usage Guide

### For Admins

1. **Login**: Navigate to login page with admin credentials
2. **Add Equipment**: Go to Equipment Management to add lab equipment
3. **Generate Codes**: Create registration codes in Dashboard
4. **Manage Employees**: View and activate/deactivate employee accounts
5. **Track Checkouts**: Monitor all equipment checkouts and returns
6. **View Reports**: Access analytics and inventory insights

### For Employees

1. **Register**: Use the registration code to create your account
2. **Login**: Access your employee dashboard
3. **Browse Equipment**: View all available equipment in the system
4. **Checkout Equipment**: Select equipment and quantity to check out
5. **Return Equipment**: Return equipment and assess its condition
6. **View History**: Track your complete checkout history

## Authentication Architecture

### MongoDB User Storage
All user credentials are securely stored in the MongoDB `employees` collection:
- Passwords are hashed using bcryptjs with salt rounds of 10
- User roles (admin/employee) are stored in the database
- Employee accounts can be deactivated while preserving data history

### Login Flow
1. User submits credentials to `POST /api/auth/login`
2. Server queries MongoDB `employees` collection for matching `employeeId`
3. Password is verified using bcryptjs against the stored hash
4. On success, JWT token is created and set in HTTP-only cookie
5. Token includes: employeeId, role, email
6. Token expires in 7 days

### Token Validation
- `POST /api/auth/me` returns current authenticated user from MongoDB
- All protected routes verify the JWT token from cookies
- Admin routes enforce role-based access control (role === 'admin')

### Password Security
- Passwords are never stored in plain text
- Bcryptjs uses PBKDF2-SHA512 algorithm with 10 salt rounds
- Password verification is timing-safe to prevent brute force attacks

## Security Features

- **Password Hashing**: Bcryptjs for secure password storage
- **JWT Authentication**: Tokens expire in 7 days
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Input Validation**: Zod validation on all inputs
- **Role-Based Access**: Separate dashboards for admins and employees
- **Middleware Protection**: Protected routes require authentication
- **MongoDB Direct**: User credentials stored and validated directly in MongoDB

## Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Connect your repository to Vercel dashboard
# Set environment variables in Vercel project settings
# Deploy automatically on push
```

### Environment Variables for Production

Set these in your Vercel project settings:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your JWT secret key

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database permissions are correct

### Login Failures
- Confirm employee account exists in database
- Verify password is correct
- Check if employee account is active (isActive: true)

### Checkout Errors
- Ensure equipment exists in database
- Check available quantity is sufficient
- Verify employee account is active

## Support

For issues and feature requests, please check the documentation or contact the development team.

## License

This project is proprietary and confidential.

Admin credentials: admin01 / password123
Employee credentials: emp001 / password123, emp
Registration codes: REG-ADMIN-01, REG-EMP-01