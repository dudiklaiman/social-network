import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import initRoutes from './routes/configRoutes.js'
import './db/mongoConnect.js';


const corsConfig = {
    origin: ["https://dudisocial.netlify.app", "http://localhost:5173"], // check this
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}

/* CONFIGURATIONS */
const app = express();
const httpServer = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors(corsConfig));
app.use(fileUpload({ limits: { fileSize: 1024 * 1024 * 10 }, useTempFiles: true }))
app.use(express.static(path.join(__dirname, "public")))

initRoutes(app);

const port = process.env.PORT || 3001;
httpServer.listen(port);
