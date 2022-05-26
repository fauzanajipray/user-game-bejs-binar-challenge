const { UserGame, UserGameBiodata, UserGameHistory } = require('../../../models');

module.exports = {
    // Endpoint GET /usergame
    index: async (req, res) => {
        try {
            const userGames = await UserGame.findAll();
            const data = userGames.map(userGame => 
                userGame.toJSON()
            );
            data.map(userGame => {
                delete userGame.password
            });
            const user = req.user.toJSON();
            res.render("layouts/user/usergame/index", {
                title: "Usergames",
                active: "user",
                data,
                user
            })
        } catch (error) {
            res.render("error", { error });
        }
    },
    // Endpoint GET /usergame/:id
    viewDetailUserGame: async (req, res) => {
        try {
            const { id } = req.params;
            const user = req.user.toJSON();
            const data = await UserGame.findOne({
                where: {
                    id: id
                },
                include: [{
                    model: UserGameBiodata,
                    as: 'userGameBiodata',
                }, {
                    model: UserGameHistory,
                    as: 'userGameHistories'
                }]
            });
            if (!data) {
                req.flash("alertMessage", "User not found!");
                req.flash("alertStatus", "warning");
                res.redirect("/usergame");
            }
            res.render("layouts/user/usergame/detail_usergame", {
                title: "Detail Usergame",
                active: "user",
                user,
                data
            })
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error!");
            req.flash("alertStatus", "danger");
            res.redirect("/usergame");
        }
    },

    // Endpoint PUT /usergame/:id/edit
    viewUpdateUsergame: async (req, res) => {},
    updateUserGame: async (req, res) => {},
    deleteUserGame: async (req, res) => {},
}