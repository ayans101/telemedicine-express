const mongoose = require('mongoose');

const loggerSchema = new mongoose.Schema({
    loggertype: {
        type: String,
        enum : ['SIGNUP','VIDEO_IN'],
    },
    user: {
        type: String
    },
    description: {
        type: String
    }
});


const Logger = mongoose.model('Logger', loggerSchema);

module.exports = Logger;