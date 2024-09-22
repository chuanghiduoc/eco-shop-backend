import http from 'k6/http';
import { sleep } from 'k6';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmVkODZhNGI4YTg3ZmRlMDE0M2RmMzEiLCJyb2xlIjoidXNlciIsImlhdCI6MTcyNjkxMTA1MCwiZXhwIjoxNzI2OTExOTUwfQ.V4YNitZX_8rLMY6oia9fcCwq7oFs_zmB07MYCdqMuu4';

export let options = {
  stages: [
    { duration: '30s', target: 10000 },
    { duration: '1m', target: 10000 },  
    { duration: '10s', target: 0 },       
  ],
};

export default function () {
  const createProductResponse = http.post('http://localhost:3001/api/v1/products/addProduct', JSON.stringify({
    name: 'Test Product',
    price: 100,
    discount: '603c9e06a943e03b9cf16507'
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log(`Create Product Response: ${createProductResponse.status}`);

  const getAllProductsResponse = http.get('http://localhost:3001/api/v1/products', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log(`Get All Products Response: ${getAllProductsResponse.status}`);

  sleep(1); // Sleep for 1 second between iterations
}
