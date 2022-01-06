/** @param {NS} ns **/
export async function main(ns) {
	const hostName = ns.getHostname();

	while (true) {
		await ns.grow(hostName);
	}
}
