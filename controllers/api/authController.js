const { UserGame, UserGameBiodata } = require('../../models');
const jwt = require('jsonwebtoken');

module.exports = {
    // Endpoint POST /login
    postLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            const userGame = await UserGame.findOne({ where: { username: username }});

            if(!userGame) {;
                return res.status(404).json({
                    message: 'User Game not found'
                });
            }
            if(!userGame.checkPassword(password)) {
                return res.status(400).json({
                    message: 'Password not match'
                });
            }
            return res.status(200).json({
                message: 'Success',
                data: {
                    data: userGame,
                    token: userGame.generateToken()
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: error.message
            });
        }
    },
    // Endpoint POST /register
    postRegister: async (req, res) => {
        try {
            const {
                username,
                password,
                email,
                first_name,
                last_name,
                address,
            } = req.body;                                                                                                                                                           
            const userGame = await UserGame.register({
                username: username,
                password: password,
                role_id: 2,
            })
            if (userGame) {
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
            }
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
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
}