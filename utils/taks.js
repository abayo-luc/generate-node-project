const ncp = require('ncp');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { promisify } = require('util');
const javascriptPkg = require('../templates/javascript/package.json');
const postgresqlPkg = require('../resources/postgresql.json');

const copy = promisify(ncp);
const runCommand = promisify(exec);
const generateFiles = async ({ sourceDir, destinationDir }) => {
  copy(sourceDir, destinationDir, {
    clobber: false
  });
};

const executeCommand = async (command, { destinationDir }) =>
  runCommand(command.toString(), {
    cwd: destinationDir
  });

const writePackage = async (db, options) => {
  const dbPkg = {
    postgresql: postgresqlPkg
  };
  const appPkg = {
    javascript: {
      ...javascriptPkg
    }
  };
  const allPkg = {
    ...appPkg[options.template]
  };
  allPkg.dependencies = {
    ...allPkg.dependencies,
    ...dbPkg[db].dependencies
  };
  allPkg.scripts = {
    ...allPkg.scripts,
    ...dbPkg[db].scripts
  };
  const filePath = path.join(options.destinationDir, 'package.json');
  await fs.writeFileSync(filePath, JSON.stringify(allPkg, null, 2));
};
const configureDatabase = async options => {
  const filePath = path.join(options.destinationDir, 'src');
  runCommand('npx sequelize init', {
    cwd: filePath
  });
};
const addDatabase = async options => {
  const { database } = options;
  switch (database.toLowerCase()) {
    case 'postgresql':
      await writePackage(database.toLowerCase(), options);
      return true;
    case 'mongodb':
      console.log('>>>>>MongoDB');
      return true;
    default:
      return false;
  }
};

module.exports = {
  generateFiles,
  executeCommand,
  addDatabase,
  configureDatabase
};
