import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, trim: true, index: true },
    publicationDate: { type: Date },
    genre: { type: String, trim: true },
    availableCopies: { type: Number, default: 1, min: 0 },
    totalCopies: { type: Number, default: 1, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
