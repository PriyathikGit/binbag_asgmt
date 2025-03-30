import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './utils/ErrorHandler.js';
import connectDB from './db/dbConfig.js';

const app = express();

// Middleware
dotenv.config();


app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
const PORT = process.env.PORT || 5000;
// Database connection
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('error while connecting database',err));

// Routes
import userRoutes from "./routes/user.routes.js"
app.use('/api/user', userRoutes);

// Error handling middleware
app.use(errorHandler);
