import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
// import bodyParser from 'body-parser';
// import multer from 'multer';
// import helmet from "helmet";
// import morgan from "morgan";
import { fileURLToPath } from 'url';
import  initRoutes  from './routes/configRoutes.js'
import './db/mongoConnect.js';

const app = express();

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload({ limits: { fileSize: 1024 * 1024 * 10 }, useTempFiles: true }))
app.use(express.static(path.join(__dirname, "public")))
// app.use(helmet());
// app.use(morgan('common'));
// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
// app.use(bodyParser.json({ limit: '30mb', extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "public/assets");
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
// });
// const upload = multer({ storage });

// /* ROUTES WITH FILES */
// app.post("/auth/register", upload.single("picture"), register);
// app.post("/posts", verifyToken, upload.single("picture"), createPost);


initRoutes(app);

const server = http.createServer(app);
const port = process.env.PORT || 3001;
server.listen(port);
