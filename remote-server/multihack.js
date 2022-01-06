/** 
 * @param {NS} ns
 * @param {string} fileName
 * @returns {Promise<boolean>} 
 */
const downloadFile = (ns, fileName) => {
	return ns.wget(`https://raw.githubusercontent.com/MRGRD56/bitburner-scripts/main/remote-server/${fileName}`, fileName);
};

/** 
 * @param {NS} ns
 * @param {string} fileName
 * @returns {Promise<boolean>} 
 */
const downloadMissingFile = async (ns, fileName) => {
	if (ns.fileExists(fileName)) {
		return true;
	}

	const result = await downloadFile(ns, fileName);
	ns.tprint(`downloaded file '${fileName}' - ${result}`);
	return result;
};

const scriptsRunsPercentage = Object.freeze({
	'hack.js': 0.8,
	'weak.js': 0.1,
	'grow.js': 0.1
});

const scriptFiles = Object.freeze(Object.keys(scriptsRunsPercentage));

/** 
 * @param {NS} ns 
 * @returns {Promise<void>}
 */
const downloadMissingFiles = async (ns) => {
	for (const fileName of scriptFiles) {
		await downloadMissingFile(ns, fileName);
	}
};

/** 
 * @param {NS} ns 
 * @param {string} hostname
 * @returns {void}
 */
const killRunningProcesses = (ns, hostname) => {
	scriptFiles.forEach(fileName => ns.scriptKill(fileName, hostname));
};

/**
 * @param {NS} ns
 * @param {string} fileName
 * @param {number} runsCount
 * @param {boolean} isManyProcesses
 * @returns {void}
 */
const multirunScript = (ns, fileName, runsCount, isManyProcesses) => {
	if (isManyProcesses) {
		for (let i = 0; i < runsCount; i++) {
			ns.run(fileName, 1, i + 1);
			ns.tprint(`run ${fileName} ${i + 1}`);
		}
	} else {
		ns.run(fileName, runsCount);
		ns.tprint(`run ${fileName}, ${runsCount} thread(s)`);
	}
};

/** @param {NS} ns **/
export async function main(ns) {
	/**
	 * @type {0 | 1 | 2}
	 * 0 - do not run scripts, only download missing files  
	 * 1 - multiple threads  
	 * 2 - multiple processes
	 */
	const mode = +ns.args[0] ?? 1;

	const hostname = ns.getHostname();

	await downloadMissingFiles(ns);

	if (mode === 0) {
		return;
	}

	killRunningProcesses(ns, hostname);

	const availableRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);

	const scriptsRam = scriptFiles.reduce((result, fileName) => {
		result[fileName] = ns.getScriptRam(fileName);
		return result;
	}, {});

	const runningScriptsCount = scriptFiles.reduce((result, fileName) => {
		const maxRunningScriptsCount = Math.floor(availableRam / scriptsRam[fileName]);
		result[fileName] = Math.floor(maxRunningScriptsCount * scriptsRunsPercentage[fileName]);
		return result;
	}, {});

	Object.keys(runningScriptsCount).forEach(fileName => {
		const runsCount = runningScriptsCount[fileName];
		multirunScript(ns, fileName, runsCount, mode === 2);
	});
}
