const { UserGame, UserGameBiodata, UserGameHistory } = require('../../models');

module.exports = {
    // Endpoint GET /history
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
    // Endpoint GET /history/:id
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
            if (error.name === 'SequelizeDatabaseError') {
                return res.status(400).json({
                    message: "Invalid Data Type",
                    data: null,
                    error: error.message
                });
            } else {
                return res.status(500).json({
                    message: error.message,
                    data: null
                });
            }
        }
    },
    // Endpoint POST /history
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
                    message: 'Bad Request',
                    data: null,
                    error: errors
                });
            } else if (error.name === 'SequelizeForeignKeyConstraintError') {
                res.status(400).json({
                    message: 'Foreign Key Constraint Error',
                    data: null,
                    error: error.message
                });
            } else if (error.name === 'SequelizeDatabaseError') {
                res.status(400).json({
                    message: 'Invalid Data Type',
                    data: null,
                    error: error.message
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
            const { user_game_id, score, time_played } = req.body;
            const id = req.params.id

            const userGameHistory = await UserGameHistory.update({
                score: score,
                time_played: time_played,
                user_id: user_game_id,
            }, { where: { id : id } });

            if (userGameHistory[0] === 0) {
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
            } else if (error.name === 'SequelizeForeignKeyConstraintError') {
                res.status(400).json({
                    message: 'Foreign Key Constraint Error',
                    data: null,
                    error: error.message
                });
            } else if (error.name === 'SequelizeDatabaseError') {
                res.status(400).json({
                    message: 'Invalid Data Type',
                    data: null,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    message: error.message,
                    data: null,
                });
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
            if (userGameHistory === 0) {
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
            } else if (error.name === 'SequelizeDatabaseError') {
                res.status(400).json({
                    message: 'Invalid Data Type',
                    data: null,
                    error: error.message
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