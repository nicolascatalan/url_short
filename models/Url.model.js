import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  }, 
   clicks:{
    type : Number,
    required: true,
    default: 0
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
})

;

const Url = mongoose.model("Url", urlSchema);

export default Url;