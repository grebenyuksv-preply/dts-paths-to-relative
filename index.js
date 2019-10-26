const path = require('path');
const fs = require('fs');
const replace = require('replace-in-file');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [{ name: 'rootDir', type: String }];

const { rootDir } = commandLineArgs(optionDefinitions);

if (!rootDir) {
	throw '--rootDir not passed';
}

const rootDirAbs = path.resolve(rootDir);

const dirs = fs
	.readdirSync(rootDir)
	//	trim .d.ts extensions
	//	in order to capture 'module' from "import _ from 'module'"
	//	regardless from whether it's a file or a dir
	.map(x => x.replace(/\.d\.ts$/, ''));

const regexp = new RegExp(`from\\s+['"](${dirs.join('|')})['"]`, 'g');

let curFile;

replace.sync({
	files: `${rootDir}/**/*.d.ts`,
	from: file => {
		curFile = file;
		return regexp;
	},
	to: (...args) => {
		const filePath = curFile.substr(0, curFile.lastIndexOf('/'));
		return `from '${path.relative(filePath, rootDir) || '.'}/${args[1]}'`;
	},
	verbose: true,
});
