import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/userModel.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zorvyn_test';

beforeAll(async () => {
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    }
});

describe('Auth endpoints', () => {
    test('should respond with welcome in root', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Finance Data Processing and Access Control System' });
    });

    test('signup and login flow', async () => {
        const signupRes = await request(app)
            .post('/api/auth/signup')
            .send({ name: 'Test User', email: 'test@example.com', password: 'Password1!', role: 'admin' });

        expect(signupRes.statusCode).toBe(201);
        expect(signupRes.body.user).toHaveProperty('_id');
        expect(signupRes.body.user).not.toHaveProperty('password');
        expect(signupRes.body).toHaveProperty('token');

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'Password1!' });

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body.user).toHaveProperty('email', 'test@example.com');
        expect(loginRes.body).toHaveProperty('token');
    });
});
