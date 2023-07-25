// models/Project.ts
import { Model, DataTypes, fn, col } from "sequelize";
import sequelize from "../database";

class Project extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public name!: string;
    public files!: string[];
    public data: any;
    public screenshots?: string[];
    async addFile(filePath: string) {
        await this.update({
            video: fn("array_append", col("video"), filePath),
        });
    }
    async addScreenshot(filePath: string, timestamp: string) {
        await this.update({
            screenshots: fn(
                "array_append",
                col("screenshots"),
                JSON.stringify({ path: filePath, timestamp: timestamp })
            ),
        });
    }
}

Project.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        video: {
            type: DataTypes.ARRAY(DataTypes.STRING), // an array of file paths
            allowNull: false,
            defaultValue: [],
        },
        data: {
            type: DataTypes.JSONB, // JSON data
            allowNull: false,
            defaultValue: {},
        },
        screenshots: {
            type: DataTypes.ARRAY(DataTypes.STRING), // an array of JSON objects
            allowNull: false,
            defaultValue: [],
        },
    },
    {
        tableName: "projects",
        sequelize: sequelize, // this bit is important
    }
);

export { Project };
