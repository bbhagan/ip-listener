import { Router as _Router } from "express";
import fs from "fs";
import os from "os";
import { errorLogger } from "../../util/errorLogger";
import Stream from "stream";
import readLine from "readline";

require("dotenv").config();
const router = _Router();
const DATA_DIR = process.env.DATA_DIR;
const IP_DATA_FILE = process.env.IP_DATA_FILE;
const GET_IPS_RETURN_LIMIT = parseInt(process.env.GET_IPS_RETURN_LIMIT);

router.get("/", async (req, res) => {
	try {
		const IPData = await getIPData(GET_IPS_RETURN_LIMIT);

		return res.json({ statusCode: 200, statusMsg: "Ok", data: IPData });
	} catch (error) {
		errorLogger(`getIPs error ${error}`);
		res.status(500);
		res.send(`Server Error`);
	}
});

const getIPData = returnLimit => {
	let inStream = fs.createReadStream(`${DATA_DIR}/${IP_DATA_FILE}`);
	let outStream = new Stream();
	const ipReturnLimit = GET_IPS_RETURN_LIMIT >= returnLimit ? returnLimit : GET_IPS_RETURN_LIMIT;

	return new Promise((resolve, reject) => {
		let rl = readLine.createInterface(inStream, outStream);
		let returnIPs = [];

		rl.on("line", line => {
			try {
				const data = JSON.parse(line);
				returnIPs.push(data);

				if (returnIPs.length > ipReturnLimit) {
					returnIPs.shift();
				}
			} catch (parseFileDataErr) {
				errorLogger(`getIPs.getIPData parse file data error ${parseFileDataErr}`);
			}
		});

		rl.on("error", rlError => {
			errorLogger(`getIPs.getIPData readLine error ${rlError}`);
			reject(rlError);
		});

		rl.on("close", () => {
			resolve(returnIPs);
		});
	});
};

export default router;
