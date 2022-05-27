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

// Route Only Admin
router.get("/usergame", auth, isAdmin, adminController.index);
router.get("/usergame/:id", auth, isAdmin, adminController.show);
// router.put("/usergame/:id", auth, isAdmin, adminController.update);
router.get("/usergame/:id/biodata", auth, isAdmin, adminController.showBiodata);
// router.put("/usergame/:id/biodata", auth, isAdmin, uploudSingle, adminController.updateBiodata);
// router.delete("/usergame/:id", auth, isAdmin, adminController.destroy);
// router.get("/history", auth, isAdmin, adminController.history);
// router.get("/history/:id", auth, isAdmin, adminController.historyDetail);
// router.put("/history/:id", auth, isAdmin, adminController.historyUpdate);
// router.delete("/history/:id", auth, isAdmin, adminController.historyDestroy);

// Route Admin and User
// router.get("/profile", auth, userController.index);
// router.put("/profile", auth, userController.update);
// router.get("/profile/biodata", auth, userController.biodata);
// router.put("/profile/biodata", auth, uploudSingle, userController.updateBiodata);
// router.get("/profile/history", auth, userController.history);
// router.post("/profile/history", auth, userController.historyCreate);
// router.get("/profile/history/:id", auth, userController.historyDetail);
// router.put("/profile/history/:id", auth, userController.historyUpdate);
// router.delete("/profile/history/:id", auth, userController.historyDestroy);

router.use((err, req, res, next) => {
    console.log(err);
    if (!res.headersSent) {
        if (err.message === 'No auth token') {
            return response(res, 401, false, err.message, null);
        } else if (err.message === 'Invalid token') {
            return response(res, 400, false, err.message, null);
        } else if (err.message === 'jwt expired') {
            return response(res, 400, false, err.message, null);
        } else {
            const msg = err.message || 'Internal Server Error';
            return response(res, 500, false, msg, null);
        }
    }
});

module.exports = router;

