const createApp = require('../src/utils/main');

const options = {
  templates: ['javascript', 'typescript'],
  tests: ['none', 'jest', 'mocha'],
  databases: ['none', 'postgreSql', 'mysql2', 'mongodb'],
  ci: [true, false],
  docker: [true, false],
};

describe('CLI Commander', () => {
  options.templates.forEach((template) => {
    options.tests.forEach((test) => {
      options.databases.forEach((database) => {
        options.ci.forEach((ci) => {
          options.docker.forEach((docker) => {
            it(`should generate new node project with: ${template}, ${test}, ${database}, GitHub Action ${
              ci ? 'enabled' : 'disabled'
            }, and docker ${
              docker ? 'enabled' : 'disabled'
            }`, async () => {
              await expect(
                createApp({
                  name: `test-node-generate-${template}-${test}-${database}-ci-${
                    ci ? 'enabled' : 'disabled'
                  }-docker-${
                    docker ? 'enabled' : 'disabled'
                  }`,
                  template,
                  test,
                  database,
                  ci,
                  docker,
                })
              ).resolves.not.toThrow();
            });
          });
        });
      });
    });
  });
});
