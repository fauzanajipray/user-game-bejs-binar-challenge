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
router.get("/history", UserGameHistoryController.index);
router.get("/history/:id", UserGameHistoryController.show);
router.post("/history", UserGameHistoryController.store);
router.put("/history/:id", UserGameHistoryController.update);
router.delete("/history/:id", UserGameHistoryController.destroy);



module.exports = router;

