
module.exports = {
    development: {
        username: "postgres",
        password: "123",
        database: "db_user_game",
        host: "127.0.0.1",
        dialect: "postgres"
    },
    test: {
        username: "postgres",
        password: "123",
        database: "db_user_game",
        host: "127.0.0.1",
        dialect: "postgres"
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        port: parseInt(process.env.DB_PORT),
        url: `${process.env.DB_DIALECT}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        dialect: "postgres",
        dialectOptions: {
          ssl: { 
            require: true,
            rejectUnauthorized: false
          }
        }  
    }
};