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
		let data = JSON.parse(JSON.stringify(req.body));
		if (data && data.IP && data.client && !isNaN(data.client)) {
			data.date = moment().format();
			let writeStream = fs.createWriteStream(`${DATA_DIR}/${IP_DATA_FILE}`, { flags: "a" });
			writeStream.write(`${JSON.stringify(data)}${os.EOL}`);
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
