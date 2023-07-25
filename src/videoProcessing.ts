import ffmpeg from "fluent-ffmpeg";

export function captureScreenshot(
    videoPath: string,
    outputPath: string,
    timestamp: string
) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .on("end", resolve)
            .on("error", reject)
            .screenshots({
                timestamps: [timestamp],
                filename: `screenshot-at-${timestamp}.png`,
                folder: outputPath,
            });
    });
}
