
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
        username: "pfzqxocydqvswt",
        password: "13db1dc4371c19e7c780bec629b40da515c49865049e82f5055e01e470505946",
        database: "d3juovg27i85ot",
        host: "ec2-52-4-104-184.compute-1.amazonaws.com",
        port: 5432,
        url: `postgres://pfzqxocydqvswt:13db1dc4371c19e7c780bec629b40da515c49865049e82f5055e01e470505946@ec2-52-4-104-184.compute-1.amazonaws.com:5432/d3juovg27i85ot`,
        dialect: "postgres",
        dialectOptions: {
          ssl: { 
            require: true,
            rejectUnauthorized: false
          }
        }  
    }
};