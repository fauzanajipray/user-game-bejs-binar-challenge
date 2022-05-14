const { UserGame, UserGameBiodata, UserGameHistory } = require('../../models');

module.exports = {
    // Endpoint: /
    viewHome: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alertMessageHistory = req.flash("alertMessageHistory")
            const alertStatusHistory = req.flash("alertStatusHistory")
            const alert = { 
                message: alertMessage, 
                status: alertStatus,
                message2: alertMessageHistory,
                status2: alertStatusHistory
            };

            const idUser = req.session.user.id;
            const data = await UserGame.findOne({
                where: {
                    id: idUser
                },
                include: [{
                    model: UserGameBiodata,
                    as: 'userGameBiodata',
                }, {
                    model: UserGameHistory,
                    as: 'userGameHistories'
                }]
            });
            console.log(data);
            res.render("layouts/home/index", {
                title: "Home",
                active: "home",
                alert,
                data
            })
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error");
            req.flash("alertStatus", "danger");
            res.redirect("/");
        }
    },
    // Endpoint: /profile/update
    viewUpdateProfile: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            const idUser = req.session.user.id;
            const data = await UserGame.findOne({
                where: {
                    id: idUser
                },
                include: [{
                    model: UserGameBiodata,
                    as: 'userGameBiodata'
                }]
            });
            res.render("layouts/home/edit_profile", {
                title: "Edit Profile",
                active: "home",
                alert,
                data
            })
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error");
            req.flash("alertStatus", "danger");
            res.redirect("/");
        }
    },
    // Endpoint: PUT /profile/update
    updateProfile: async (req, res) => {
        try {
            console.log("Update Profile with put");
            console.log(req.body);
            const idUser = req.session.user.id;
            const usernameSession = req.session.username;
            const { 
                username,
                email,
                first_name,
                last_name,
                address, } = req.body;
            if (username !== usernameSession) {
                const checkUsername = await UserGame.findOne({
                    where: {
                        username
                    }
                });
                if (checkUsername) {
                    req.flash("alertMessage", "Username has been used");
                    req.flash("alertStatus", "danger");
                    res.redirect("/profile/update");
                } 
            }
            const updateUsergame = await UserGame.update({
                username: username
            }, {
                where: {
                    id: idUser
                }
            });
            if(!updateUsergame){
                return res.status(404).json({
                    message: 'User Game not found'
                });
            }
            req.session.username = username;
            const updateUsergameBiodata = await UserGameBiodata.update({
                first_name: first_name,
                last_name: last_name,
                address: address,
                email: email
            }, {
                where: {
                    user_id: idUser
                }
            });
            if(!updateUsergameBiodata){
                return res.status(404).json({
                    message: 'User Game Biodata not found'
                });
            }
            console.log("Update success");
            req.flash("alertMessage", "Update profile success!");
            req.flash("alertStatus", "success");
            res.redirect("/");
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error");
            req.flash("alertStatus", "danger");
            res.redirect("/");
        }
    },
    // Endpoint: /profile/add-history
    viewAddHistory: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("layouts/home/add_history", {
                title: "Add History",
                active: "home",
                alert,
            })
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error");
            req.flash("alertStatus", "danger");
            res.redirect("/");
        }
    },
    // Endpoint: GET /profile/edit-history/:id
    viewEditHistory: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            const idHistory = req.params.id;
            const data = await UserGameHistory.findOne({
                where: {
                    id: idHistory
                },
                include: [{
                    model: UserGame,
                    as: 'userGame'
                }]
            });
            console.log(data);
            res.render("layouts/home/edit_history", {
                title: "Edit History",
                active: "home",
                alert,
                data
            })
        } catch (error) { 
            req.flash("alertMessage", "Internal Server Error");
            req.flash("alertStatus", "danger");
            res.redirect("/");
        }
    }
}