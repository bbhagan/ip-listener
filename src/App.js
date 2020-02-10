import React from "react";
import "./static/scss/global.scss";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recentIPs: [],
			errorMessage: ""
		};
	}

	getIPData = async () => {
		const REACT_APP_HOST = process.env.REACT_APP_HOST;
		const REACT_APP_PORT = process.env.REACT_APP_PORT;
		const resolvedPort = REACT_APP_PORT === "80" ? "" : `:${REACT_APP_PORT}`;
		const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY;
		const fetchOptions = { headers: { Authorization: `${REACT_APP_API_KEY}` } };
		const response = await fetch(`http://${REACT_APP_HOST}${resolvedPort}/api/getIPs/`, fetchOptions);
		const ipJSON = await response.json();

		let lastValidClientId;

		ipJSON.data = ipJSON.data
			.map(recentIP => {
				recentIP.date = new Date(recentIP.date);
				return recentIP;
			})
			.sort((a, b) => {
				//Double sort, if the client is the same, sort the clients by last date
				if (a.client - b.client === 0) {
					return b.date.getTime() - a.date.getTime();
				} else {
					return a.client - b.client;
				}
			})
			.filter(recentIP => {
				if (recentIP.client === lastValidClientId) {
					return false;
				} else {
					lastValidClientId = recentIP.client;
					return true;
				}
			});

		if (ipJSON.statusCode === 200) {
			this.setState({ recentIPs: ipJSON.data });
		} else {
			this.setState({ errorMessage: ipJSON.statusMsg });
		}
	};

	componentDidMount = () => {
		this.getIPData();

		setInterval(() => {
			this.getIPData();
		}, 30000);
	};

	render() {
		const now = new Date();
		const getDateString = date => {
			const minAgo = Math.round((now.getTime() - date.getTime()) / 60000);
			return `${date.getMonth()}-${date.getDate()}-${date
				.getFullYear()
				.toString()
				.substring(2, 4)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (${minAgo} minute${
				minAgo === 1 ? "" : "s"
			} ago) `;
		};
		return (
			<div className="wrapper">
				<div className="navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="container">
						<a href="../" className="navbar-brand">
							IP Reporter
						</a>
					</div>
				</div>
				<div className="container">
					<table className="table table-hover">
						<thead>
							<tr>
								<th scope="col">Client ID</th>
								<th scope="col">IP Address</th>
								<th scope="col">Last Update Date</th>
							</tr>
						</thead>
						<tbody>
							{this.state.recentIPs.map((recentIp, i) => {
								return (
									<tr className={recentIp.client === 0 ? "table-primary" : ""} key={i}>
										<td>{recentIp.client}</td>
										<td>{recentIp.IP}</td>
										<td>{getDateString(recentIp.date)}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
