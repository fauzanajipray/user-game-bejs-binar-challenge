const { UserGame } = require('../../models');

module.exports = {
    // Endpoint POST /login
    postLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log(req.body);
            const userGame = await UserGame.findOne({ where: { username: username }});

            if(!userGame) {;
                return res.status(404).json({
                    message: 'User Game not found'
                });
            }
            const isPasswordMatch = (password) => {
                return userGame.password === password;
            }

            if(!isPasswordMatch(password)) {
                return res.status(400).json({
                    message: 'Password not match'
                });
            }
            return res.status(200).json({
                message: 'Success',
                data: userGame.toJSON()
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}