const ncp = require('ncp');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { promisify } = require('util');
const jsPackage = require('../templates/javascript/package.json');
const tesPackage = require('../templates/typescript/package.json');
const dbPackage = require('../resources/db.json');
const testingPackage = require('../resources/testing.json');

const allPkg = {
  javascript: {
    ...jsPackage,
  },
  typescript: {
    ...tesPackage,
  },
};
const copy = promisify(ncp);
const runCommand = promisify(exec);
const generateFiles = async ({
  sourceDir,
  destinationDir,
}) => {
  copy(sourceDir, destinationDir, {
    clobber: false,
  });
};

const executeCommand = async (
  command,
  { destinationDir }
) =>
  runCommand(command.toString(), {
    cwd: destinationDir,
  });

const writePackage = async (packageData, options) => {
  const filePath = path.join(
    options.destinationDir,
    'package.json'
  );
  await fs.writeFileSync(
    filePath,
    JSON.stringify(packageData, null, 2)
  );
};

const addDatabaseDependencies = async (options) => {
  const { database, template } = options;
  const db = database.toLowerCase();
  const dbPkg = {
    ...dbPackage[template][db],
  };

  allPkg[template].dependencies = {
    ...allPkg[template].dependencies,
    ...dbPkg.dependencies,
  };
  allPkg[template].scripts = {
    ...allPkg[template].scripts,
    ...dbPkg.scripts,
  };
  await writePackage(allPkg[template], options);
};

const configureDatabase = async (options) => {
  const { database, destinationDir } = options;
  const filePath = path.join(destinationDir, 'src');
  const mongoConfigPath = path.join(
    __dirname,
    '../resources/mongo.config.js'
  );
  const seuqlizeConfig = path.join(
    __dirname,
    '../resources/.sequelizerc'
  );

  const db = database.toLowerCase();
  switch (db) {
    case 'postgresql':
      await runCommand('npm run db:init -- --force', {
        cwd: filePath,
      });
      executeCommand(
        `cp -i ${seuqlizeConfig} ${destinationDir}`,
        {
          destinationDir,
        }
      );
      return true;
    case 'mysql2':
      await runCommand('npm run db:init -- --force', {
        cwd: filePath,
      });
      executeCommand(
        `cp -i ${seuqlizeConfig} ${destinationDir}`,
        {
          destinationDir,
        }
      );
      return true;
    case 'mongodb':
      executeCommand('mkdir src/config', {
        destinationDir,
      });

      executeCommand(
        `cp -i ${mongoConfigPath} ${destinationDir}/src/config/connections.js`,
        {
          destinationDir,
        }
      );
      return true;
    default:
      return false;
  }
};

const writeTestFiles = async (options) => {
  const { template, test, destinationDir } = options;
  const fileExtention =
    template === 'typescript' ? 'ts' : 'js';
  await executeCommand(
    'mkdir __tests__ && mkdir  __tests__/helpers',
    {
      destinationDir,
    }
  );
  if (test === 'jest') {
    const requestHelper = path.join(
      __dirname,
      `../resources/test/${template}/jest.request.${fileExtention}`
    );
    const srcFilePath = path.join(
      __dirname,
      `../resources/test/${template}/jest.config.${fileExtention}`
    );
    await executeCommand(
      `cp -i ${srcFilePath} ${destinationDir}`,
      {
        destinationDir,
      }
    );
    await executeCommand(
      `cp -i ${requestHelper} ${path.join(
        destinationDir,
        `__tests__/helpers/request.${fileExtention}`
      )}`,
      {
        destinationDir,
      }
    );
  }
  const sampleTestPath = path.join(
    __dirname,
    `../resources/test/${template}/${test}.spec.${fileExtention}`
  );
  await executeCommand(
    `cp -i ${sampleTestPath} ${path.join(
      destinationDir,
      `__tests__/index.spec.${fileExtention}`
    )}`,
    {
      destinationDir,
    }
  );
};
const addTestingEnv = async (options) => {
  const { test, template } = options;
  const testingConfigs = {
    ...testingPackage[template][test],
  };

  allPkg[template].scripts = {
    ...allPkg[template].scripts,
    ...testingConfigs.scripts,
  };
  allPkg[template].devDependencies = {
    ...allPkg[template].devDependencies,
    ...testingConfigs.devDependencies,
  };
  await writePackage(allPkg[template], options);
  await writeTestFiles(options);
};

const configureGithubActions = async (options) => {
  const { destinationDir } = options;
  await executeCommand(
    'mkdir .github && mkdir .github/workflows',
    { destinationDir }
  );
  await executeCommand(
    `cp -i ${path.join(
      __dirname,
      '../resources/github/ci.yml'
    )} ${path.join(
      destinationDir,
      '.github/workflows/ci.yml'
    )}`,
    { destinationDir }
  );
};

const configureDocker = async (options) => {
  const { destinationDir } = options;
  await executeCommand(
    `cp -i ${path.join(
      __dirname,
      '../resources/docker/*'
    )} ${path.join(destinationDir, '/')}`,
    { destinationDir }
  );
  await executeCommand(
    `chmod u+x ${path.join(destinationDir, '/*.sh')}`,
    {
      destinationDir,
    }
  );
};

module.exports = {
  generateFiles,
  executeCommand,
  addDatabaseDependencies,
  configureDatabase,
  addTestingEnv,
  configureGithubActions,
  configureDocker,
};
