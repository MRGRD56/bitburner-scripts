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
 * @param {Array<string | number | boolean>} args
 * @param {number} runsCount
 * @param {boolean} isManyProcesses
 * @returns {void}
 */
const multirunScript = (ns, fileName, args, runsCount, isManyProcesses) => {
	if (isManyProcesses) {
		for (let i = 0; i < runsCount; i++) {
			const scriptArgs = [...args, i + 1];
			ns.run(fileName, 1, ...scriptArgs);
			ns.tprint(`run ${fileName} ${scriptArgs.join(' ')}`);
		}
	} else {
		ns.run(fileName, runsCount, ...args);
		ns.tprint(`run ${fileName} ${args.join(' ')}, ${runsCount} thread(s)`);
	}
};

/** @param {NS} ns **/
export async function main(ns) {
	const hostname = ns.getHostname();
	
	/**
	 * @type {0 | 1 | 2}
	 * 0 - do not run scripts, only download missing files  
	 * 1 - multiple threads  
	 * 2 - multiple processes
	 */
	const mode = +ns.args[0] ?? 1;
	const scriptArgs = (() => {
		const args = ns.args.slice(1);
		return args.length ? args : [hostname];
	})();

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
		multirunScript(ns, fileName, scriptArgs, runsCount, mode === 2);
	});
}
