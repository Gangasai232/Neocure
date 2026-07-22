import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async () => {
  const dnsServers = process.env.MONGO_DNS_SERVERS
    ? process.env.MONGO_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean)
    : [];

  if (dnsServers.length > 0) {
    try {
      dns.setServers(dnsServers);
      console.log(`Mongo DNS servers set to: ${dnsServers.join(", ")}`);
    } catch (dnsErr) {
      console.log(`Unable to set Mongo DNS servers: ${dnsErr}`);
    }
  }

  const primaryUri = process.env.MONGO_URL;
  const fallbackUri = process.env.MONGO_URL_FALLBACK;

  try {
    const connection = await mongoose.connect(primaryUri);
    console.log(`MongoDB Connected (primary): ${connection.connection.host}`);
    return true;
  } catch (err) {
    console.log(`Primary MongoDB connection failed: ${err}`);

    if (fallbackUri) {
      try {
        const fallbackConnection = await mongoose.connect(fallbackUri);
        console.log(`MongoDB Connected (fallback): ${fallbackConnection.connection.host}`);
        return true;
      } catch (fallbackErr) {
        console.log(`Fallback MongoDB connection failed: ${fallbackErr}`);
      }
    }

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }

    console.log("Continuing without MongoDB connection in development mode.");
    return false;
  }
};

export default connectDB;
