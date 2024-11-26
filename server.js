
// require('dotenv').config();
// const cluster = require('cluster');
// const http = require('http');
// const app = require('./src/app');
// const { PORT } = process.env;
// const numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
//     console.log(`Master ${process.pid} is running`);

//     // Fork workers
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }

//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`Worker ${worker.process.pid} died`);
//     });
// } else {
//     const server = http.createServer(app);
    
//     server.listen(PORT, () => {
//         console.log(`Worker ${process.pid} started on port ${PORT}`);
//     });

//     process.on('SIGINT', () => {
//         server.close(() => console.log(`Worker ${process.pid} exited`));
//     });
// }


require('dotenv').config();
const app = require('./src/app')
const {PORT} = process.env;

const server = app.listen( PORT, () => {
    console.log(`WSV start with port ${PORT}`);
})

process.on('SIGINT', () => {
    server.close( () => console.log(`exits server express`))
})


// autocannon -c 100 -d 10 -p 10 -H "Content-Type: application/json" -b @login-data.json http://localhost:3001/api/v1/users/login
// autocannon -c 500 -d 30 -p 20 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmVkODZhNGI4YTg3ZmRlMDE0M2RmMzEiLCJyb2xlIjoidXNlciIsImlhdCI6MTcyNzAyMzMzOCwiZXhwIjoxNzI3MDI0MjM4fQ.go5xUdrZximYhxyLR1TW5JrWV2jziC-YsL2Cefa67F4" http://localhost:3001/api/v1/products
