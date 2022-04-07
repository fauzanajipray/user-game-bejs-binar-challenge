const { UserGame, UserGameBiodata, UserGameHistory } = require('../models');

module.exports = {
    // Endpoint GET /usergame/history
    index: async (req, res) => {
        try {
            const userGamesHistories = await UserGameHistory.findAll({
                // include: ['userGameBiodata']
            });
            const data = userGamesHistories.map(history => 
                history.toJSON()
            );
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
    // Endpoint GET /usergame/history/:id
    show: async (req, res) => {
        try {
            const { id } = req.params;
            const userGameHistory = await UserGameHistory.findByPk(id);
            if (!userGameHistory) {
                return res.status(404).json({
                    message: 'User Game History not found',
                    data: null
                });
            }
            res.status(200).json({
                message: 'Success',
                data: userGameHistory.toJSON()
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },
    // Endpoint POST /usergame/history
    store: async (req, res) => {
        try {
            const { user_game_id, score, time_played } = req.body;

            const userGameHistory = await UserGameHistory.create({
                score: score,
                time_played: time_played,
                user_id: user_game_id,
            });

            res.status(201).json({
                message: 'Success',
                data: userGameHistory.toJSON()
            });
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
    // Endpoint PUT /usergame/history/:id
    update: async (req, res) => {
        try {
            const { user_game_id, score, time_played } = req.body;
            const id = req.params.id

            const userGameHistory = await UserGameHistory.update({
                score: score,
                time_played: time_played,
                user_id: user_game_id,
            }, { where: { id : id } });

            if (!userGameHistory) {
                return res.status(404).json({
                    message: 'User Game History not found',
                    data: null
                });
                
            } 
            res.status(200).json({
                message: 'Success',
                data: null
            })
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({
                    message: 'Failed',
                    data: null,
                    error: errors
                });
            } else {
                res.status(500).json({
                    message: error.message,
                    data: null,
                });
            }
        }
    },
    // Endpoint DELETE /usergame/history/:id
    destroy: async (req, res) => {
        try {
            const id = req.params.id

            const userGameHistory = await UserGameHistory.destroy({
                where: { id : id }
            });
            if (!userGameHistory) {
                return res.status(404).json({
                    message: 'User Game History not found',
                    data: null
                });
            }
            res.status(200).json({
                message: "User Game History deleted"
            });

        } catch (error) {
            if(error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({
                    message: error.message,
                    data: null,
                    error: errors
                });
            } else {
                res.status(500).json({
                    message: error.message,
                    data: null,
                });
            }
        }
    }
};