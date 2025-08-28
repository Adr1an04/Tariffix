// load env variables
import dotenv from 'dotenv';

// allows us to use models and schemas for mongo db
import mongoose from 'mongoose'; 

// loads from spec env file
dotenv.config({ path: '.env' });
 const MONGODB_URI = process.env.MONGODB_URI;
 
 // debugging, print if valid
 console.log("MONGODB_URI: ", MONGODB_URI); 
 
 // error if smth wrong
 if (!MONGODB_URI) {
   throw new Error("Please define the MONGODB_URI environment variable");
 }
 
 // global.mongoose is the connection storage and when not existing, creates one
 let cached = global.mongoose;
 
 if (!cached) {
   cached = global.mongoose = { conn: null, promise: null };
 }
 
 // chekcs to see if connection is made
 export async function connectToDatabase() {
   // if already made, return
   if (cached.conn) return cached.conn;
 
   // otherwise, make one
   if (!cached.promise) {
     cached.promise = mongoose.connect(MONGODB_URI, {
       bufferCommands: false,
     });
 }
 
 // return
   cached.conn = await cached.promise;
   return cached.conn;
 
 }


// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable in .env');
// }

// // Augment the NodeJS.Global type to include our custom caching property
// declare global {
//   var mongooseCache: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// }

// // Use globalThis to persist across hot reloads in development
// const globalWithMongoose = global as typeof globalThis & {
//   mongooseCache?: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// };

// if (!globalWithMongoose.mongooseCache) {
//   globalWithMongoose.mongooseCache = { conn: null, promise: null };
// }

// const cached = globalWithMongoose.mongooseCache;

// export async function connectToDatabase() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts);
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }
