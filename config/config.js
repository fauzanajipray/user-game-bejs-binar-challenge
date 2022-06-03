
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
        username: "nnmmtewomaqhls",
        password: "13db1dc4371c19e7c780bec629b40da515c49865049e82f5055e01e470505946",
        database: "d2b70f2ujk5bjs",
        host: "ec2-34-231-221-151.compute-1.amazonaws.com",
        port: 5432,
        url: `postgres://nnmmtewomaqhls:c48e3b6fae673e06dfbefb54a1167aece2d03bb34abdeb2495bc2d7693dad791@ec2-34-231-221-151.compute-1.amazonaws.com:5432/d2b70f2ujk5bjs`,
        dialect: "postgres",
        dialectOptions: {
          ssl: { 
            require: true,
            rejectUnauthorized: false
          }
        }  
    }
};