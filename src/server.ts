console.log("Server startin...");

// src/server.ts
import express from "express";
import sequelize from "./database";
import cors from "cors";
import multer from "multer";
import path from "path";
import { Project } from "./models/project";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import { captureScreenshot } from "./videoProcessing";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const port = 8080;

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    sequelize
        .sync()
        .then(() => console.log("All models were synchronized successfully."))
        .catch((error) =>
            console.error("An error occurred while syncing models:", error)
        );
});

app.post(
    "/projects/:projectId/files",
    upload.single("file"),
    async (req, res) => {
        const { projectId } = req.params;
        const data = JSON.parse(req.body.data);
        const file = req.file;
        console.log(data);

        const filePath = path.join("uploads", file!.filename);

        try {
            const project = await Project.findByPk(projectId);

            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }

            await project.addFile(filePath);

            await project.update({ data: data });

            const screenshotPaths = [];
            for (let dataPoint of data) {
                await captureScreenshot(
                    filePath,
                    "uploads",
                    dataPoint.timeStamp
                );
                console.log(`Screenshot captured at ${dataPoint.timeStamp}`);
                let screenshotPath = path.join(
                    "uploads",
                    `screenshot-at-${dataPoint.timeStamp}.png`
                );
                screenshotPaths.push(screenshotPath);
            }

            await project.update({ screenshots: screenshotPaths });

            res.json({ message: "File uploaded successfully", filePath });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
);

app.post("/projects", async (req, res) => {
    const { name } = req.body;

    try {
        const project = await Project.create({ name, files: [] });
        res.json({ message: "Project created successfully", project });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/projects", async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// get a project by id
app.get("/projects/:projectId", async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});
