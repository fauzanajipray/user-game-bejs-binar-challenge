const { UserGame, UserGameBiodata } = require('../../models');
const emailTransporter = require('../../lib/email');
const response = require('../../utils/formatResponse');

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
                if (userGameBiodata) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: 'Welcome to Game State',
                        text: `Welcome to Game State, ${first_name} ${last_name}`,
                        html: `<!doctype html>
                                <html>
                                <head>
                                    <meta name="viewport" content="width=device-width">
                                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                    <title>Simple Transactional Email</title>
                                </head>
                                <body>
                                    <p>Welcome to Game State, ${first_name} ${last_name}, date ${new Date()}</p>
                                </body>
                                </html>`
                    };
                    emailTransporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(info);
                        }
                    });
                }
                data = userGame.toJSON()
                data.userGameBiodata = userGameBiodata.toJSON();
                return response(res, 201, true, 'UserGame created', data);
            }
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return response(res, 400, false, error.message, null);
            } else {
                return response(res, 500, false, error.message, null);
            }
        }
    },
    // Endpoint POST /forgot-password
    postForgotPassword: async (req, res) => {
        try {
            const port = process.env.PORT || 3000;
            const { emailOrUsername } = req.body;
            console.log('emailOrUsername', emailOrUsername);
            const isEmail = (text) => {
                const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
                return regex.test(text);
            }
            var classUserGame
            if (isEmail(emailOrUsername)) {
                console.log('email');
                const userGameBiodata = await UserGameBiodata.findOne({ 
                    where: { email: emailOrUsername },
                    include: [{
                        model: UserGame, 
                        as: 'userGame',
                        include: [{ model: UserGameBiodata, as : 'userGameBiodata' }]
                    }]   
                });
                if (!userGameBiodata) {
                    return res.status(404).json({ message: 'Email not found' });
                }
                classUserGame = userGameBiodata.userGame;
            } else {
                const userGame = await UserGame.findOne({
                    where: { username: emailOrUsername },
                    include: [{ model: UserGameBiodata, as: 'userGameBiodata' }]
                })
                if (!userGame) {
                    return response(res, 404, false, 'Username not found', null);
                }
                classUserGame = userGame;
            }
            const token = classUserGame.generateToken();
            const data = classUserGame.toJSON();
            data.userGameBiodata = classUserGame.userGameBiodata.toJSON();
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: data.userGameBiodata.email,
                subject: 'Reset Password',
                text: `Click this link to reset your password ${process.env.CLIENT_URL}/reset-password?token=${token}`,
                html: `<!doctype html>
                        <html>
                        <head>
                            <meta name="viewport" content="width=device-width">
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                            <title>Simple Transactional Email</title>
                        </head>
                        <body>
                            <p>Click this link to reset your password</p>
                            <a href="${process.env.CLIENT_URL}:${port}/reset-password?token=${token}">Reset Password</a>
                        </body>
                        </html>`
            };
            emailTransporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return response(res, 500, false, err.message, null);
                } else {
                    console.log(info);
                }
            });
            return response(res, 200, true, 'Please check your email!', null);
        } catch (error) {
            console.log(error);
            return response(res, 500, false, error.message, null);
        }
    },
    // Endpoint POST /reset-password
    postResetPassword: async (req, res) => {
        try {
            const { token } = req.query;
            const userGame = await UserGame.findOne({
                where: {
                    reset_password_token: token,
                    reset_password_expires: {
                        [Op.gt]: Date.now()
                    }
                }
            });
            if (!userGame) {
                return response(res, 404, false, 'Token is invalid or has expired', null);
            }
            return response(res, 200, true, 'Token is valid', null);
        } catch (error) {
            console.log(error);
            return response(res, 500, false, error.message, null);
        }
    },
}