const { UserGame, UserGameBiodata, UserGameHistory } = require('../models');

module.exports = {
    // Endpoint GET /usergame/history
    index: async (req, res) => {
        try {
            const userGames = await UserGame.findAll({
                // include: ['userGameBiodata']
            });
            const data = userGames.map(userGame => 
                userGame.toJSON()
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
    // Endpoint POST /usergame/history
    store: async (req, res) => {

    },
    // Endpoint PUT /usergame/history/:id
    update: async (req, res) => {
        
    },
    // Endpoint DELETE /usergame/history/:id
    destroy: async (req, res) => {
        
    }
};