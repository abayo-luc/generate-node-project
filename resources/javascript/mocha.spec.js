import chai, {
    expect
} from 'chai';
import chaiHttp from 'chai-http';
import app from '../index'

chai.use(chaiHttp);

describe('request', () => {
    describe('GET /', () => {
        it('should respond with json response', () => {
            chai.request(app).get('/').end((err, res) => {
                const {
                    message
                } = res.body
                expect(res.status).equals(200)
                expect(message).to.contain('Hello world!')
            })
        });
        it('should respond with Not found', () => {
            chai.request(app).get('/hell-world').end((err, res) => {
                const {
                    message
                } = res.body
                expect(res.status).equals(404)
                expect(message).to.contain('API endpoint not found!')
            })
        })
    });
});