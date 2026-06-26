# Lab Inventory Manager - Quick Start Guide

## Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- pnpm (or npm)

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Configure Database

### Option A: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Add your IP address to the whitelist
4. Create a database user with password
5. Copy the connection string

### Option B: Local MongoDB
```bash
# Install MongoDB locally
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb

# Start MongoDB
mongod
```

## Step 3: Set Environment Variables

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lab-inventory
JWT_SECRET=your_random_secret_key_here
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

## Step 4: Create First Admin Account

Insert this document into MongoDB (`lab-inventory` database, `employees` collection):

```javascript
{
  "employeeId": "ADMIN-001",
  "name": "Administrator",
  "email": "admin@lab.com",
  "password": "$2a$10$Ky6/viwVwJCvvHPJNT9fj.9ExhSCZfKBIpVP/3SLJPQz5YQZL3zri", // password123
  "role": "admin",
  "department": "Administration",
  "phoneNumber": "1234567890",
  "createdAt": ISODate(),
  "isActive": true
}
```

Or use MongoDB Compass to insert manually.

## Step 5: Run the Application

```bash
pnpm dev
```

Navigate to `http://localhost:3000`

## Step 6: Login

- **Employee ID**: ADMIN-001
- **Password**: password123

## Step 7: Generate Employee Codes

1. Go to Dashboard
2. Click "Generate Code"
3. Share with employees

## Troubleshooting

### "MONGODB_URI is not set"
- Create `.env.local` file
- Add your MongoDB connection string
- Restart dev server

### "Invalid connection string"
- Check MongoDB URI format
- Verify credentials
- Test connection in MongoDB Compass

### "Cannot connect to database"
- MongoDB service not running (for local)
- Check IP whitelist (for Atlas)
- Verify network connectivity

## Database Collections

The app automatically creates these collections with proper indexes:
- `employees` - User accounts
- `equipment` - Lab equipment inventory
- `checkouts` - Equipment checkout records
- `registrationCodes` - Employee registration codes

## Default Test User

- **ID**: ADMIN-001
- **Password**: password123
- **Role**: Admin

Change this password after first login!

## Common Tasks

### Add Equipment
1. Login as Admin
2. Go to Equipment Management
3. Click "Add Equipment"
4. Fill in details and submit

### Register Employee
1. Generate code in Admin Dashboard
2. Share code with employee
3. Employee goes to /register
4. Enter code and personal details
5. Account created

### Checkout Equipment
1. Employee logs in
2. Go to "Checkout Equipment"
3. Select equipment and quantity
4. Submit request
5. Equipment quantity updates automatically

### Return Equipment
1. Employee goes to "My Checkouts"
2. Select item to return
3. Assess condition
4. Submit return
5. Equipment available again

## File Structure

```
lab-inventory/
├── app/
│   ├── api/                 # API routes
│   ├── admin/               # Admin pages
│   ├── employee/            # Employee pages
│   ├── login/               # Login page
│   └── register/            # Registration page
├── components/
│   ├── admin/               # Admin components
│   ├── employee/            # Employee components
│   └── ui/                  # UI components
├── lib/
│   ├── db.ts                # Database connection
│   ├── auth.ts              # Authentication utilities
│   ├── schemas.ts           # Validation schemas
│   └── helpers.ts           # Helper functions
├── types/
│   └── index.ts             # TypeScript types
└── middleware.ts            # Route protection
```

## Next Steps

1. Customize equipment categories
2. Set up your lab's departments
3. Import existing equipment data
4. Create test accounts
5. Configure notification settings (optional)

## Support

For issues:
1. Check README.md for detailed documentation
2. Review error messages in browser console
3. Check MongoDB logs
4. Verify all environment variables are set
