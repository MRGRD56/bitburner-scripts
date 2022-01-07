const getPackageUrl = async (packageName) => {
	const response = await fetch(`https://api.cdnjs.com/libraries/${packageName}?fields=latest`, {
		method: 'GET'
	});

	const responseBody = await response.json();

	if (responseBody.error === true) {
		throw new Error(responseBody.message || 'An error occurred');
	}

	return responseBody.latest;
};

/** @param {NS} ns **/
export async function main(ns) {
	const [packageName, destinationPath] = ns.args;

	const path = (() => {
		if (!destinationPath) {
			return '/';
		}

		return destinationPath.endsWith('/') 
			? destinationPath 
			: destinationPath + '/';
	})();

	if (!packageName) {
		ns.tprint('The package name is required!');
		return;
	}

	try {
		ns.tprint('Getting package URL...');
		const packageUrl = await getPackageUrl(packageName);

		const fileName = (/(.*\/)?(.*)$/)['exec'](packageUrl)[2];
		const filePath = [path, fileName].join('');

		ns.tprint('Downloading library...');
		const isSuccess = await ns.wget(packageUrl, filePath);
		if (isSuccess) {
			ns.tprint(`Successfully downloaded to '${filePath}'`);
		} else {
			throw new Error(`Failed to download the library to '${filePath}'`);
		}
	} catch (error) {
		ns.tprint('Error: ', error.message ?? error);
	}
}
