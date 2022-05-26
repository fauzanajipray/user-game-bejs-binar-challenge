const { UserGameHistory } = require('../../../models');

module.exports = {
    // Endpoint GET /history
    index: async (req, res) => {
        try {
            const userGamesHistories = await UserGameHistory.findAll();
            const data = userGamesHistories.map(history => 
                history.toJSON()
            );
            const user = req.user.toJSON();
            res.render("layouts/user/history/index", {
                title: "Histories",
                active: "history",
                user,
                data
            })
        } catch (error) {
            res.render("error", { error });
        }
    },
    
    // Endpoint POST /history
    store: async (req, res) => {
        try {
            const {score, time_played } = req.body
            const user_id = req.user.toJSON().id
            const userGameHistory = await UserGameHistory.create({
                score: score,
                time_played: time_played,
                user_id: user_id,
            })
            if (!userGameHistory) {
                return res.status(404).json({
                    message: 'User Game History not found',
                    data: null
                })
            }
            req.flash("alertMessageHistory", "Create history success!")
            req.flash("alertStatusHistory", "success")
            res.redirect('/')
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({
                    message: 'Failed',
                    data: null,
                    error: errors
                });
            } else {
                console.log(error);
                res.status(500).json({
                    message: error.message,
                    data: null,
                });
            }
        }
    },
    // Endpoint PUT /history/:id
    update: async (req, res) => {
        try {
            const { score, time_played } = req.body;
            const id = req.params.id
            const user_id = req.user.toJSON().id

            const userGameHistory = await UserGameHistory.update({
                score: score,
                time_played: time_played,
                user_id: user_id,
            }, { where: { id : id } });

            if (!userGameHistory) {
                req.flash("alertMessageHistory", "User Game History not found");
                req.flash("alertStatusHistory", "danger");
                res.redirect('/profile/edit-history/' + id);
            } 
            req.flash("alertMessageHistory", "Update history success!");
            req.flash("alertStatusHistory", "success");
            res.redirect('/');
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                req.flash("alertMessage", "Update history failed!");
                req.flash("alertStatus", "danger");
                res.redirect('/profile/edit-history/'+ req.params.id)
            } else {
                req.flash("alertMessage", "Internal Server Error!");
                req.flash("alertStatus", "danger");
                res.redirect('/profile/edit-history/'+ req.params.id)
            }
        }
    },
    // Endpoint DELETE /history/:id
    destroy: async (req, res) => {
        try {
            const id = req.params.id

            const userGameHistory = await UserGameHistory.destroy({
                where: { id : id }
            });
            if (!userGameHistory) {
                req.flash("alertMessageHistory", "User Game History not found");
                req.flash("alertStatusHistory", "danger");
                res.redirect('/');
            }
            req.flash("alertMessageHistory", "Delete history success!");
            req.flash("alertStatusHistory", "success");
            res.redirect('/');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                req.flash("alertMessageHistory", "Update history failed!");
                req.flash("alertStatusHistory", "danger");
                res.redirect('/')
            } else {
                req.flash("alertMessageHistory", "Internal Server Error!");
                req.flash("alertStatusHistory", "danger");
                res.redirect('/')
            }
        }
    }
};