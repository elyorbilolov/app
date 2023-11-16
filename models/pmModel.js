const { Schema, model } = require("mongoose");

const pmSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Kirim", "Chiqim"],
    },
    name: {
      type: String,
      required: true,
      enum: [
        "Kunlik maosh",
        "Oylik maosh",
        "Avans",
        "KPI",
        "Premiya",
        "Ro'zg'or",
        "Kamunal tolovlar",
        "Abed",
        "Bezin",
        "O'zim uchun",
        "Va boshqalar",
      ],
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
      min: 50,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Pm", pmSchema);
