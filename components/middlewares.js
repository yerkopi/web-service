/**
 * Key middleware
 */
const keyMiddleware = (req, res, next) => {
    if (req.query.k === key.uuid) {
        if (Date.now() - key.time > process.env.KEY_TIMEOUT_MS)
            key = {}
        next()
    } else {
        res.status(401).send('unauthorized')
    }
}

module.exports = { keyMiddleware }
