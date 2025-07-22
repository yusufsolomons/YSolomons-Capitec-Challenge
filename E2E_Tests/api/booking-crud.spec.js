const { test, expect } = require('@playwright/test');
const api = require('../utils/apiClient');


let bookingId;

test('Create booking', async () => {
  const res = await api.post('/booking', {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2023-01-01',
      checkout: '2023-01-10'
    },
    additionalneeds: 'Breakfast'
  });
  expect(res.status).toBe(200);
  bookingId = res.data.bookingid;
});
