import fs from "fs";
import Stream from "stream";
import readLine from "readline";
import { errorLogger } from "../util/errorLogger";

const DATA_DIR = process.env.DATA_DIR;
const IP_DATA_FILE = process.env.IP_DATA_FILE;
const GET_IPS_RETURN_LIMIT = parseInt(process.env.GET_IPS_RETURN_LIMIT);

const getIPData = (returnLimit) => {
	const inStream = fs.createReadStream(`${DATA_DIR}/${IP_DATA_FILE}`);
	const outStream = new Stream();
	const ipReturnLimit = GET_IPS_RETURN_LIMIT >= returnLimit ? returnLimit : GET_IPS_RETURN_LIMIT;

	return new Promise((resolve, reject) => {
		const rl = readLine.createInterface(inStream, outStream);
		const returnIPs = [];

		rl.on("line", (line) => {
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

		rl.on("error", (rlError) => {
			errorLogger(`getIPs.getIPData readLine error ${rlError}`);
			reject(rlError);
		});

		rl.on("close", () => {
			resolve(returnIPs);
		});
	});
};

export default getIPData;
