/** 
 * @param {NS} ns 
 * @param {string} serverName
 * @returns {boolean}
 */
export const getRootAccess = (ns, serverName) => {
	const portHackingPrograms = Object.freeze({
		'BruteSSH.exe': () => ns.brutessh(serverName),
		'FTPCrack.exe': () => ns.ftpcrack(serverName),
		'RelaySMTP.exe': () => ns.relaysmtp(serverName),
		'HTTPWorm.exe': () => ns.httpworm(serverName),
		'SQLInject.exe': () => ns.sqlinject(serverName)
	});

	const {print, tprint, hasRootAccess, nuke, getServerNumPortsRequired, fileExists} = ns;

	const requiredPorts = getServerNumPortsRequired(serverName);

	tprint('required ports: ', requiredPorts);

	const existingPortHackingFiles = Object.keys(portHackingPrograms)
		.filter(fileName => fileExists(fileName, 'home'));
	
	tprint('executing: ', existingPortHackingFiles);

	existingPortHackingFiles.forEach(fileName => {
		portHackingPrograms[fileName]();
	});

	if (hasRootAccess(serverName)) {
		return true;
	}

	const nukeResult = nuke(serverName);
	print(`nuked '${serverName}'`, nukeResult);

	if (hasRootAccess(serverName)) {
		return true;
	}

	print('still no root access');
	return false;
};

/** @param {NS} ns */
export const main = async (ns) => {
	const {args, tprint} = ns;

	const [serverName] = args;

	if (!serverName) {
		tprint('Server name is required!');
		return;
	}

	const result = getRootAccess(ns, serverName);
	tprint('result ', result);
};
