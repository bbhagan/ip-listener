import express from "express";
import fs from "fs";
import { consoleLogger } from "./util/consoleLogger";

//Middleware
import accessLogger from "./middleware/accessLogger";
import apiKeyChecker from "./middleware/apiKeyChecker";

//Routes
import reportIP from "./routes/api/reportIP";
import getIPs from "./routes/api/getIPs";
import getServerIP from "./routes/api/getServerIP";
import getServerIPCurl from "./routes/api/getServerIPCurl";

const server = express();
const router = express.Router();
const PORT = parseInt(process.env.NODE_PORT);
const LOGS_DIR = process.env.LOGS_DIR;
const DATA_DIR = process.env.DATA_DIR;

//Make sure logs & data dir exists
try {
	fs.statSync(LOGS_DIR).isDirectory();
} catch (e) {
	try {
		fs.mkdir(LOGS_DIR, () => {
			consoleLogger(`Made logs dir: ${LOGS_DIR}`);
		});
	} catch (createDirError) {
		consoleLogger(`server.js cannot create logs dir ${createDirError}`);
	}
}
try {
	fs.statSync(DATA_DIR).isDirectory();
} catch (e) {
	try {
		fs.mkdir(DATA_DIR, () => {
			consoleLogger(`Made data dir: ${DATA_DIR}`);
		});
	} catch (createDirError) {
		consoleLogger(`server.js cannot create data dir ${createDirError}`);
	}
}

// Access Logger middleware
server.use(accessLogger);
//API Key Checker middleware
server.use(apiKeyChecker);

//Body Parser
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

/*
server.get("/", (req, res) => {
	res.send(`<h1>Nope.</h1>`);
});
*/

//Routes
router.use("/api/reportIP", reportIP);
router.use("/api/getIPs", getIPs);
router.use("/api/getServerIP", getServerIP);
router.use("/api/getServerIPCurl", getServerIPCurl);

server.use(router);

server.listen(PORT, err => {
	if (err) throw err;
	consoleLogger(`Ready on http://localhost:${PORT}`);
});
