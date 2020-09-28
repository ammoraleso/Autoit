const express = require('express');
const logger = require('./logger/logger')(module);
const userRouter = require('./router/userRouter');
const transactionRouter = require('./router/transactionRouter');
const database = require('./database/databaseMongoose');
require('colors');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(transactionRouter);

app.listen(port, async () => {
  try {
    logger.info(`initialize Mongo`);
    await database.initializeMongo();
  } catch (e) {
    logger.error(e.message);
  }
  logger.info(`Server is up on ${port}`);
});
