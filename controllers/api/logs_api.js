const Log = require('../../models/log');

module.exports.create = async function(req, res) {
    try {
        let log = new Log(req.body);
        await log.save(function(err, log) {
                if(err) {
                    return res.status(503).json({
                        message: "Log Not Reported Successfully",
                        success: false,
                    });
                }
                return res.status(200).json({
                    message: "Log Reported Successfully",
                    success: true,
                    log: log
                });
        })

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });  
    }
}