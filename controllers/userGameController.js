const { UserGame, UserGameBiodata, UserGameHistory } = require('../models');

module.exports = {
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
            
            const data = userGame.toJSON();
            data.userGameBiodata = userGameBiodata.toJSON();

            res.status(200).json({
                message: 'UserGame updated',
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
    }
}