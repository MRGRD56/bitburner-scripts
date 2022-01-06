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

/** @param {NS} ns **/
export async function main(ns) {
	const hostname = ns.getHostname();

	const scriptFiles = Object.freeze([
		'hack.js',
		'weak.js',
		'grow.js'
	]);

	for (const fileName of scriptFiles) {
		await downloadMissingFile(ns, fileName);
	}

	scriptFiles.forEach(fileName => ns.scriptKill(fileName, hostname));

	const availableRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);

	const scriptsRam = scriptFiles.reduce((result, fileName) => {
		result[fileName] = ns.getScriptRam(fileName);
		return result;
	}, {});

	const scriptsRunningPercentage = Object.freeze({
		'hack.js': 0.8,
		'weak.js': 0.1,
		'grow.js': 0.1
	});

	const runningScriptsCount = scriptFiles.reduce((result, fileName) => {
		const maxRunningScriptsCount = Math.floor(availableRam / scriptsRam[fileName]);
		result[fileName] = Math.round(maxRunningScriptsCount * scriptsRunningPercentage[fileName]);
		return result;
	}, {});

	Object.keys(runningScriptsCount).forEach(fileName => {
		const runsCount = runningScriptsCount[fileName];
		for (let i = 0; i < runsCount; i++) {
			ns.run(fileName, 1, i + 1);
		}
	});
}
