// Importing mongoose to define a schema and create a model
const mongoose = require('mongoose');

// Creating a schema for products
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Title is a required field
      trim: true, // Trims whitespace from the title
      minlength: [3, 'Product title is too short'], // Minimum length for title is 3 characters
      maxlength: [100, 'Product title is too long'], // Maximum length for title is 100 characters
    },
    slug: {
      type: String,
      required: true, // Slug is a required field
      lowercase: true, // Converts slug to lowercase
    },
    description: {
      type: String,
      required: [true, 'Product description is required'], // Description is a required field
      minlength: [20, 'Product description is too short'], // Minimum length for description is 20 characters
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'], // Quantity is a required field
    },
    sold: {
      type: Number,
      default: 0, // Default value for the number of products sold
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'], // Price is a required field
      trim: true, // Trims whitespace from the price
      max: [300000, 'Product price is too high'], // Maximum value for price
    },
    priceAfterDiscount: {
      type: Number, // Optional field for price after discount
    },
    colors: [String], // Array of strings to store available colors

    imageCover: {
      type: String,
      required: [true, 'Product cover image is required'], // Cover image is a required field
    },
    images: [String], // Array of strings to store URLs of additional images
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'], // Category is a required field
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Subcategory',
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand', // Reference to the Brand model
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be at least 1'], // Minimum rating value
      max: [5, 'Rating must be at most 5'], // Maximum rating value
    },
    ratingsQuantity: {
      type: Number,
      default: 0, // Default value for the quantity of ratings
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Mongoose query middleware to automatically populate the 'category' field
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id', // Populate only the name of the category, excluding its _id
  });
  next(); // Proceed to the next middleware
});

// Exporting the Product model created from the schema
module.exports = mongoose.model('Product', productSchema);
