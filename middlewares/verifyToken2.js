// const verifyToken = (req, res, next) => {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader == 'undefined' || bearerHeader == null) {
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;

//         jwt.verify(req.token, 'secretkey', (err, authData) => {
//             if 
//         next();
//     } else {
//         res.status(403).json({
//             message: 'Unathorized',
//             data: null
//         });
//     }
// }

// module.exports = verifyToken;