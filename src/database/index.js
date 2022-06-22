import { MongoClient } from "mongodb";
import 'dotenv/config';

const URL = process.env.MONGO_URL;
const PORT = process.env.MONGO_PORT;
const MESSAGE_COLLECTION = process.env.MONGO_DATA_COLLECTION;
console.log(`${URL}:${PORT}`)
const client = new MongoClient(`${URL}:${PORT}`);
let uolDb;

client.connect().then(() => { uolDb = client.db("UOL_API_DB")});

function insertMessage(data) {
    uolDb.collection(MESSAGE_COLLECTION).insertOne(data);
}

const actions = {
    insertMessage
}

export default actions;