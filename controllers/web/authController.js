const { UserGame, UserGameBiodata } = require('../../models');

const passport = require('../../lib/passport-local');

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
}