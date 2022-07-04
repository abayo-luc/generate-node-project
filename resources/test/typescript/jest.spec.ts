import request from './helpers/request';

describe('Name of the group', () => {
  describe('GET /', () => {
    test('should respond with json data', () => {
      return request.get('/api').then((res) => {
        const { message } = res.body;
        expect(res.status).toEqual(200);
        expect(message).toEqual(
          'Welcome to node-ts boilerplate'
        );
      });
    });
  });
  describe('GET /****', () => {
    test('should respond with 404', () => {
      return request.get('/hello-world').then((res) => {
        const { message } = res.body;
        expect(res.status).toEqual(404);
        expect(message).toEqual('Route not found');
      });
    });
  });
});
