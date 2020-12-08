import express from "express";

import { consoleLogger } from "./util/consoleLogger";
import dirFileSanity from "./util/dirFileSanity";

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
const EXPRESS_PORT = parseInt(process.env.EXPRESS_PORT);

//Init the file system
dirFileSanity();

// Access Logger middleware
server.use(accessLogger);
//API Key Checker middleware
server.use(apiKeyChecker);

//Body Parser
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

//Routes
router.use("/api/reportIP", reportIP);
router.use("/api/getIPs", getIPs);
router.use("/api/getServerIP", getServerIP);
router.use("/api/getServerIPCurl", getServerIPCurl);

server.use(router);

server.listen(EXPRESS_PORT, (err) => {
	if (err) throw err;
	consoleLogger(`Ready on http://localhost:${EXPRESS_PORT}`);
});
