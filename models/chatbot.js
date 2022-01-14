const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    age: {
      type: String,
    },
    height: {
      type: String,
    },
    BP: {
      type: String,
    },
    symptoms: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chatbot = mongoose.model("Chatbot", chatbotSchema);

module.exports = Chatbot;
