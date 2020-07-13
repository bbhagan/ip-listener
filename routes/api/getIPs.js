import { Router as _Router } from "express";
import getIPData from "../../helpers/getIPData";
import { errorLogger } from "../../util/errorLogger";

const router = _Router();

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

export default router;
