import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
// import { Server } from "socket.io";
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import  initRoutes  from './routes/configRoutes.js'
import './db/mongoConnect.js';

const corsConfig = {
    origin: ["https://dudisocial.netlify.app", "http://localhost:5173"],
}

const app = express();
const httpServer = http.createServer(app);
// const io = new Server(httpServer, { cors: corsConfig });


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(cors(corsConfig));
app.use(fileUpload({ limits: { fileSize: 1024 * 1024 * 10 }, useTempFiles: true }))
app.use(express.static(path.join(__dirname, "public")))


// // Socket.io setup
// io.on('connection', (socket) => {
//     console.log('A user connected');
    
//     // Handle incoming messages
//     socket.on('message', async (data) => {
//         // Save the message to the database
//         // You need to implement this part based on your requirements
//         // For simplicity, let's assume you have a function in chatController
//         // named saveMessage that saves the message to the database
//         try {
//             // await chatController.saveMessage(data);
//             // Broadcast the message to all connected clients
//             io.emit('message', data);
//             console.log(data);
//         } catch (error) {
//             console.error('Error saving message:', error.message);
//         }
//     });
    
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });


initRoutes(app);

const port = process.env.PORT || 3001;
httpServer.listen(port);

// export default httpServer