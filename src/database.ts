console.log("Database starting...");

import { Sequelize } from "sequelize";

const sequelize = new Sequelize("aisop_dev", "postgres", "@Mocshone2023", {
    host: "localhost",
    dialect: "postgres",
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");

        // create the tables in database
        return sequelize.sync();
    })
    .then(() => console.log("Tables created successfully"))
    .catch((error) =>
        console.error("Unable to connect to the database:", error)
    );

export default sequelize;
