import { Router as _Router } from "express";
import moment from "moment";
import fs from "fs";
import os from "os";
import { errorLogger } from "../../util/errorLogger";

require("dotenv").config();
const router = _Router();
const DATA_DIR = process.env.DATA_DIR;
const IP_DATA_FILE = process.env.IP_DATA_FILE;

export default router.post("/", (req, res) => {
	try {
		const data = JSON.parse(JSON.stringify(req.body));
		if (data && data.IP && (data.client || data.client === 0) && !isNaN(data.client)) {
			data.date = moment().format();
			const writeStream = fs.createWriteStream(`${DATA_DIR}/${IP_DATA_FILE}`, { flags: "a" });
			writeStream.write(`${JSON.stringify(data)}${os.EOL}`);
			writeStream.end();
			return res.json({ statusCode: 200, statusMsg: "Ok" });
		} else {
			errorLogger(`reportIP.post ${req.ip} BAD DATA ${JSON.stringify(data)}`);
			return res.json({ statusCode: 500, statusMsg: "Error" });
		}
	} catch (e) {
		errorLogger(`reportIP.post ${req.ip} ${e}`);
		return res.json({ statusCode: 500, statusMsg: "Error" });
	}
});
