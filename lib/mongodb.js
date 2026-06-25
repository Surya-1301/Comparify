import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please set MONGODB_URI in your environment');
}

const options = { serverSelectionTimeoutMS: 10000 };

function createClientPromise() {
  const c = new MongoClient(uri, options);
  return c.connect().catch(err => {
    // Reset so next request retries rather than serving a cached rejection
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientPromise = null;
    }
    throw err;
  });
}

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = createClientPromise();
}

export default clientPromise;
