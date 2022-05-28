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

            const user = req.user.toJSON();
            console.log(user);
            const data = await UserGame.findOne({
                where: {
                    id: user.id
                },
                include: [{
                    model: UserGameBiodata,
                    as: 'userGameBiodata',
                }, {
                    model: UserGameHistory,
                    as: 'userGameHistories'
                }]
            });

            res.render("layouts/user/home/index", {
                title: "Home",
                active: "home",
                alert,
                user,
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

            const user = req.user.toJSON();
            const data = await UserGame.findOne({
                where: {
                    id: user.id
                },
                include: [{
                    model: UserGameBiodata,
                    as: 'userGameBiodata'
                }]
            });
            res.render("layouts/user/home/edit_profile", {
                title: "Edit Profile",
                active: "home",
                alert,
                user,
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
                address
            } = req.body;
            console.log(req.body.first_name);
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
            const filename = req.file ? req.file.filename : null;
            let dataBiodata

            if (filename) {
                dataBiodata = {
                    first_name: first_name,
                    last_name: last_name,
                    address: address,
                    email: email,
                    url_photo: req.file.filename
                }
            } else {
                dataBiodata = {
                    first_name: first_name,
                    last_name: last_name,
                    address: address,
                    email: email,
                }
            }
            const updateUsergameBiodata = await UserGameBiodata.update(dataBiodata, { where: { user_id: user.id }});
            if(updateUsergameBiodata[0] === 0){
                return res.status(404).json({
                    message: 'Update UserGameBiodata Error'
                });
            }
            
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
            
            const user = req.user.toJSON();
            res.render("layouts/user/home/add_history", {
                title: "Add History",
                active: "home",
                alert,
                user
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
            const user = req.user.toJSON();
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
            res.render("layouts/user/home/edit_history", {
                title: "Edit History",
                active: "home",
                alert,
                user,
                data,
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