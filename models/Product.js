const mongoose = require(`mongoose`)

const productSchema = new mongoose.Schema({
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  name:{
    type: String,
    required: [true, 'Must provide Product name']
  },
  price: {
    type: Number,
    required: [true, 'Must provide Product price']
  },
  company: {
    type: String,
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      message: '{VALUE} is not supported',
    }
    // enum: ['ikea', 'liddy', 'caressa', 'marcos']
  }
})

module.exports = mongoose.model('Product', productSchema)