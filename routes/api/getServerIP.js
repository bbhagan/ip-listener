import { Router as _Router } from "express";
import getServerIP from "../../helpers/getServerIP";

const router = _Router();

export default router.get =
	("/",
	async (req, res) => {
		const serverIP = await getServerIP();
		return res.json({ statusCode: 200, statusMsg: "Ok", ipAddress: serverIP });
	});
