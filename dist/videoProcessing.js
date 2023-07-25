"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureScreenshot = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
function captureScreenshot(videoPath, outputPath, timestamp) {
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)(videoPath)
            .on("end", resolve)
            .on("error", reject)
            .screenshots({
            timestamps: [timestamp],
            filename: `screenshot-at-${timestamp}.png`,
            folder: outputPath,
        });
    });
}
exports.captureScreenshot = captureScreenshot;
