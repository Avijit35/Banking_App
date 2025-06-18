import "dotenv/config";
import mongoose from "mongoose";

const url = process.env.DB_URL;

const connectDB = async () => {
  try {
    const connectionIns = await mongoose.connect(url);
    console.log(` \n MongoDB connected ! ${connectionIns.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error ", error);
    process.exit(1);
  }
};

connectDB();

const findAllRecord = async (schema) => {
  const dbRes = await schema.find();
  return dbRes;
};

const findOneRecord = async (query, schema) => {
  const dbRes = await schema.findOne(query);
  return dbRes;
};

const createNewRecord = async (data, schema) => {
  const dbRes = await new schema(data).save();
  return dbRes;
};

const updateRecord = async (id, data, schema) => {
  const dbRes = await schema.findByIdAndUpdate(id, data, { new: true });
  return dbRes;
};

const deleteRecord = async (id, schema) => {
  const dbRes = await schema.findByIdAndDelete(id);
  return dbRes;
};

export {
  findAllRecord,
  findOneRecord,
  createNewRecord,
  updateRecord,
  deleteRecord,
};
