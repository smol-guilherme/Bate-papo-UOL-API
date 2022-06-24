import { MongoClient } from "mongodb";
import dayjs from "dayjs";
import 'dotenv/config';

const URL = process.env.MONGO_URL;
const PORT = process.env.MONGO_PORT;
const MESSAGE_COLLECTION = process.env.MONGO_DATA_COLLECTION;
const USER_COLLECTION = process.env.MONGO_USERS_COLLECTION;
const A_MILLISECOND = 1000;

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
        await insertSystemMessage(data, true);
        return true;
    }
    return false;
}

async function insertSystemMessage(data, flag) {
    const timeFromFlag = flag ? dayjs(data.lastStatus).format("HH:mm:ss") : dayjs().format("HH:mm:ss");
    const message = {
        from: data.name,
        to: "Todos",
        text: flag ? 'entra na sala...' : 'sai da sala...',
        type: "status",
        time: timeFromFlag
    }
    await uolDb.collection(MESSAGE_COLLECTION).insertOne(message);
}

async function getUser(user) {
    const response = await uolDb.collection(USER_COLLECTION).findOne({ name: user.name });
    return response;
}

function timeNowMinusTen() {
    return (Date.now() - 10*A_MILLISECOND);
}

async function updateStatus(user) {
    try {
        await uolDb.collection(USER_COLLECTION).updateOne({ name: user.name }, { $set: { lastStatus: Date.now() } });
        return;
    } catch(err) {
        return err;
    }
}

async function checkForInactives() {
    const usersList = await uolDb.collection(USER_COLLECTION).find({ lastStatus: { $lt: timeNowMinusTen() }}).toArray();
    await usersList.map((user) => {
        uolDb.collection(USER_COLLECTION).deleteOne({ name: user.name });
        insertSystemMessage(user, false);
    })
    return;
}

const actions = {
    checkForInactives,
    insertMessage,
    insertUser,
    updateStatus,
    getUser
}
export default actions;