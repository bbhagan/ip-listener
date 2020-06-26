import moment from "moment";
import fs from "fs";
import os from "os";
import { consoleLogger } from "../util/consoleLogger";
import { errorLogger } from "../util/errorLogger";

const accessLogger = (req, res, next) => {
	//For some reason middleware doesn't have access to these const outside of the method, here they are moved in
	const LOGS_DIR = process.env.LOGS_DIR;
	const ACCESS_LOG_FILE = process.env.ACCESS_LOG_FILE;
	const logString = `${req.ip} ${req.method} ${req.originalUrl} ${req.get("User-Agent")}`;
	consoleLogger(logString);
	try {
		const writeStream = fs.createWriteStream(`${LOGS_DIR}/${ACCESS_LOG_FILE}`, { flags: "a" });
		writeStream.write(`${moment().format()} ${logString}${os.EOL}`);
		writeStream.end();
	} catch (writeError) {
		consoleLogger(`accessLogger access log write error: ${writeError}`);
		errorLogger(`accessLogger access log write error: ${writeError}`);
	}
	next();
};
export default accessLogger;
