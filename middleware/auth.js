const jwt = require("jsonwebtoken")


module.exports = (req, res, next) => {
    const token = req.headers.authorization

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if(err) {
            return res.send({message: "bad token", success: false, data: null});
        } else {
            req.body.user = user
            next()
        }
    })
}
