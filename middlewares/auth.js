const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');

const auth = (req, res, next) => {
    const token = req.headers['x-access-token'];
    const token_key = process.env.TOKEN_KEY;
    if (!token) next(new ExpressError('Token missing', 403));
    try {
        const decoded = jwt.verify(token, token_key);
        req.user = decoded;
        return next()
    } catch (e) {
        console.log(e);
        return next(new ExpressError());
    }
}

module.exports = auth;