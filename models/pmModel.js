const { Schema, model } = require("mongoose");

const pmSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      min: 50,
    },
    category: {
      type: String,
      required: true,
      enum: ["realty", "transport", "electronics", "jobs"],
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
