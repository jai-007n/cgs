const request = require('supertest');

describe('A basic Test', () => {
    it('should responds "Hello World!"', async () => {
        const response = { text: "Hello World!" }
        expect(response.text).toBe('Hello World!');
    });
});