const express = require("express");
const router = express.Router();
const authController = require("../controllers/web/authController");
const userGameController = require("../controllers/web/userGameController");
const UserGameHistoryController = require("../controllers/web/userGameHistoryController");
const auth = require("../middlewares/auth");

// Route Auth
router.get("/login", authController.viewLogin);
router.post("/login", authController.postLogin);
router.get("/register", authController.viewRegister);
router.post("/register", authController.postRegister);

// Route Home
router.get("/", auth, userGameController.viewHome);
router.get("/logout", auth, authController.getLogout);

// Route UserGame
router.get("/usergame", userGameController.index);
// router.get("/usergame/:id", userGameController.show);
// router.post("/usergame", userGameController.store);
// router.put("/usergame/:id", userGameController.update);
// router.delete("/usergame/:id", userGameController.destroy);

// // Route UserGameHistory
// router.get("/history", UserGameHistoryController.index);
// router.get("/history/:id", UserGameHistoryController.show);
// router.post("/history", UserGameHistoryController.store);
// router.put("/history/:id", UserGameHistoryController.update);
// router.delete("/history/:id", UserGameHistoryController.destroy);


module.exports = router;

