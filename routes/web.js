const express = require("express");
const router = express.Router();

const authController = require("../controllers/web/authController");
const uHomeController = require("../controllers/web/user/homeController");
const uUserGameController = require("../controllers/web/user/userGameController");
const uUserGameHistoryController = require("../controllers/web/user/userGameHistoryController");
const auth = require("../middlewares/restrict");

// Route Auth
router.get("/login", authController.viewLogin);
router.post("/login", authController.postLogin);
router.get("/register", authController.viewRegister);
router.post("/register", authController.postRegister);
router.get("/logout", auth, authController.getLogout);

// * USER ROUTES

// Route Home
router.get("/", auth, uHomeController.viewHome);
router.get("/profile/update", auth, uHomeController.viewUpdateProfile);
router.put("/profile/update", auth, uHomeController.updateProfile);
router.get("/profile/add-history", auth, uHomeController.viewAddHistory);
router.get("/profile/edit-history/:id", auth, uHomeController.viewEditHistory);
// Route UserGame
router.get("/usergame", auth, uUserGameController.index);
router.get("/usergame/:id", auth, uUserGameController.viewDetailUserGame);
// Route UserGameHistory
router.get("/history", auth, uUserGameHistoryController.index);
router.post("/history", auth, uUserGameHistoryController.store);
router.put("/history/:id", auth, uUserGameHistoryController.update);
router.delete("/history/:id", auth, uUserGameHistoryController.destroy);

// * ADMIN ROUTES


module.exports = router;

