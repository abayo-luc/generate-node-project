const { execSync } = require('child_process');

module.exports = async () => {
  await execSync('npm run clear', {
    cwd: process.cwd(),
  });
};
