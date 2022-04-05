const express = require("express");
const router = express.Router();
const userGameController = require("../controllers/userGameController");
const UserGameHistoryController = require("../controllers/userGameHistoryController");

// Route UserGame
router.get("/usergame", userGameController.index);
router.get("/usergame/:id", userGameController.show);
router.post("/usergame", userGameController.store);
router.put("/usergame/:id", userGameController.update);
router.delete("/usergame/:id", userGameController.destroy);

// Route UserGameHistory
router.get("/usergame/history", UserGameHistoryController.index);
router.get("/usergame/history/:id", UserGameHistoryController.show);
router.post("/usergame/history", UserGameHistoryController.store);
router.put("/usergame/history/:id", UserGameHistoryController.update);
router.delete("/usergame/history/:id", UserGameHistoryController.destroy);


module.exports = router;

