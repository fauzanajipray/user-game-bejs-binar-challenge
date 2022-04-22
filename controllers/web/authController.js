const { UserGame, UserGameBiodata } = require('../../models');

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
            res.redirect("/");
        }
    },
    // Endpoint POST /login
    postLogin: async (req, res) => {
      try {
        const { username, password } = req.body;
        const userGame = await UserGame.findOne({ where: { username: username }});

        if(!userGame) {
          req.flash("alertMessage", "Username not found!");
          req.flash("alertStatus", "danger");
          res.redirect("/login");
        }
        const isPasswordMatch = (password) => {
          return userGame.password === password;
        }

        if(!isPasswordMatch(password)) {
          req.flash("alertMessage", "Password not match!");
          req.flash("alertStatus", "danger");
          res.redirect("/login");
        }
        req.session.user = {
          id: userGame.id,
          username: userGame.username,
        };
        res.redirect("/");
      } catch (error) {
        req.flash("alertMessage", "Something wrong!");
        res.redirect("/login");
      }
    },
    // Endpoint GET /logout
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

        const userGame = await UserGame.findOne({ where: { username: username }});
        if(userGame) {
          req.flash("alertMessage", "Username already exist!");
          req.flash("alertStatus", "danger");
          res.redirect("/register");
        }
        const newUserGame = await UserGame.create({
          username: username,
          password: password,
        });
        await UserGameBiodata.create({
          first_name: first_name,
          last_name: last_name,
          address: address,
          email: email,
          user_id: newUserGame.id,
        });

        req.session.user = {
          id: newUserGame.id,
          username: newUserGame.username,
        };
        res.redirect("/");
      } catch (error) {
        req.flash("alertMessage", "Something wrong!");
        req.flash("alertStatus", "danger");
        res.redirect("/register");
      }
    },
}