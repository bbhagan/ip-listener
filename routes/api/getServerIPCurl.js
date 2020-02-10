import { Router as _Router } from "express";
import getIPData from "../../helpers/getIPData";

const router = _Router();
const GET_IPS_RETURN_LIMIT = parseInt(process.env.GET_IPS_RETURN_LIMIT);

export default router.get =
	("/",
	async (req, res) => {
		let IPData = await getIPData(GET_IPS_RETURN_LIMIT);
		IPData = IPData.filter(entry => entry.client === 0).sort((a, b) => {
			const dateA = new Date(a.date).getTime();
			const dateB = new Date(b.date).getTime();
			return dateB - dateA;
		});

		res.set("Content-Type", "text/plain");
		res.send(IPData[0].IP);
	});
