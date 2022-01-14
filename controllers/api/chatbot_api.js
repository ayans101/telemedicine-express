const Chatbot = require("../../models/chatbot");
const Log = require("../../models/log");
const User = require("../../models/user");

module.exports.create = async function (req, res) {
  try {
    let user = await User.findById(req.body.user);
    await Chatbot.create(req.body, async function (err, chatbot) {
      let log = new Log({
        type: "Chatbot",
        user: user,
        description: "Created",
      });
      await log.save();
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
    let log = new Log({
      type: "Chatbot",
    //   user: chatbot.user,
      description: "Fetched by Id",
    });
    await log.save();
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
    let log = new Log({
      type: "Chatbot",
      description: "Fetched All",
    });
    await log.save();

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
