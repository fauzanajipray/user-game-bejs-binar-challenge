const { UserGame, UserGameBiodata } = require('../../db/models');

const passport = require('../../lib/passport-local');
const jwt = require('jsonwebtoken');
const emailTransporter = require('../../lib/email');
const encrypt = require('../../utils/encrypt');

module.exports = {
    // Endpoint GET /login
    viewLogin: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
      
            if (req.session.user == null || req.session.user == undefined) {
              res.render("layouts/auth/view_login", {
                alert,
                title: "Login",
              });
            } else {
              res.redirect("/");
            }
        } catch (error) {
            res.render("error", {
                error
            })
        }
    },

    // Endpoint POST /login
    
    postLogin: async (req, res) => {
        try { 
            const user = req.user.toJSON();
            console.log(user);
            // if (user.role_id === 1) {
            //     console.log("Admin Login");
            //     res.redirect("/admin");
            // } 
            console.log("User Login");
            res.redirect("/");
        } catch (error) {
            req.flash("alertMessage", "Internal Server Error");
            req.flash("alertStatus", "danger");
            res.redirect("/");
        }
    },
    getLogout: async (req, res) => {
      try {
        req.session.destroy();
        res.redirect("/");
      } catch (error) {
        res.redirect("/");
      }
    },
    // Endpoint GET /register
    viewRegister: async (req, res) => {
      try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
        if (req.session.user == null || req.session.user == undefined) {
          res.render("layouts/auth/view_register", {
            alert,
            title: "Register",
          });
        } else {
          res.redirect("/");
        }
      } catch (error) {
        res.redirect("/");
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
        const newUserGame = await UserGame.register({
          username: username,
          password: password,
          role_id: 2,
        })
        console.log("newUserGame :" + newUserGame);
        if (newUserGame) {
          const newUserGameBiodata = await UserGameBiodata.create({
            user_id: newUserGame.id,
            first_name: first_name,
            last_name: last_name,
            address: address,
            email: email,
          });
          if (newUserGameBiodata) {
            req.flash("alertMessage", "Register success!");
            req.flash("alertStatus", "success");
            res.redirect("/login");
          }
        } else {
          req.flash("alertMessage", "Register failed!");
          req.flash("alertStatus", "danger");
          res.redirect("/register");
        }
      } catch (error) {
        if (error.name == "SequelizeUniqueConstraintError") {
          req.flash("alertMessage", "Username already exist!");
          req.flash("alertStatus", "danger");
          res.redirect("/register");
        } else {
          req.flash("alertMessage", "Something wrong!");
          req.flash("alertStatus", "danger");
          res.render("error", {
            error: error,
          });
        }
      }
    },

    // Endpoint GET /forgot-password
    viewForgotPassword: async (req, res) => {
      try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
        if (req.session.user == null || req.session.user == undefined) {
          res.render("layouts/auth/view_forgot_password", {
            alert,
            title: "Forgot Password",
          });
        } else {
          res.redirect("/");
        }
      } catch (error) {
        
        res.redirect("/forgot-password");
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
                req.flash("alertMessage", "Email not found!");
                req.flash("alertStatus", "danger");
                return res.redirect('/forgot-password');
            }
            classUserGame = userGameBiodata.userGame;
        } else {
            const userGame = await UserGame.findOne({
                where: { username: emailOrUsername },
                include: [{ model: UserGameBiodata, as: 'userGameBiodata' }]
            })
            if (!userGame) {
                req.flash("alertMessage", "Username not found!");
                req.flash("alertStatus", "danger");
                return res.redirect('/forgot-password');
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
        req.flash("alertMessage", "Please check your email to reset your password!");
        req.flash("alertStatus", "success");
        res.redirect("/login");
      } catch (error) {
        console.log(error);
        req.flash("alertMessage", "Something wrong!");
        req.flash("alertStatus", "danger");
        res.redirect("/forgot-password");
      }
    },

    // Endpoint GET /reset-password
    viewResetPassword: async (req, res) => {
      try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
        const token = req.query.token;
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const userGame = await UserGame.findOne({
          where: { id: decode.id},
          include: [{ model: UserGameBiodata, as: 'userGameBiodata' }],
        });
        if (!userGame) {
          req.flash("alertMessage", "Token not found!");
          req.flash("alertStatus", "danger");
          return res.redirect("/login");
        }
        res.render("layouts/auth/view_reset_password", {
          alert,
          title: "Reset Password",
          token,
        });
      } catch (error) {
        console.log(error);
        req.flash("alertMessage", "Something wrong!");
        req.flash("alertStatus", "danger");
        res.redirect("/forgot-password");
      }
    },

    // Endpoint POST /reset-password
    postResetPassword: async (req, res) => {
      try {
        const { password, password_confirm, token} = req.body;
        console.log({
          password,
          password_confirm,
        });
        if (password !== password_confirm) {
          req.flash("alertMessage", "Password confirmation does not match!");
          req.flash("alertStatus", "danger");
          return res.redirect(`/reset-password?token=${token}`);
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const userGame = await UserGame.findOne({
          where: { id: decode.id },
          include: [{ model: UserGameBiodata, as: 'userGameBiodata' }],
        });
        if (!userGame) {
          req.flash("alertMessage", "User not found, please try again!");
          req.flash("alertStatus", "danger");
          return res.redirect("/forgot-password");
        }
        userGame.password = encrypt(password); 
        await userGame.save();
        req.flash("alertMessage", "Password successfully updated!");
        req.flash("alertStatus", "success");
        console.log(userGame);
        res.redirect("/login");
      } catch (error) {
        console.log(error);
        req.flash("alertMessage", "Something wrong!");
        req.flash("alertStatus", "danger");
        res.redirect("/forgot-password");
      }
    },
};