const express = require("express");
const router = express.Router();
const authController = require("../controllers/web/authController");
const homeController = require("../controllers/web/homeController");
const userGameController = require("../controllers/web/userGameController");
const UserGameHistoryController = require("../controllers/web/userGameHistoryController");
const auth = require("../middlewares/auth");

// Route Auth
router.get("/login", authController.viewLogin);
router.post("/login", authController.postLogin);
router.get("/register", authController.viewRegister);
router.post("/register", authController.postRegister);

router.get("/logout", auth, authController.getLogout);

router.get("/", auth, homeController.viewHome);
router.get("/profile/update", auth, homeController.viewUpdateProfile);
router.put("/profile/update", auth, homeController.updateProfile);
router.get("/profile/add-history", auth, homeController.viewAddHistory);
router.get("/profile/edit-history/:id", auth, homeController.viewEditHistory);

// Route UserGame
router.get("/usergame", auth, userGameController.index);
router.get("/usergame/:id", auth, userGameController.viewDetailUserGame);

// Route UserGameHistory
router.get("/history", auth, UserGameHistoryController.index);
router.post("/history", auth, UserGameHistoryController.store);
router.put("/history/:id", auth, UserGameHistoryController.update);
router.delete("/history/:id", auth, UserGameHistoryController.destroy);

module.exports = router;

