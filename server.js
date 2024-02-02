const app = require('./app.js');
const http = require('http');
const dotenv = require('dotenv').config();
const connectDB = require('./connectDB/connectDB.js');
const { Server } = require('socket.io');
const {ioHandler} = require('./sockets/io.js');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});


connectDB()
    .then(() => {
        ioHandler(io);
        io.listen(server);
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`DB Connection Error: ${error.message}`);
        process.exit(1);
    });
