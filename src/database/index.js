import { MongoClient } from "mongodb";
import dayjs from "dayjs";
import 'dotenv/config';

const URL = process.env.MONGO_URL;
const PORT = process.env.MONGO_PORT;
const MESSAGE_COLLECTION = process.env.MONGO_DATA_COLLECTION;
const USER_COLLECTION = process.env.MONGO_USERS_COLLECTION;
const client = new MongoClient(`${URL}:${PORT}`);
let uolDb;

client.connect().then(() => { uolDb = client.db("UOL_API_DB")});

function insertMessage(data) {
    uolDb.collection(MESSAGE_COLLECTION).insertOne(data);
}

async function insertUser(user) {
    if(await getUser(user) === null) {
        const data = {...user, lastStatus: Date.now()};
        await uolDb.collection(USER_COLLECTION).insertOne(data);
        await insertWelcomeMessage(data);
        return true;
    }
    return false;
}

async function insertWelcomeMessage(data) {
    const message = {
        from: data.name,
        to: "Todos",
        text: "entra na sala...",
        type: "status",
        time: dayjs(data.lastStatus).format("HH:mm:ss")
    }
    await uolDb.collection(MESSAGE_COLLECTION).insertOne(message);
}

async function getUser(user) {
    const response = await uolDb.collection(USER_COLLECTION).findOne({name: user.name});
    return response;
}

const actions = {
    insertMessage,
    insertUser,
    getUser
}
export default actions;