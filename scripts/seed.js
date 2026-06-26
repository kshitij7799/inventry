const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  const env = fs.readFileSync(envPath, 'utf8');
  env.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();
    if (key && value !== undefined && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

function getMongoUri() {
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-inventory';
}

async function main() {
  loadEnvFile();
  const uri = getMongoUri();
  console.log('Using MongoDB URI:', uri);
  const client = new MongoClient(uri);

  console.log('Connecting to MongoDB...');
  await client.connect();
  const db = client.db('lab-inventory');

  console.log('Seeding collections...');

  const employees = [
    {
      employeeId: 'admin01',
      name: 'Admin User',
      email: 'admin@lab.com',
      role: 'admin',
      department: 'Administration',
      phoneNumber: '1234567890',
      password: 'password123',
      isActive: true,
    },
    {
      employeeId: 'emp001',
      name: 'John Doe',
      email: 'john@lab.com',
      role: 'employee',
      department: 'Engineering',
      phoneNumber: '555-0101',
      password: 'password123',
      isActive: true,
    },
    {
      employeeId: 'emp002',
      name: 'Jane Smith',
      email: 'jane@lab.com',
      role: 'employee',
      department: 'Research',
      phoneNumber: '555-0102',
      password: 'password123',
      isActive: true,
    },
  ];

  const equipmentItems = [
    {
      equipmentId: 'EQ-001',
      name: 'Microscope',
      description: 'High-resolution lab microscope',
      quantity: 5,
      status: 'available',
      createdAt: new Date(),
    },
    {
      equipmentId: 'EQ-002',
      name: 'Centrifuge',
      description: 'Bench-top centrifuge for samples',
      quantity: 3,
      status: 'available',
      createdAt: new Date(),
    },
    {
      equipmentId: 'EQ-003',
      name: 'Thermocycler',
      description: 'PCR thermocycler for DNA amplification',
      quantity: 2,
      status: 'available',
      createdAt: new Date(),
    },
  ];

  const registrationCodes = [
    {
      code: 'REG-ADMIN-01',
      createdBy: 'admin01',
      isUsed: false,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      createdAt: new Date(),
    },
    {
      code: 'REG-EMP-01',
      createdBy: 'admin01',
      isUsed: false,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      createdAt: new Date(),
    },
  ];

  const checkouts = [
    {
      checkoutId: 'CO-001',
      equipmentId: 'EQ-001',
      employeeId: 'emp001',
      checkedOutAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      status: 'checked_out',
      condition: 'good',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      checkoutId: 'CO-002',
      equipmentId: 'EQ-002',
      employeeId: 'emp002',
      checkedOutAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
      status: 'checked_out',
      condition: 'good',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  ];

  const employeesCollection = db.collection('employees');
  const equipmentCollection = db.collection('equipment');
  const registrationCodesCollection = db.collection('registrationCodes');
  const checkoutsCollection = db.collection('checkouts');

  for (const employee of employees) {
    const passwordHash = await bcrypt.hash(employee.password, 10);
    const { password, ...rest } = employee;

    await employeesCollection.updateOne(
      { employeeId: rest.employeeId },
      {
        $set: {
          ...rest,
          password: passwordHash,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  for (const item of equipmentItems) {
    const { createdAt, ...itemData } = item;
    await equipmentCollection.updateOne(
      { equipmentId: item.equipmentId },
      {
        $set: {
          ...itemData,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt,
        },
      },
      { upsert: true }
    );
  }

  for (const code of registrationCodes) {
    await registrationCodesCollection.updateOne(
      { code: code.code },
      {
        $set: {
          createdBy: code.createdBy,
          isUsed: code.isUsed,
          expiresAt: code.expiresAt,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: code.createdAt,
        },
      },
      { upsert: true }
    );
  }

  for (const checkout of checkouts) {
    const { createdAt, ...checkoutData } = checkout;
    await checkoutsCollection.updateOne(
      { checkoutId: checkout.checkoutId },
      {
        $set: {
          ...checkoutData,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt,
        },
      },
      { upsert: true }
    );
  }

  console.log('Seed complete!');
  console.log('Admin credentials: admin01 / password123');
  console.log('Employee credentials: emp001 / password123, emp002 / password123');
  console.log('Registration codes: REG-ADMIN-01, REG-EMP-01');

  await client.close();
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
