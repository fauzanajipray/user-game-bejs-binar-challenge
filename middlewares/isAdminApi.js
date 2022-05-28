const response = require("../utils/formatResponse");
const isAdmin = (req, res, next) => {
    const user = req.user
    if (user.role_id === 1) {
        next()
    } else {
        return response(res, 401, false, 'Forbidden', null)
    }
};

module.exports = isAdmin;