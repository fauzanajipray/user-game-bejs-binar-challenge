const { UserGame, UserGameBiodata, UserGameHistory } = require('../../db/models');
const response = require('../../utils/formatResponse');
const encrypt = require('../../utils/encrypt');

module.exports = {
    getUsergames: async (req, res) => {
        try {
            if (req.query.page < 1) {
                return response(res, 400, false, 'Page must be greater than 0', null); 
            } 
            const page = req.query.page || 1
            const limit = 10
            const offset = (page - 1) * limit;
            const userGames = await UserGame.findAndCountAll({ 
                include: ['userGameBiodata'],
                limit: limit,
                offset: offset,
                order: [
                    ['id', 'DESC']
                ]
            });
            userGames.totalPage = Math.ceil(userGames.count / limit);;
            userGames.page = parseInt(page);
            userGames.nextPage = page < userGames.totalPage ? parseInt(page) + 1 : null;;
            userGames.prevPage = page > 1 ? page - 1 : null;

            return response(res, 200, true, 'Success', userGames);
        } catch (error) {
            console.log(error);
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    getUsergame: async (req, res) => {
        try {
            const { id } = req.params;
            const userGame = await UserGame.findOne({
                where: { id: id },
                include: { model: UserGameBiodata, as: 'userGameBiodata', }
            });
            if (!userGame) { return response(res, 404, false, 'UserGame not found', userGame) }
            return response(res, 200, true, 'Success', userGame);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    putUsergame: async (req, res) => {
        try {
            const { id } = req.params;
            const { username, password } = req.body;
            const userGame = await UserGame.findOne({ where: { id: id } });
            if (!userGame) { return response(res, 404, false, 'UserGame not found', null) }
            if (!password) { return response(res, 400, false, 'Password is required', null) }
            const data = { username: username,  password: encrypt(password) }
            const updatedUserGame = await userGame.update(data);
            if (updatedUserGame) { return response(res, 200, true, 'UserGame Updated!', updatedUserGame); }
            return response(res, 400, false, 'Update failed!', null) 
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            } else if (error.name === 'SequelizeValidationError') {
                return response(res, 400, false, error.errors[0].message, null);
            } else if(error.name === 'SequelizeUniqueConstraintError') {
                return response(res, 400, false, "Username has been used!", null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    deleteUsergame: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await UserGame.destroy({ where: { id: id } });
            console.log("userGame", deleted);
            if (deleted === 0) { 
                return response(res, 404, false, 'UserGame not found', null);
            }
            return response(res, 200, true, 'UserGame deleted!', null);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            } 
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    putBiodata: async (req, res) => {
        try {
            const { id } = req.params;
            const { email, first_name, last_name, address } = req.body;
            const filename = req.file ? req.file.filename : null;
            const userGame = await UserGame.findOne({  where: { id: id }, include: { model: UserGameBiodata, as: 'userGameBiodata' } });
            
            if (!userGame) { return response(res, 404, false, 'UserGame not found', null) }
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
            const update = await userGame.userGameBiodata.update(dataBiodata);
            if (update) { return response(res, 200, true, 'Biodata Updated!', update); }
            return response(res, 400, false, 'Update failed!', null)
        } catch (error) {
            console.log(error); 
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            } else if (error.name === 'SequelizeValidationError') {
                return response(res, 400, false, error.errors[0].message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    getHistories: async (req, res) => {
        try {
            const histories = await UserGameHistory.findAll({
                include: ['userGame']
            });
            return response(res, 200, true, 'Success', histories);
        } catch (error) {
            console.log(error);
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    getHistory: async (req, res) => {
        try {
            const { id } = req.params;
            const history = await UserGameHistory.findOne({
                where: { id: id },
                include: ['userGame']
            });
            if (!history) { return response(res, 404, false, 'History not found', history) }
            return response(res, 200, true, 'Success', history);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            } else if (error.name === 'SequelizeValidationError') {
                return response(res, 400, false, error.errors[0].message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    putHistory: async (req, res) => {
        try {
            const { id } = req.params;
            const { score, time_played } = req.body;
            const history = await UserGameHistory.findOne({ where: { id: id } });
            if (!history) { return response(res, 404, false, 'History not found', history) }
            const data = {
                score: score,
                time_played: time_played
            }
            const update = await history.update(data);
            if (update) { return response(res, 200, true, 'History Updated!', update); }
            return response(res, 400, false, 'Update failed!', null)
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            } else if (error.name === 'SequelizeValidationError') {
                return response(res, 400, false, error.errors[0].message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    deleteHistory: async (req, res) => {
        try {
            const { id } = req.params;
            const history = await UserGameHistory.findOne({ where: { id: id } });
            if (!history) { return response(res, 404, false, 'History not found', history) }
            const deleted = await history.destroy();
            if (deleted === 0) {
                console.log(deleted);
                return response(res, 500, false, 'Internal Server Error', null);
            }
            return response(res, 200, true, 'History deleted!', null);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            } else if (error.name === 'SequelizeValidationError') {
                return response(res, 400, false, error.errors[0].message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    }
}