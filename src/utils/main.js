const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Listr = require('listr');
const emoji = require('node-emoji');
const { promisify } = require('util');
const {
  generateFiles,
  executeCommand,
  addDatabaseDependencies,
  configureDatabase,
  addTestingEnv,
  configureGithubActions,
  configureDocker,
} = require('./taks');

const checkDirectoryAccess = promisify(fs.access);

module.exports = async (options) => {
  const destinationDir =
    process.env.NODE_ENV === 'test'
      ? `${process.cwd()}/__tests__/${options.name}`
      : `${process.cwd()}/${options.name}`;
  if (!fs.existsSync(destinationDir)) {
    await fs.mkdirSync(destinationDir);
  }
  const fullOptions = {
    ...options,
    destinationDir,
    currentDir: process.cwd(),
  };
  const { template } = fullOptions;
  const sourceDir = path.resolve(
    __dirname,
    '../templates',
    template.toString()
  );
  fullOptions.sourceDir = sourceDir;
  try {
    await checkDirectoryAccess(
      sourceDir,
      fs.constants.F_OK
    );
  } catch (error) {
    console.log(
      '%s Invalid template name',
      chalk.red.bold('Error')
    );
    process.exit(1);
  }

  const todos = new Listr([
    {
      title: 'Generating project file',
      task: () => generateFiles(fullOptions),
    },
    {
      title: 'Adding database dependencies',
      task: () => addDatabaseDependencies(fullOptions),
      enabled: () =>
        fullOptions.database !== 'none' &&
        !fullOptions.skip,
    },
    {
      title: 'Adding testing environment',
      task: () => addTestingEnv(fullOptions),
      enabled: () =>
        fullOptions.test !== 'none' && !fullOptions.skip,
    },
    {
      title: 'Initialize git',
      task: () => executeCommand('git init', fullOptions),
    },
    {
      title: 'Adding Github Action configuration',
      task: () =>
        configureGithubActions({ destinationDir }),
      enabled: () => fullOptions.ci,
    },
    {
      title: 'Adding Docker configuration',
      task: () => configureDocker({ destinationDir }),
      enabled: () => fullOptions.docker,
    },
    {
      title: 'Installing dependencies',
      task: () =>
        executeCommand('npm install', {
          destinationDir,
        }),
      enabled: () => process.env.NODE_ENV !== 'test',
    },
    {
      title: 'Configuring database',
      task: () => configureDatabase(fullOptions),
      enabled: () =>
        process.env.NODE_ENV !== 'test' &&
        fullOptions.database !== 'none' &&
        !fullOptions.skip,
    },
  ]);
  await todos.run();
  console.log(`
    Project generated successfully.\n
    To start using the new generated project, please run the following command:
     - ${chalk.green.italic(`cd ${fullOptions.name}`)}
     - for starting server: ${chalk.green.italic(
       `npm start`
     )}
     - for running the test: ${chalk.green.italic(
       `npm test`
     )}

    Happy hacking with NodeJs
    Your contribution is welcomed: ${chalk.blue(
      `https://github.com/abayo-luc/generate-node-project`
    )} \n
    With ${chalk.red(emoji.emojify(':heart:'))}!`);
  return true;
};
