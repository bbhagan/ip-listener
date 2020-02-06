import { apiKeys } from "../staticData/apiKeys";
import { errorLogger } from "../util/errorLogger";

const apiKeyChecker = (req, res, next) => {
	try {
		if (apiKeys.includes(req.headers.authorization)) {
			next();
		} else {
			res.status(401);
			res.send(`Unauthorized`);
		}
	} catch (keyCheckError) {
		errorLogger(`apiKeyChecker error ${keyCheckError}`);
		res.status(500);
		res.send(`Server Error`);
	}
};

export default apiKeyChecker;
