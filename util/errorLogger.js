import { consoleLogger } from "./consoleLogger";
import fs from "fs";
import os from "os";
import moment from "moment";

export const errorLogger = text => {
	const LOGS_DIR = process.env.LOGS_DIR;
	const ERROR_LOG_FILE = process.env.ERROR_LOG_FILE;
	try {
		let writeStream = fs.createWriteStream(`${LOGS_DIR}/${ERROR_LOG_FILE}`, { flags: "a" });
		writeStream.write(`${moment().format()} ${text}${os.EOL}`);
	} catch (writeError) {
		consoleLogger(`logger.logger access log write error: ${writeError}`);
	}
};
