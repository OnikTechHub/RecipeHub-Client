import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from 'better-auth/plugins';


const client = new MongoClient(process.env.MONGO_DB_URI);

// 2. ক্লায়েন্ট তৈরির পর db ভেরিয়েবল ডিফাইন করতে হবে
const db = client.db(process.env.AUTH_DB_NAME || "RecipeHubDB");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),

  baseURL: process.env.BETTER_AUTH_URL, 
  
  // সিক্রেট কী এক্সপ্লিসিটলি পাস করে দেওয়া নিরাপদ
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: { 
    enabled: true, 
  },

  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID || "", 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", 
    },  
  },

  session: {
    strategy: "jwt",
    expiresIn: 7 * 24 * 60 * 60, // ৭ দিন
  },

  plugins: [
    jwt()
  ]
});