# bitburner-scripts
Bitburner Game Scripts

## Server Hacking

[home ~/]
```sh
wget https://raw.githubusercontent.com/MRGRD56/bitburner-scripts/main/home/nuke.js nuke.js
```

```sh
./nuke.js SERVER_NAME
```

```sh
connect SERVER_NAME
```

[SERVER_NAME ~/]
```sh
wget https://raw.githubusercontent.com/MRGRD56/bitburner-scripts/main/remote-server/multihack.js multihack.js
```

```sh
./multihack.js <MODE> <SERVER_NAME>
```

*OR*

```sh
./multihack.js 0
./hack.js -t 30 <SERVER_NAME>
./weak.js -t 3 <SERVER_NAME>
./grow.js -t 3 <SERVER_NAME>
```

## cdnpm.js *download libraries from cdnjs.com*

```sh
wget https://github.com/MRGRD56/bitburner-scripts/raw/main/home/cdnpm.js cdnpm.js
```

#### Library Downloading

```sh
./cdnpm.js [PACKAGE_NAME] <DESTINATION_DIRECTORY>
```

> `DESTINATION_DIRECTORY` must be an **absolute** path. By default it is `/`.

Example:
```
[home ~/]> ./_a/cdnpm.js axios /_a/node_modules/

Running script with 1 thread(s), pid 458 and args: ["axios","/_a/node_modules/"].

/_a/cdnpm.js: Getting package URL...

/_a/cdnpm.js: Downloading library...

/_a/cdnpm.js: Successfully downloaded to '/_a/node_modules/axios.min.js'

[home ~/]> ls /_a/node_modules/

axios.min.js  lodash.min.js 
```
