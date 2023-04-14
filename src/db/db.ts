import mongoose from "mongoose";

const options = {
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
  
};

const connectToDB = async () => {
  console.log("MongoDB connection started at..." + process.env.DB );
  const connect = await mongoose.connect(process.env.DB!, options);

  console.log(`MongoDB connected: ${connect.connection.host}`);

};

module.exports = connectToDB;