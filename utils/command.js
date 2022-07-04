const yargs = require('yargs');
const inquirer = require('inquirer');
const createApp = require('./main');

const args = yargs
  .usage('Usage: <command> [options]')
  .help('h')
  .alias('v', 'version')
  .alias('h', 'help')
  .command('name', 'Specify the app name')
  .choices('t', ['javascript', 'typescript'])
  .option('t', {
    alias: 'template',
    description: 'Choose which project template to use',
    type: 'string',
  })
  .choices('test', ['mocha', 'jest', 'none'])
  .option('test', {
    describe: 'Choose which testing framework to use',
    type: 'string',
  })
  .option('d', {
    alias: 'database',
    description: 'Add database',
    type: 'string',
  })
  .choices('database', [
    'none',
    'postgreSql',
    'mysql2',
    'mongodb',
  ])
  .option('c', {
    alias: 'ci',
    description: 'Add Github Action',
    type: 'boolean',
  })
  .option('d', {
    alias: 'docker',
    description: 'Add docker',
    type: 'boolean',
  })
  .option('s', {
    alias: 'skip',
    description: 'Skip everything',
    type: Boolean,
  }).argv;

const optionsPrompt = async (options) => {
  if (options.skip) {
    return {
      ...options,
      template: 'javascript',
      name: args._[0] || 'new-nodejs-app',
    };
  }
  const questions = [];
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message:
        'Please choose which project template to use',
      choices: ['javascript', 'typescript'],
      default: 'javascript',
    });
  }
  if (!options.test) {
    questions.push({
      type: 'list',
      name: 'test',
      message:
        'Please choose which testing framework to use',
      choices: ['none', 'jest', 'mocha'],
      default: 'none',
    });
  }
  if (!options.database) {
    questions.push({
      type: 'list',
      name: 'database',
      message: 'Please choose database to use',
      choices: ['none', 'postgreSql', 'mysql2', 'mongodb'],
      default: 'none',
    });
  }

  if (!options.ci) {
    questions.push({
      type: 'confirm',
      name: 'ci',
      message: 'Add GitHub actions',
      default: false,
    });
  }

  if (!options.docker) {
    questions.push({
      type: 'confirm',
      name: 'docker',
      message: 'Add docker configuration',
      default: false,
    });
  }
  const answers = await inquirer.prompt(questions);
  return {
    name: args._[0] || 'new-nodejs-app',
    ...options,
    ...answers,
  };
};

module.exports = async () => {
  const options = await optionsPrompt(args);
  createApp(options);
};
