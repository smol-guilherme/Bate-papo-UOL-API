import { MongoClient } from "mongodb";
import 'dotenv/config';

const URL = process.env.MONGO_URL;
const PORT = process.env.MONGO_PORT;
const client = new MongoClient(`${URL}:${PORT}`);
let uolDb;

client.connect().then(() => { uolDb = client.db("UOL_API_DB") });

export default uolDb;