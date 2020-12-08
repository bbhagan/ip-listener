import { consoleLogger } from "./consoleLogger";
import fs from "fs";
const LOGS_DIR = process.env.LOGS_DIR;
const DATA_DIR = process.env.DATA_DIR;
const ERROR_LOG_FILE = process.env.ERROR_LOG_FILE;
const IP_DATA_FILE = process.env.IP_DATA_FILE;

const dirFileSanity = () => {
	//Make sure logs & data dir exists
	try {
		fs.statSync(LOGS_DIR).isDirectory();
	} catch (e) {
		try {
			fs.mkdir(LOGS_DIR, () => {
				consoleLogger(`Made logs dir: ${LOGS_DIR}`);
			});
			fs.writeFile(`${LOGS_DIR}/${ERROR_LOG_FILE}`, "", () => {
				consoleLogger(`Made logs file: ${LOGS_DIR}/${ERROR_LOG_FILE}`);
			});
		} catch (createDirError) {
			consoleLogger(`server.js cannot create logs dir or file ${createDirError}`);
		}
	}

	try {
		fs.statSync(DATA_DIR).isDirectory();
	} catch (e) {
		try {
			fs.mkdir(DATA_DIR, () => {
				consoleLogger(`Made data dir: ${DATA_DIR}`);
			});
			fs.writeFile(`${DATA_DIR}/${IP_DATA_FILE}`, "", () => {
				consoleLogger(`Made data file: ${DATA_DIR}/${IP_DATA_FILE}`);
			});
		} catch (createDirError) {
			consoleLogger(`server.js cannot create data dir ${createDirError}`);
		}
	}
};

export default dirFileSanity;
