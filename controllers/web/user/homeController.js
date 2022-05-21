const { UserGame, UserGameBiodata, UserGameHistory } = require('../../../models');

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

            const { id } = req.user.toJSON();
            console.log(req.user.toJSON());
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

            res.render("layouts/home/index", {
                title: "Home",
                active: "home",
                alert,
                data
            })
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error");
            req.flash("alertStatus", "danger");
            res.render("error", {
                error
            })
        }

    },
    // Endpoint: /profile/update
    viewUpdateProfile: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            const { id } = req.user.toJSON();
            const data = await UserGame.findOne({
                where: {
                    id: id
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
            res.render("error", {
                error
            })
        }
    },
    // Endpoint: PUT /profile/update
    updateProfile: async (req, res) => {
        try {
            const user = req.user.toJSON();
            const usernameSession = user.username;
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
                    id: user.id
                }
            });
            console.log("updateUsergame", updateUsergame);
            if(!updateUsergame){
                return res.status(404).json({
                    message: 'User Game not found'
                });
            }
            const updateUsergameBiodata = await UserGameBiodata.update({
                first_name: first_name,
                last_name: last_name,
                address: address,
                email: email
            }, {
                where: {
                    user_id: user.id
                }
            });
            console.log("updateUsergameBiodata", updateUsergameBiodata);
            if(updateUsergameBiodata[0] === 0){
                return res.status(404).json({
                    message: 'Update UserGameBiodata Error'
                });
            }
            
            console.log("Update success");
            if (username !== user.username) {
                res.redirect("/logout");
            } else {
                req.flash("alertMessage", "Update profile success!");
                req.flash("alertStatus", "success");
                res.redirect("/");
            }

        } catch (error) {
            req.flash("alertMessage", "Internal Server Error");
            req.flash("alertStatus", "danger");
            res.render("error", {
                error
            })
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
            res.render("error", {
                error
            })
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
            res.render("error", {
                error
            })
        }
    }
}