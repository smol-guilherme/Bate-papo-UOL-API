import { MongoClient } from "mongodb";
import scripts from "../controllers/scripts.js";
import dayjs from "dayjs";
import 'dotenv/config';

const URL = process.env.MONGO_URL;
const PORT = process.env.MONGO_PORT;
const MESSAGE_COLLECTION = process.env.MONGO_DATA_COLLECTION;
const USER_COLLECTION = process.env.MONGO_USERS_COLLECTION;
const A_MILLISECOND = 1000;

const client = new MongoClient(`${URL}:${PORT}`);

async function insertMessage(data, sender) {
    const db = await connectToDb()
    const { addTimeStamp } = scripts;
    const fullMessage = { from:sender.name, ...addTimeStamp(data) };
    console.log(fullMessage)
    await db.collection(MESSAGE_COLLECTION).insertOne(fullMessage);
    client.close();
    return;
}

async function connectToDb() {
    await client.connect();
    return client.db("UOL_API_DB");
}

async function insertUser(user) {
    if(await getUsers(user) === null) {
        const db = await connectToDb();
        const data = {...user, lastStatus: Date.now()};
        await db.collection(USER_COLLECTION).insertOne(data);
        await insertSystemMessage(data, true);
        return true;
    }
    return false;
}

async function insertSystemMessage(data, flag) {
    const db = await connectToDb()
    const timeFromFlag = flag ? dayjs(data.lastStatus).format("HH:mm:ss") : dayjs().format("HH:mm:ss");
    const message = {
        to: "Todos",
        from: data.name,
        text: flag ? 'entra na sala...' : 'sai da sala...',
        type: "status",
        time: timeFromFlag
    }
    await db.collection(MESSAGE_COLLECTION).insertOne(message);
    client.close();
    return;
}

async function getMessages(user, limit) {
    const db = await connectToDb()
    const { fillArrayUpToLimit } = scripts;
    const messages = await db.collection(MESSAGE_COLLECTION).find({ $or: [{ to: user.name }, { to: "Todos" }] }).toArray();
    client.close();
    const chatMessages = fillArrayUpToLimit(messages, limit);
    return chatMessages;
}

async function getUsers(user = undefined) {
    const db = await connectToDb()
    if(user === undefined) {
        const response = await db.collection(USER_COLLECTION).find({}).toArray();
        client.close();
        return response;
    }
    const response = await db.collection(USER_COLLECTION).findOne({ name: user.name });
    client.close();
    return response;
}

function timeNowMinusTen() {
    return (Date.now() - 10*A_MILLISECOND);
}

async function updateStatus(user) {
    const db = await connectToDb();
    try {
        await db.collection(USER_COLLECTION).updateOne({ name: user.name }, { $set: { lastStatus: Date.now() } });
        client.close();
        return;
    } catch(err) {
        client.close();
        return err;
    }
}

async function checkForInactives() {
    const db = await connectToDb()
    const usersList = await db.collection(USER_COLLECTION).find({ lastStatus: { $lt: timeNowMinusTen() }}).toArray();
    usersList.map(async(user) => {
        await db.collection(USER_COLLECTION).deleteOne({ name: user.name });
        client.close();
        insertSystemMessage(user, false);
    })
    return;
}

const actions = {
    checkForInactives,
    updateStatus,
    insertMessage,
    getMessages,
    insertUser,
    getUsers
}
export default actions;