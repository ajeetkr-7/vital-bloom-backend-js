import express from 'express';
import cors from 'cors';
import config from './utils/config.js'
import dbConnect from './utils/db.js'
import logger from './utils/logger.js'
import { errorHandler, notFound } from './utils/middleware.js';
import userRoute from './user/user.route.js'
import authRoute from './auth/auth.route.js'
import apiRoute from './api/api.route.js'
import dotenv from 'dotenv';
dotenv.config();

logger.info(config.MONGOOSE_URI);
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

dbConnect(() => app.listen(config.PORT, () => {
    logger.info(`server listening on ${config.PORT}`)
}));


app.get('/', (req, res, next) => {
    res.json('Namaste World from Vital Bloom API!');
})

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/api', apiRoute);

app.use(notFound);
app.use(errorHandler);
