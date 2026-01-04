import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    // Append database name if not already specified
    const finalUri = uri.includes('/animerch') ? uri : `${uri}/animerch`;
    await mongoose.connect(finalUri);
    console.log("✅ MongoDB Connected to animerch database");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed", err);
    process.exit(1);
  }
};

export default connectDB;