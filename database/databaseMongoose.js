require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../logger/logger')(module);

const connectionURL = process.env.DATABASE_CONECTION;

const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

exports.initializeMongo = async () => {
  try {
    await mongoose.connect(connectionURL, mongoConfig);
    logger.info('Connection Established');
  } catch (e) {
    throw new Error(`Error initializing mongo ${e}`);
  }
};
