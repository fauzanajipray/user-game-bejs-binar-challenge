const express = require("express");
const router = express.Router();
const passport = require('../lib/passport-local');

const authController = require("../controllers/web/authController");

const homeController = require("../controllers/web/user/homeController");
const userGameController = require("../controllers/web/user/userGameController");
const userGameHistoryController = require("../controllers/web/user/userGameHistoryController");

const auth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const { uploudSingle } = require("../middlewares/multer");

// Route Auth
router.get("/login", authController.viewLogin);
router.post("/login", passport.authenticate('local', {failureRedirect: '/login',failureFlash: true}), authController.postLogin);
router.get("/register", authController.viewRegister);
router.post("/register", authController.postRegister);
router.get("/logout", auth, authController.getLogout);

router.use(auth);
// Route Home
router.get("/", homeController.viewHome);
router.get("/profile/update", homeController.viewUpdateProfile);
router.put("/profile/update", uploudSingle, homeController.updateProfile);
router.get("/profile/add-history", homeController.viewAddHistory);
router.get("/profile/edit-history/:id", homeController.viewEditHistory);
// Route UserGame
router.get("/usergame",  isAdmin, userGameController.index);
router.get("/usergame/:id",  isAdmin, userGameController.viewDetailUserGame);
router.get("/usergame/:id/edit",  isAdmin, userGameController.viewUpdateUsergame);
router.put("/usergame/:id/edit",  isAdmin, uploudSingle, userGameController.updateUserGame);
router.delete("/usergame/:id/delete",  isAdmin, userGameController.deleteUserGame);
// Route UserGameHistory
router.post("/history", userGameHistoryController.store);
router.get("/history",  isAdmin, userGameHistoryController.index);
router.put("/history/:id",  isAdmin, userGameHistoryController.update);
router.delete("/history/:id",  isAdmin, userGameHistoryController.destroy);

module.exports = router;

