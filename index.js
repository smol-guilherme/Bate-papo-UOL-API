import express, { json } from "express";
import cors from "cors";
import router from "./src/controllers/tasks.js";

const app = express();
app.use(cors());
app.use(json());
app.use('/', router);

app.listen(5000, () => { console.log(`Systems up and running @${Date().toString()}`) });