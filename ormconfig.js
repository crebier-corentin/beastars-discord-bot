const PostgressConnectionStringParser = require('pg-connection-string');

const connectionOptions = PostgressConnectionStringParser.parse(process.env.DATABASE_URL);

module.exports = {

    type: "postgres",
    host: connectionOptions.host,
    port: connectionOptions.port || 5432,
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,

    entities: [
        "build/db/entities/**/*.js"
    ],
    migrations: [
        "build/db/migrations/**/*.js"
    ],
    cli: {
        "entitiesDir": "build/db/entities",
        "migrationsDir": "build/db/migrations",
    }

};

