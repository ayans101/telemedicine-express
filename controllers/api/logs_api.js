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

module.exports.all = async function all (req, res) {
    try {
        const logs = await Log.find();
        return res.status(200).json({
            message: "List of All Logs",
            success: true,
            logs: logs
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

module.exports.read =  async function read (req, res) {
    try {
        let log = await Log.findById(req.params.id);
        if(!log) {
            return res.status(422).json({
                message: "Invalid Log ID or Log Not Found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Log Details",
            success: true,
            log: log
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });  
    }
}
