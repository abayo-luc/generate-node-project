const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Listr = require('listr');
const { projectInstall } = require('pkg-install');
const { promisify } = require('util');
const {
  generateFiles,
  executeCommand,
  addDatabase,
  configureDatabase
} = require('./taks');

const checkDirectoryAccess = promisify(fs.access);

module.exports = async options => {
  const destinationDir = `${process.cwd()}/${options.name}`;
  if (!fs.existsSync(destinationDir)) {
    await fs.mkdirSync(destinationDir);
  }
  const fullOptions = {
    ...options,
    destinationDir,
    currentDir: process.cwd()
  };
  const { template } = fullOptions;
  const sourceDir = path.resolve(
    __dirname,
    '../templates',
    template.toString()
  );
  fullOptions.sourceDir = sourceDir;
  try {
    await checkDirectoryAccess(sourceDir, fs.constants.F_OK);
  } catch (error) {
    console.log('%s Invalid template name', chalk.red.bold('Error'));
    process.exit(1);
  }
  const todos = new Listr([
    {
      title: 'Generating project file',
      task: () => generateFiles(fullOptions)
    },
    {
      title: 'Adding database dependencies',
      task: () => addDatabase(fullOptions),
      enabled: () => fullOptions.database !== 'none'
    },
    {
      title: 'Add test environment',
      task: () => null,
      enabled: () => fullOptions.test !== 'none'
    },
    {
      title: 'Initialize git',
      task: () => executeCommand('git init', fullOptions)
    },
    {
      title: 'Installing dependencies',
      task: () =>
        projectInstall({
          cwd: fullOptions.destinationDir
        })
    },
    {
      title: 'Configuring database',
      task: () => configureDatabase(fullOptions),
      enabled: () => fullOptions.database !== 'none'
    }
  ]);
  await todos.run();
  console.log('%s Project generated successfully', chalk.green.bold('DONE'));
  return true;
};
