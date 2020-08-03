const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../model/tourModel');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Connect to DB
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('From server.js: Database connected successfully');
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importTourData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteTourData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--importData') {
  importTourData();
} else if (process.argv[2] === '--deleteData') {
  deleteTourData();
}
