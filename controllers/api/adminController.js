const { UserGame, UserGameBiodata, UserGameHistory } = require('../../models');
const response = require('../../utils/formatResponse');

module.exports = {
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
                delete userGame.password;
            });
            return response(res, 200, true, 'Success', data);
        } catch (error) {
            console.log(error);
            return response(res, 500, false, "Internal Server Error", null);
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
            if (!userGame) { return response(res, 404, false, 'UserGame not found', null) }
            return response(res, 200, true, 'Success', userGame);
        } catch (error) {
            console.log(error);
            return response(res, 500, false, "Internal Server Error", null);
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
            const userGame = await UserGame.update({  username, password }, { where: { id: id } });
            if (userGame[0] === 0) { 
                return response(res, 404, false, 'UserGame not found', null); 
            }
            const userGameBiodata = await UserGameBiodata.update({
                first_name,
                last_name,
                address,
                email,
            }, { where: {  user_id: id } });
            if (userGameBiodata[0] === 0) {
                return response(res, 404, false, 'User Game Biodata not found', null);
            }
            return response(res, 200, true, 'UserGame updated!', userGame);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError') {
                return response(res, 400, false, error.message, null);
            } else {
                return response(res, 500, false, "Internal Server Error", null);
            }
        }
    },
    // Endpoint DELETE /usergame/:id
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const userGame = await UserGame.destroy({ where: { id: id } });
            if (userGame === 0) { 
                return response(res, 404, false, 'UserGame not found', null);
            }
            return response(res, 200, true, 'UserGame deleted!', null);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError') {
                return response(res, 400, false, error.message, null);
            } else {
                return response(res, 500, false, "Internal Server Error", null);
            }
        }
    }
}