/** @format */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { UserGame } = require('../models');

async function authenticate(username, password, done) {
  try {
    const user = await UserGame.authenticate(username, password );
    // console.log(user);
    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(null, false, { message: error });
  }
}

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticate));

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
  try {
    done(null, await UserGame.findByPk(id));
  } catch (error) {
    done(error, null)
  }
});

module.exports = passport;
