import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      chalk.bgGreen(`Connected To MongoDB Database ${conn.connection.host}`)
    );
  } catch (error) {
    console.log(chalk.bgRed(`Error in Mongodb Database ${error}`));
  }
};

export default connectDB;
