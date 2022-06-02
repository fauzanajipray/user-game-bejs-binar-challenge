const bcrypt = require('bcrypt');

module.exports = (password) => {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
}

