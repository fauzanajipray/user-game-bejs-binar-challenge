const express = require("express");
const router = express.Router();
const authController = require("../controllers/api/authController");
const userGameController = require("../controllers/api/userGameController");
const UserGameHistoryController = require("../controllers/api/userGameHistoryController");

// Route UserGame
router.get("/usergame", userGameController.index);
router.get("/usergame/:id", userGameController.show);
router.post("/usergame", userGameController.store);
router.put("/usergame/:id", userGameController.update);
router.delete("/usergame/:id", userGameController.destroy);

// Route UserGameHistory
router.get("/history", UserGameHistoryController.index);
router.get("/history/:id", UserGameHistoryController.show);
router.post("/history", UserGameHistoryController.store);
router.put("/history/:id", UserGameHistoryController.update);
router.delete("/history/:id", UserGameHistoryController.destroy);


// Route Auth
router.post("/login", authController.postLogin);

module.exports = router;

