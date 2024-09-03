const mongodb = require("mongodb");
require("dotenv").config();

const MongoClient = mongodb.MongoClient;
let db;

const mongoConnect = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
    db = client.db();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getDB = () => db;

module.exports = { mongoConnect, getDB };
