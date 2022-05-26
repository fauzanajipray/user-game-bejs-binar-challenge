module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("alertMessage", "Silahkan Login Kembali!");
    req.flash("alertStatus", "danger");
    res.redirect('/login');
};