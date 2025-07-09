require("dotenv").config();
const express = require("express");
const connectDB = require("./db/dbconnection");
const router = require('./routes/appRouter')
const app = express();
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors');
app.use(cors());


app.use(express.json());
//connecting to the database
connectDB();
//routing 
app.use('/api',router);
//middleware for error handling
app.use(errorHandler);


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});





























































// async function run() {
//   try {
//     await connectDB();

//     const parsedJSON = await getIntentFromLLM();

//     if (!parsedJSON) {
//       console.log("❌ No valid JSON returned from LLM.");
//       return;
//     }

//     const saved = await Intent.create(parsedJSON);
//     console.log("✅ Successfully saved to MongoDB:", saved);
//   } catch (error) {
//     console.error("❌ Error:", error.message);
//   } finally {
//     process.exit(); // Exit the script
//   }
// }

// run();
