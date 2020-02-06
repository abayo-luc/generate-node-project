const ncp = require('ncp');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { promisify } = require('util');
const jsPackage = require('../templates/javascript/package.json');
const dbPackage = require('../resources/db.json');
const testingPackage = require('../resources/testing.json');

const allPkg = {
  javascript: {
    ...jsPackage
  }
};
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

const writePackage = async (packageData, options) => {
  const filePath = path.join(options.destinationDir, 'package.json');
  await fs.writeFileSync(filePath, JSON.stringify(packageData, null, 2));
};

const addDatabaseDependencies = async options => {
  const { database, template } = options;
  const db = database.toLowerCase();
  const dbPkg = {
    ...dbPackage[template][db]
  };
  allPkg[template].dependencies = {
    ...allPkg[template].dependencies,
    ...dbPkg.dependencies
  };
  allPkg[template].scripts = {
    ...allPkg[template].scripts,
    ...dbPkg.scripts
  };
  await writePackage(allPkg[template], options);
};

const configureDatabase = async options => {
  const { database, destinationDir } = options;
  const filePath = path.join(destinationDir, 'src');
  const mongoConfigPath = path.join(__dirname, '../resources/mongo.config.js');
  const db = database.toLowerCase();
  switch (db) {
    case 'postgresql':
      runCommand('npx sequelize init', {
        cwd: filePath
      });
      return true;
    case 'mongodb':
      executeCommand(
        `cp -i ${mongoConfigPath} ${destinationDir}/src/config/connections.js`,
        {
          destinationDir
        }
      );
      return true;
    default:
      return false;
  }
};

const writeTestFiles = async options => {
  const { template, test, destinationDir } = options;
  await executeCommand('mkdir __tests__ && mkdir  __tests__/helpers', {
    destinationDir
  });
  if (test === 'jest') {
    const requestHelper = path.join(
      __dirname,
      `../resources/${template}/jest.request.js`
    );
    const srcFilePath = path.join(
      __dirname,
      `../resources/${template}/jest.config.js`
    );
    await executeCommand(`cp -i ${srcFilePath} ${destinationDir}`, {
      destinationDir
    });
    await executeCommand(
      `cp -i ${requestHelper} ${path.join(
        destinationDir,
        '__tests__/helpers/request.js'
      )}`,
      {
        destinationDir
      }
    );
  }
  const sampleTestPath = path.join(
    __dirname,
    `../resources/${template}/${test}.spec.js`
  );
  await executeCommand(
    `cp -i ${sampleTestPath} ${path.join(
      destinationDir,
      '__tests__/index.spec.js'
    )}`,
    {
      destinationDir
    }
  );
};
const addTestingEnv = async options => {
  const { test, template } = options;
  const testingConfigs = {
    ...testingPackage[test]
  };

  allPkg[template].scripts = {
    ...allPkg[template].scripts,
    ...testingConfigs.scripts
  };
  allPkg[template].devDependencies = {
    ...allPkg[template].devDependencies,
    ...testingConfigs.devDependencies
  };
  await writePackage(allPkg[template], options);
  await writeTestFiles(options);
};

module.exports = {
  generateFiles,
  executeCommand,
  addDatabaseDependencies,
  configureDatabase,
  addTestingEnv
};
