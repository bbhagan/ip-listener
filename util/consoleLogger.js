import moment from "moment";

export const consoleLogger = text => {
	console.log(`${moment().format()} ${text}`);
};
