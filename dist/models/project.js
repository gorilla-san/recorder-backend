"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
// models/Project.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class Project extends sequelize_1.Model {
    id; // Note that the `null assertion` `!` is required in strict mode.
    name;
    files;
    data;
    screenshots;
    async addFile(filePath) {
        await this.update({
            video: (0, sequelize_1.fn)("array_append", (0, sequelize_1.col)("video"), filePath),
        });
    }
    async addScreenshot(filePath, timestamp) {
        await this.update({
            screenshots: (0, sequelize_1.fn)("array_append", (0, sequelize_1.col)("screenshots"), JSON.stringify({ path: filePath, timestamp: timestamp })),
        });
    }
}
exports.Project = Project;
Project.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    video: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    data: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    },
    screenshots: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
}, {
    tableName: "projects",
    sequelize: database_1.default, // this bit is important
});
