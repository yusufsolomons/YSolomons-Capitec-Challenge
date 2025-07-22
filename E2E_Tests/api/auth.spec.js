const { test, expect } = require('@playwright/test');
const api = require('../utils/apiClient');

let token;
let bookingId;

test('Create auth token', async () => {
    const response = await api.post('/auth', {
      username: 'admin',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();

    token = response.data.token;
  });
