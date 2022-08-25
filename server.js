import * as dotenv from "dotenv";
dotenv.config();
import express from "express"
import path from "path"
import { fileURLToPath } from "url";
import {Server} from "socket.io"; 
import cors from "cors";
import allRoutes from "./routes/allRoutes.js"

const app = express();  

const PORT = 8020 || process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 

app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));
 
app.set('views', path.join(__dirname, '/public/views'));
app.set("view engine", "ejs");

app.use("/",allRoutes);
const server = app.listen(PORT, (req, res) => {
    console.log("App is running at " + PORT);    
})

const io = new Server(server);

io.on("connection", (socket) => {
    socket.on("sender-join", (data) => {
        socket.join(data.uid);
    });     
    socket.on("receiver-join", (data) => {
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init", data.uid);
    });
    socket.on("file-meta", (data) => {
        socket.in(data.uid).emit("fs-meta", data.metadata);
    });
    socket.on("fs-start", (data) => {
        socket.in(data.uid).emit("fs-share", {});
    });
    socket.on("file-raw", (data) => {
        socket.in(data.uid).emit("fs-share", data.buffer);
    });
})