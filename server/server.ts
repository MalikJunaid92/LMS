import { app } from "./app";
import { connectDB } from "./utilis/db";
import { redisClient } from "./utilis/redis";

require("dotenv").config();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
  redisClient;
});
