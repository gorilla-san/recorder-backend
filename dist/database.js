"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Database starting...");
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("aisop_dev", "postgres", "@Mocshone2023", {
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
    .catch((error) => console.error("Unable to connect to the database:", error));
exports.default = sequelize;
