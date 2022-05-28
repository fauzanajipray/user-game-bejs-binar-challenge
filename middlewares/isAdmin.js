const isAdmin = (req, res, next) => {
    const user = req.user.toJSON()
    if (user.role_id === 1) {
        next()
    } else {
        res.render("404");
    }
};

module.exports = isAdmin;