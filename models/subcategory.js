

// Importing the mongoose module to interact with MongoDB
const mongoose = require("mongoose");

// Creating a schema for subcategory
const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String, // Data type for name is string
      required: [true, "Subcategory is required"], // Name is required
      unique: [true, "Subcategory must be unique"], // Name must be unique across all subcategories
      minlength: [3, "Too short subcategory name"], // Minimum length for name is 3 characters
      maxlength: [32, "Too long subcategory name"], // Maximum length for name is 32 characters
    },
    slug: { 
      type: String, // Data type for slug is string
      lowercase: true // Enforce lowercase for slug
    },
    category: {
      type: mongoose.Schema.ObjectId, // Reference to another document (Category) using its ObjectId
      ref: 'Category', // The referenced model is 'Category'
      required: [true, 'Subcategory must belong to Category'] // The category is a required field
    },
    image: String, // Optional field for image, stored as a string (likely a URL)
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Creating a model from the schema
const Subcategory = mongoose.model("Subcategory", subcategorySchema);

// Exporting the model for use elsewhere in the application
module.exports = Subcategory;
