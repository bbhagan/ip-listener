import { Router as _Router } from "express";
import getIPData from "../../helpers/getIPData";
import { errorLogger } from "../../util/errorLogger";

const router = _Router();

const GET_IPS_RETURN_LIMIT = parseInt(process.env.GET_IPS_RETURN_LIMIT);

router.get("/", async (req, res) => {
	try {
		let IPData = await getIPData(GET_IPS_RETURN_LIMIT);
		const filteredIPData = [];
		//First sort by client
		IPData = IPData.sort((a, b) => {
			return a.client - b.client;
		});
		//With it sorted by client, now go over each one and determine if it's date is greater
		// than the previous put onto the array, if so replace it
		IPData.forEach((IPRow) => {
			const lastFilteredRow = filteredIPData[filteredIPData.length - 1];
			//Check for an empty filteredIPData array, and if the client number is the same
			//as the client number in IPRow
			if (filteredIPData.length > 0 && lastFilteredRow.client === IPRow.client) {
				//Make real dates out of the date strings
				const IPRowDate = new Date(IPRow.date);
				const lastFilteredRowDate = new Date(lastFilteredRow.date);
				//Compare get times() (ms) of each one
				if (IPRowDate.getTime() >= lastFilteredRowDate.getTime()) {
					//If the IPRow one is bigger, pop the old one off and push the new one on
					filteredIPData.pop();
					filteredIPData.push(IPRow);
				}
			} else {
				//If its an empty array, or the client number is different, tack the current row onto the array
				//Empty = put it the first one on there, different client than one on IPRow means iteration of IPRow
				//has moved on from the last client number on filteredIPData
				filteredIPData.push(IPRow);
			}
		});

		return res.json({ statusCode: 200, statusMsg: "Ok", data: filteredIPData });
	} catch (error) {
		errorLogger(`getIPs error ${error}`);
		res.status(500);
		res.send(`Server Error`);
	}
});

export default router;
