import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/url.routes.js";
import errorHandler from "./middlewares/error.js";


dotenv.config();

// Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Routes
app.use("/api/urls", urlRoutes);

// Error handler
app.use(errorHandler);



// Start the server
const startServer = () => {
  try {
    // Connect to DB
    connectDB();
    // Start & listen to the requests
    app.listen(PORT, () => console.log(`Server started listening on PORT: ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

startServer();