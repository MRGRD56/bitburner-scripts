import {getRootAccess} from './nuke';

export const main = async (ns) => {
	const {args, print, tprint, hack, grow, weaken} = ns;

	const [serverName] = args;

	if (!serverName) {
		tprint('The server name is required!');
		return;
	}

	if (!getRootAccess(ns, serverName)) {
		tprint('Unable to get root access');
	}

	while (true) {
		await hack(serverName);
	}
};
