import express from 'express';
import cors from 'cors';
import routers from './src/routes'
const app = express();
app.use(cors());
app.use(express.json());
app.use(routers);
app.use('*', (req, res) =>
    res.status(404).json({
        message: 'API endpoint not found!'
    })
);
export default app;