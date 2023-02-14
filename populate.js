require('dotenv').config();

const connectDB = require('./db/connect')
const Product = require('./models/Product')

const jsonProducts = require('./products.json');

async function populateProducts(){
  try{
    await connectDB();
    await Product.deleteMany(); // deleting previous data
    await Product.create(jsonProducts);
    console.log('Success -- Populated the database')
    process.exit(0);
  }catch(error){
    console.log(error)
    process.exit(1)
  }
}

populateProducts();