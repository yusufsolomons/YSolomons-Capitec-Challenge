const api = require('../utils/apiClient');


const { test, expect } = require('@playwright/test');

let token;
let bookingId;

test.beforeAll(async () => {
  const authRes = await api.post('/auth', {
    username: 'admin',
    password: 'password123'
  });
  token = authRes.data.token;

  const createRes = await api.post('/booking', {
    firstname: 'Delete',
    lastname: 'Test',
    totalprice: 123,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-10'
    }
  });
  bookingId = createRes.data.bookingid;
});

test('Delete booking', async () => {
  const res = await api.delete(`/booking/${bookingId}`, {
    headers: {
      Cookie: `token=${token}`
    }
  });
  expect(res.status).toBe(201);
});
