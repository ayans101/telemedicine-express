const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    age: {
      type: string,
    },
    height: {
      type: string,
    },
    BP: {
      type: string,
    },
    symptoms: [
      {
        type: string,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chatbot = mongoose.model("Chatbot", chatbotSchema);

module.exports = Chatbot;
