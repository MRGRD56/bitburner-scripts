/** @param {NS} ns **/
export async function main(ns) {
	const hostName = ns.args[0] || ns.getHostname();

	while (true) {
		await ns.weaken(hostName);
	}
}
