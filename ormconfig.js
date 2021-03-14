module.exports = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl  : {
        rejectUnauthorized: false // For heroku
    },
    entities: ["build/db/entities/**/*.js"],
    migrations: ["build/db/migrations/**/*.js"],
    cli: {
        entitiesDir: "build/db/entities",
        migrationsDir: "build/db/migrations",
    },
};


