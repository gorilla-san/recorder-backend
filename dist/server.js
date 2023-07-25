"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Server startin...");
// src/server.ts
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const project_1 = require("./models/project");
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const videoProcessing_1 = require("./videoProcessing");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
const port = 8080;
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
        cb(null, (0, uuid_1.v4)() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    database_1.default
        .sync()
        .then(() => console.log("All models were synchronized successfully."))
        .catch((error) => console.error("An error occurred while syncing models:", error));
});
app.post("/projects/:projectId/files", upload.single("file"), async (req, res) => {
    const { projectId } = req.params;
    const data = JSON.parse(req.body.data);
    const file = req.file;
    console.log(data);
    const filePath = path_1.default.join("uploads", file.filename);
    try {
        const project = await project_1.Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        await project.addFile(filePath);
        await project.update({ data: data });
        const screenshotPaths = [];
        for (let dataPoint of data) {
            await (0, videoProcessing_1.captureScreenshot)(filePath, "uploads", dataPoint.timeStamp);
            console.log(`Screenshot captured at ${dataPoint.timeStamp}`);
            let screenshotPath = path_1.default.join("uploads", `screenshot-at-${dataPoint.timeStamp}.png`);
            screenshotPaths.push(screenshotPath);
        }
        await project.update({ screenshots: screenshotPaths });
        res.json({ message: "File uploaded successfully", filePath });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post("/projects", async (req, res) => {
    const { name } = req.body;
    try {
        const project = await project_1.Project.create({ name, files: [] });
        res.json({ message: "Project created successfully", project });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get("/projects", async (req, res) => {
    try {
        const projects = await project_1.Project.findAll();
        res.json(projects);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// get a project by id
app.get("/projects/:projectId", async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await project_1.Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
