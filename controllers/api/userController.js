const { UserGame, UserGameBiodata, UserGameHistory } = require('../../db/models');
const response = require('../../utils/formatResponse');

module.exports = {
    getProfile : async (req, res) => {
        try {
            const user = req.user;
            const userGame = await UserGame.findOne({
                where: { id: user.id },
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
    putProfile : async (req, res) => {
        try {
            const user = req.user;
            const { username, password } = req.body;
            const userGame = await UserGame.findOne({ where: { id: user.id } });
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
    getBiodata : async (req, res) => {
        try {
            const user = req.user;
            const userGameBiodata = await UserGameBiodata.findOne({ 
                where: { user_id: user.id }
            });
            if (!userGameBiodata) { return response(res, 404, false, 'UserGameBiodata not found', userGameBiodata) }
            return response(res, 200, true, 'Success', userGameBiodata);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    putBiodata : async (req, res) => {
        try {
            const user = req.user;
            const { first_name, last_name, address, email } = req.body;
            const filename = req.file ? req.file.filename : null;
            const userGame = await UserGame.findOne({  
                where: { id: user.id }, 
                include: { model: UserGameBiodata, as: 'userGameBiodata' } 
            });

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
            const updatedUserGameBiodata = await userGame.userGameBiodata.update(dataBiodata);
            if (updatedUserGameBiodata) { return response(res, 200, true, 'UserGameBiodata Updated!', updatedUserGameBiodata) }
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
    getHistories : async (req, res) => {
        try {
            const user = req.user;
            const userGameHistory = await UserGameHistory.findAll({
                where: { user_id: user.id }
            });
            console.log(userGameHistory);
            if (!userGameHistory) { return response(res, 404, false, 'UserGameHistory not found', userGameHistory) }
            return response(res, 200, true, 'Success', userGameHistory);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    postHistory : async (req, res) => {
        try {
            const user = req.user
            const { score, time_played } = req.body
            const data = { score: score, time_played: time_played, user_id: user.id }
            const newUserGameHistory = await UserGameHistory.create(data);
            if (newUserGameHistory) { return response(res, 200, true, 'UserGameHistory Created!', newUserGameHistory) }
            return response(res, 400, false, 'Create failed!', null)
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
    getHistory : async (req, res) => {
        try {
            const { id } = req.params;
            const user = req.user;
            const userGameHistory = await UserGameHistory.findOne({ where: { id: id }});
            if (!userGameHistory) { return response(res, 404, false, 'UserGameHistory not found', userGameHistory)  }
            if (userGameHistory.user_id != user.id) { return response(res, 403, false, 'Forbidden', null) }
            return response(res, 200, true, "Success", userGameHistory);
        } catch {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    },
    putHistory : async (req, res) => {
        try {
            const { id } = req.params;
            const { score, time_played } = req.body
            const user = req.user;
            const userGameHistory = await UserGameHistory.findOne({ where: { id: id }});
            if (!userGameHistory) { return response(res, 404, false, 'UserGameHistory not found', userGameHistory)  }
            if (userGameHistory.user_id != user.id) { return response(res, 403, false, 'Forbidden', null) }   
            const data = { score: score, time_played: time_played }
            const updatedUserGameHistory = await userGameHistory.update(data);   
            if (!updatedUserGameHistory) { return response(res, 400, false, 'Update failed!', null) }
            return response(res, 200, true, 'UserGameHistory Updated!', updatedUserGameHistory);
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
    deleteHistory : async (req, res) => {
        try {
            const { id } = req.params;
            const user = req.user;
            const userGameHistory = await UserGameHistory.findOne({ where: { id: id }});
            if (!userGameHistory) { return response(res, 404, false, 'UserGameHistory not found', userGameHistory)  }
            if (userGameHistory.user_id != user.id) { return response(res, 403, false, 'Forbidden', null) } 
            const deletedUserGameHistory = await userGameHistory.destroy();
            console.log(deletedUserGameHistory);
            if (deletedUserGameHistory) { return response(res, 200, true, 'UserGameHistory Deleted!', deletedUserGameHistory) }
            return response(res, 400, false, 'Delete failed!', null)
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
        }
    }
}