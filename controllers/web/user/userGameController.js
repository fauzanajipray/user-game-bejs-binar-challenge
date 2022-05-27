const { UserGame, UserGameBiodata, UserGameHistory } = require('../../../models');

module.exports = {
    // Endpoint GET /usergame
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            const userGames = await UserGame.findAll();
            const data = userGames.map(userGame => 
                userGame.toJSON()
            );
            
            const user = req.user.toJSON();
            data.map(userGame => {
                delete userGame.password
            });
            // TODO : filter data by user id login session
            
            res.render("layouts/user/usergame/index", {
                title: "Usergames",
                active: "user",
                data,
                alert,
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

    // Endpoint GET /usergame/:id/edit
    viewUpdateUsergame: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

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
            res.render("layouts/user/usergame/edit_usergame", {
                title: "Update Usergame",
                active: "user",
                user,
                alert,
                data
            })
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error!");
            req.flash("alertStatus", "danger");
            res.redirect("/usergame");
        }
    },
    // Endpoint PUT /usergame/:id/edit
    updateUserGame: async (req, res) => {
        try {
            console.log("---------------------------------------------------------------------------");
            const { id } = req.params;
            const { 
                username_before,
                username,
                email,
                first_name,
                last_name,
                address
            } = req.body;
            console.log("----------------------------");
            console.log(req.body);
            if(username_before !== username){
                console.log(`Cek username ${username}, username_before ${username_before}`);
                const checkUsername = await UserGame.findOne({
                    where: { username: username }
                });
                if (checkUsername) {
                    req.flash("alertMessage", "Username has been used");
                    req.flash("alertStatus", "danger");
                    return res.redirect(`/usergame/${id}/edit`);
                }
            }
            const updateUsergame = await UserGame.update({ 
                username: username }, {
                where: { 
                    id: id 
                }});
            console.log("updateUsergame", updateUsergame);
            if(updateUsergame[0] === 0){
                req.flash("alertMessage", "Update failed!");
                req.flash("alertStatus", "danger");
                return res.redirect(`/usergame/${id}/edit`);
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
            const updateUsergameBiodata = await UserGameBiodata.update(dataBiodata, { where: { user_id: id } });

            if(updateUsergameBiodata[0] === 0){
                return res.status(404).json({ message: 'Update UserGameBiodata Error' });
            }
            req.flash("alertMessage", "Update profile success!");
            req.flash("alertStatus", "success");
            return res.redirect(`/usergame/${id}/edit`);
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error");
            req.flash("alertStatus", "danger");
            res.render("error", {
                error
            })
        }
    },
    deleteUserGame: async (req, res) => {
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
                return res.redirect("/usergame");
            }
            const deleteUsergame = await UserGame.destroy({ where: { id: id } });
            console.log("deleteUsergame", deleteUsergame);
            if(deleteUsergame === 0){
                req.flash("alertMessage", "Delete failed!");
                req.flash("alertStatus", "danger");
                return res.redirect("/usergame");
            }
            req.flash("alertMessage", "Delete success!");
            req.flash("alertStatus", "success");
            return res.redirect("/usergame");
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error!");
            req.flash("alertStatus", "danger");
            res.redirect("/usergame");
        }
    },
}