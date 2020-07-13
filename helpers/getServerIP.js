import getIPData from "./getIPData";

const GET_IPS_RETURN_LIMIT = parseInt(process.env.GET_IPS_RETURN_LIMIT);

export default async function getServerIP() {
	let IPData = await getIPData(GET_IPS_RETURN_LIMIT);
	IPData = IPData.filter((entry) => entry.client === 0).sort((a, b) => {
		const dateA = new Date(a.date).getTime();
		const dateB = new Date(b.date).getTime();
		return dateB - dateA;
	});
	return IPData[0].IP;
}
