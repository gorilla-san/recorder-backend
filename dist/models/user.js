"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// src/models/User.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database")); // import your Sequelize instance
exports.User = database_1.default.define("User", {
    // Define your columns here
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    lastName: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
});
// User.create({
//     firstName: "Jordan",
//     lastName: "Oliver",
//     email: "john.doe@example.com",
// });
