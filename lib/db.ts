import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-inventory';
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db('lab-inventory');

  // Create indexes
  const employees = db.collection('employees');
  const equipment = db.collection('equipment');
  const checkouts = db.collection('checkouts');
  const registrationCodes = db.collection('registrationCodes');

  await employees.createIndex({ employeeId: 1 }, { unique: true });
  await employees.createIndex({ email: 1 }, { unique: true });
  await employees.createIndex({ registrationCode: 1 }, { unique: true, sparse: true });

  await equipment.createIndex({ equipmentId: 1 }, { unique: true });

  await checkouts.createIndex({ checkoutId: 1 }, { unique: true });
  await checkouts.createIndex({ equipmentId: 1 });
  await checkouts.createIndex({ employeeId: 1 });
  await checkouts.createIndex({ status: 1 });

  await registrationCodes.createIndex({ code: 1 }, { unique: true });
  await registrationCodes.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getDatabase() {
  const { db } = await connectToDatabase();
  return db;
}
