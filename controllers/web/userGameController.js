const { UserGame, UserGameBiodata, UserGameHistory } = require('../../models');

module.exports = {
    // Endpoint: /
    viewHome: async (req, res) => {
        try {
            res.render("layouts/index", {
                title: "Home",
                active: "home",
            })
        } catch (error) {
            res.redirect("/");
        }
    },
    // Endpoint GET /usergame
    index: async (req, res) => {
        try {
            const userGames = await UserGame.findAll({
                include: ['userGameBiodata']
            });
            const data = userGames.map(userGame => 
                userGame.toJSON()
            );
            data.map(userGame => {
                // delete userGame.userGameBiodata.id;
                // delete userGame.userGameBiodata.user_id;
            });
            res.status(200).json({
                message: 'Success',
                data: data
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },
    // Endpoint GET /usergame/:id
    show: async (req, res) => {
        try {
            const { id } = req.params;
            const userGame = await UserGame.findOne({
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
            if (!userGame) {
                return res.status(404).json({
                    message: 'User Game not found'
                });
            }
            res.status(200).json({
                message: 'Success',
                data: userGame.toJSON()
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },
    // Endpoint POST /usergame
    store: async (req, res) => {
        try {
            const {
                username,
                password,
                email,
                first_name,
                last_name,
                address,
            } = req.body;
            const userGame = await UserGame.create({
                username,
                password
            });
            const userGameBiodata = await UserGameBiodata.create({
                first_name,
                last_name,
                address,
                email,
                user_id: userGame.id,
            });
            const data = userGame.toJSON();
            data.userGameBiodata = userGameBiodata.toJSON();

            res.status(201).json({
                message: 'UserGame created',
                data
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({
                    message: error.message,
                    data: null,
                    error: error.errors
                });
            } else {
                res.status(500).json({
                    message: error.message,
                    data: null,
                    error: error.errors
                });
            }
        }
    },
    // Endpoint PUT /usergame/:id
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                username,
                password,
                email,
                first_name,
                last_name,
                address,
            } = req.body;
            const userGame = await UserGame.update({
                username,
                password
            }, {
                where: {
                    id: id
                }
            });
            if (!userGame) {
                return res.status(404).json({
                    message: 'User Game not found'
                });
            }

            const userGameBiodata = await UserGameBiodata.update({
                first_name,
                last_name,
                address,
                email,
            }, {
                where: {
                    user_id: id
                }
            });
            if (!userGameBiodata) {
                return res.status(404).json({
                    message: 'User Game Biodata not found'
                });
            }
            res.status(200).json({
                message: 'UserGame updated',
                data: null
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({
                    message: error.message,
                    error: error.errors
                });
            } else {
                res.status(500).json({
                    message: error.message,
                    error: error.errors
                });
            }
        }
    },
    // Endpoint DELETE /usergame/:id
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const userGame = await UserGame.destroy({
                where: {
                    id: id
                }
            });
            if (!userGame) {
                return res.status(404).json({
                    message: 'User Game not found'
                });
            }
            res.status(200).json({
                message: "User Game deleted"
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({
                    message: error.message,
                    error: error.errors
                });
            } else {
                res.status(500).json({
                    message: error.message,
                    error: error.errors
                });
            }
        }
    }
}