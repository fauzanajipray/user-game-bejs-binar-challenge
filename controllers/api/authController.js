const { UserGame, UserGameBiodata, Otp } = require('../../db/models')
const emailTransporter = require('../../lib/email')
const response = require('../../utils/formatResponse')
const encrypt = require('../../utils/encrypt')

module.exports = {
    // Endpoint POST /login
    postLogin: async (req, res) => {
        try {
            const { username, password } = req.body
            const userGame = await UserGame.findOne({ where: { username: username }})

            if(!userGame) {
                return response(res, 400, false, 'Username not found', null)
            }
            if(!userGame.checkPassword(password)) {
                return response(res, 400, false, 'Password is incorrect', null)
            }
            return response(res, 200, true, 'Login success', {
                data: userGame,
                token: userGame.generateToken()
            })
        } catch (error) {
            console.log(error)
            return response(res, 500, false, error.message, null)
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
            } = req.body                                                                                                                                                          
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
                })
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
                    }
                    emailTransporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err)
                            return response(res, 500, false, err.message, null)
                        } else {
                            console.log(info)
                        }
                    })
                }
                data = userGame.toJSON()
                data.userGameBiodata = userGameBiodata.toJSON()
                return response(res, 201, true, 'UserGame created', data)
            }
        } catch (error) {
            console.log(error)
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return response(res, 400, false, error.message, null)
            } else {
                return response(res, 500, false, error.message, null)
            }
        }
    },
    // Endpoint POST /forgot-password
    postForgotPassword: async (req, res) => {
        try {
            const { emailOrUsername } = req.body
            const isEmail = (text) => {
                const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
                return regex.test(text)
            }
            var classUserGame
            if (isEmail(emailOrUsername)) {
                console.log('email')
                const userGameBiodata = await UserGameBiodata.findOne({ 
                    where: { email: emailOrUsername },
                    include: [{
                        model: UserGame, 
                        as: 'userGame',
                        include: [
                            { model: UserGameBiodata, as : 'userGameBiodata'},
                            { model: Otp, as : 'otp'}
                        ]
                    }]   
                })
                if (!userGameBiodata) {
                    return response(res, false, 400, 'Email not found', null)
                }
                classUserGame = userGameBiodata.userGame
            } else {
                const userGame = await UserGame.findOne({
                    where: { username: emailOrUsername },
                    include: [
                        { model: UserGameBiodata, as:'userGameBiodata' },
                        { model: Otp, as: 'otp' }
                    ]
                })
                if (!userGame) {
                    return response(res, 404, false, 'Username not found', null)
                }
                classUserGame = userGame
            }
            const token = classUserGame.generateToken()
            const dataOtp = {
                otp: Math.floor(Math.random() * 1000000),
                email: classUserGame.userGameBiodata.email,
                user_id: classUserGame.id,
                expire_in: 2 * 60 * 1000,
            } 
            var OtpProcess
            console.log('dataOtp', dataOtp)
            if (classUserGame.otp.length > 0) {
                OtpProcess = await Otp.update(dataOtp, {
                    where: { user_id: classUserGame.id }
                })
            } else {
                OtpProcess = await Otp.create(dataOtp)
            }
            if (!OtpProcess) {
                return response(res, 500, false, 'Internal Server Error', null)
            }
            const data = classUserGame.toJSON()
            data.userGameBiodata = classUserGame.userGameBiodata.toJSON()
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: data.userGameBiodata.email,
                subject: 'OTP Reset Password',
                text: `Your OTP is ${dataOtp.otp}`,
                html: `<!doctype html>
                        <html>
                        <head>
                            <meta name="viewport" content="width=device-width">
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                            <title>Simple Transactional Email</title>
                        </head>
                        <body>
                        <!-- OTP -->
                            <p>Use this OTP to reset your password</p> 
                            <p>${dataOtp.otp}</p>
                        </body>
                        </html>`
            }
            emailTransporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return response(res, 500, false, err.message, null)
                } else {
                    console.log(info)
                }
            })
            return response(res, 200, true, 'Please check your email!', null)
        } catch (error) {
            console.log(error)
            return response(res, 500, false, error.message, null)
        }
    },
    // Endpoint POST /reset-password
    postResetPassword: async (req, res) => {
        try {
            const { otp, password, emailOrUsername } = req.body
            const isEmail = (text) => {
                const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
                return regex.test(text)
            }
            var classUserGame
            if (isEmail(emailOrUsername)) {
                const userGameBiodata = await UserGameBiodata.findOne({ 
                    where: { email: emailOrUsername },
                    include: [{
                        model: UserGame, 
                        as: 'userGame',
                        include: [
                            { model: UserGameBiodata, as : 'userGameBiodata'},
                            { model: Otp, as : 'otp'}
                        ]
                    }]   
                })
                if (!userGameBiodata) { return response(res, 404, false, 'Email not found', null) }
                classUserGame = userGameBiodata.userGame
            } else {
                const userGame = await UserGame.findOne({
                    where: { username: emailOrUsername },
                    include: [
                        { model: UserGameBiodata, as:'userGameBiodata' },
                        { model: Otp, as: 'otp' }
                    ]
                })
                if (!userGame) {
                    return response(res, 404, false, 'Username not found', null)
                }
                classUserGame = userGame
            }

            const otpData = await Otp.findOne({ where: { otp: otp, user_id: classUserGame.id } })
            if (!otpData) { return response(res, 404, false, 'OTP not found', null) } 
            // Datenow in milisecond
            const dateNow = new Date().getTime()
            // Date Created at in milisecond
            const dateCreatedAt = otpData.dataValues.updatedAt.getTime()
            // Date Expired in milisecond
            const expire_in = otpData.dataValues.expire_in
            // Date Created at + Date Expired in milisecond
            const dateExpired = dateCreatedAt + expire_in
            if (dateNow > dateExpired) {
                return response(res, 404, false, 'OTP Expired', null)
            }
            const update = classUserGame.update({
                password: encrypt(password)
            })
            if (!update) {
                return response(res, 500, false, 'Internal Server Error', null)
            }
            return response(res, 200, true, 'Password has been changed', null)
        } catch (error) {
            console.log(error)
            return response(res, 500, false, error.message, null)
        }
    },
}