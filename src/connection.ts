import mongoose from "mongoose";

const Connection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL as string);

    console.log(`connected to ${connect.connection.host}`);
  } catch (error) {
    console.log({
      error: "Error while connecting to database" + error,
    });
  }
};

export default Connection;
