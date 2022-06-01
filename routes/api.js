const express = require("express");
const router = express.Router();
const authController = require("../controllers/api/authController");
const adminController = require("../controllers/api/adminController");
const userController = require("../controllers/api/userController");

const auth = require("../middlewares/authApi");
const isAdmin = require("../middlewares/isAdminApi"); 
const response = require("../utils/formatResponse");
const {uploudSingle} = require("../middlewares/multer");

// Route Auth
router.post("/login", authController.postLogin);
router.post("/register", authController.postRegister);
router.post("/forgot-password", authController.postForgotPassword);
// router.get("/reset-password", authController.getResetPassword);


// Route Only Admin
router.get("/usergame", auth, isAdmin, adminController.getUsergames);
router.get("/usergame/:id", auth, isAdmin, adminController.getUsergame);
router.put("/usergame/:id", auth, isAdmin, adminController.putUsergame);   
router.delete("/usergame/:id", auth, isAdmin, adminController.deleteUsergame);
router.put("/usergame/:id/biodata", auth, isAdmin, uploudSingle, adminController.putBiodata);  
router.get("/history", auth, isAdmin, adminController.getHistories);
router.get("/history/:id", auth, isAdmin, adminController.getHistory);
router.put("/history/:id", auth, isAdmin, adminController.putHistory);
router.delete("/history/:id", auth, isAdmin, adminController.deleteHistory);

// Route Admin and User
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.putProfile);
router.get("/profile/biodata", auth, userController.getBiodata);
router.put("/profile/biodata", auth, uploudSingle, userController.putBiodata);
router.get("/profile/history", auth, userController.getHistories);
router.post("/profile/history", auth, userController.postHistory);
router.get("/profile/history/:id", auth, userController.getHistory);
router.put("/profile/history/:id", auth, userController.putHistory);
router.delete("/profile/history/:id", auth, userController.deleteHistory);

router.use((err, req, res, next) => {
    console.log(err);
    if (!res.headersSent) {
        if (err.message === 'No auth token') {
            return response(res, 401, false, err.message, null);
        } else if (err.message === 'Invalid token') {
            return response(res, 400, false, err.message, null);
        } else if (err.message === 'jwt expired') {
            return response(res, 400, false, err.message, null);
        } else if (err.message === 'ErrorInputExtension') {
            return response(res, 415, false, "Unsupport Media Type", null);
        } else {
            const msg = err.message || 'Internal Server Error';
            return response(res, 500, false, msg, null);
        }
    }
});

module.exports = router;

