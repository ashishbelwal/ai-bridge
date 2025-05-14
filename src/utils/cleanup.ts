import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "../../output");
const MAX_FILE_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const cleanupOldFiles = (): void => {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      return;
    }

    const files = fs.readdirSync(OUTPUT_DIR);
    const now = Date.now();

    files.forEach((file) => {
      const filePath = path.join(OUTPUT_DIR, file);
      const stats = fs.statSync(filePath);

      // Delete files older than MAX_FILE_AGE
      if (now - stats.mtimeMs > MAX_FILE_AGE) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error("Error cleaning up old files:", error);
  }
};
