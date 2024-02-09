const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
        type:String,
        required:[true,'Brand is required'],
        unique :[true,'Brand must be unique'],
        minlength :[3 ,'Too short brand name'],
        maxlength:[32,'Too long brand name']
    },
    slug: { type: String, lowercase: true },
    image: String,
  },
  {
    timestamps: true
  }
);

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
