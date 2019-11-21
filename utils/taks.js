const ncp = require('ncp');
const {
    exec
} = require('child_process');
const {
    promisify
} = require('util');

const copy = promisify(ncp);
const runCommand = promisify(exec)
const generateFiles = async ({
    sourceDir,
    destinationDir
}) => {
    copy(sourceDir, destinationDir, {
        clobber: false
    });
}

const executeCommand = async (command, {
    destinationDir
}) => runCommand(command.toString(), {
    cwd: destinationDir
})


module.exports = {
    generateFiles,
    executeCommand
};