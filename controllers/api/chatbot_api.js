const Chatbot = require("../../models/chatbot");

module.exports.create = async function (req, res) {
  try {
    await Chatbot.create(req.body, function (err, chatbot) {
      return res.status(200).json({
        success: true,
        data: {
          chatbot: chatbot,
        },
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.details = async function (req, res) {
  try {
    let chatbot = await Chatbot.findById(req.params.id);
    if (!chatbot) {
      return res.status(404).json({
        message: "Not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Details Retrieved",
      success: true,
      data: {
        chatbot: chatbot,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.index = async function (req, res) {
  try {
    let list = await Chatbot.find({}).sort("-createdAt");
    res.status(200).json({
      message: "List Retrieved",
      success: true,
      data: {
        list: list,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
