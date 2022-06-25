import { MongoClient, ObjectId } from "mongodb";
import scripts from "../controllers/scripts.js";
import dayjs from "dayjs";
import 'dotenv/config';

const URL = process.env.MONGO_URL;
const PORT = process.env.MONGO_PORT;
const MESSAGE_COLLECTION = process.env.MONGO_DATA_COLLECTION;
const USER_COLLECTION = process.env.MONGO_USERS_COLLECTION;

const client = new MongoClient(`${URL}:${PORT}`);

async function connectToDb() {
    try {
        await client.connect();
        return client.db("UOL_API_DB");
    }
    catch (err) {
        return err;
    }
}

async function updateMessage(id, data) {
    try {
        const db = await connectToDb();
        const { addTimeStamp } = scripts;
        const message = addTimeStamp(data);
        await db.collection(MESSAGE_COLLECTION).updateOne({ _id: ObjectId(id) },
                                                          { $set: 
                                                                {
                                                                    to: message.to,
                                                                    text: message.text,
                                                                    type: message.type,
                                                                    time: message.time
                                                                }});
        return;
    } catch(err) {
        return err;
    }
}

async function deleteMessage(id) {
    try {
        const db = await connectToDb();
        const response = await db.collection(MESSAGE_COLLECTION).deleteOne({ _id: ObjectId(id) })
        console.log(response);
        client.close();
        return;
    } catch (err) {
        client.close();
        return err;
    }
}

async function insertMessage(data, sender) {
    try {
        const db = await connectToDb();
        const { addTimeStamp } = scripts;
        const { sanitizeData } = scripts;
        const cleanData = sanitizeData(data);
        const cleanSender = sanitizeData(sender)
        const fullMessage = { from: cleanSender.name, ...addTimeStamp(cleanData) };
        await db.collection(MESSAGE_COLLECTION).insertOne(fullMessage);
        client.close();
        return;
    }
    catch (err) {
        return err;
    }
}

async function insertUser(user) {
    try {
        if(await getUsers(user) === null) {
            const { sanitizeData } = scripts;
            const db = await connectToDb();
            const data = { ...sanitizeData(user), lastStatus: Date.now() };
            await db.collection(USER_COLLECTION).insertOne(data);
            await insertSystemMessage(data, true);
            return true;
        }
        return false;
    }
    catch (err) {
        console.log(err)
        client.close();
        return err;
    }
}

async function insertSystemMessage(data, flag) {
    try {
        const db = await connectToDb();
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
    catch (err) {
        client.close();
        return err;
    }
}

async function getOriginalMessage(id) {
    try {
        const db = await connectToDb();
        const message = await db.collection(MESSAGE_COLLECTION).findOne({ _id: ObjectId(id) })
        client.close();
        return message;
    } catch (err) {
        client.close();
        return err;
    }
}

async function getMessages(user, limit = undefined) {
    try {
        const msgLim = parseInt(limit);
        const db = await connectToDb();
        const messages = await db.collection(MESSAGE_COLLECTION)
                                 .find({ $or: [
                                        { to: user.name },
                                        { to: "Todos" },
                                        { from: user.name }
                                 ]})
                                 .hint({ $natural: -1 })
                                 .limit(msgLim)
                                 .toArray();
        const response = messages.reverse();
        client.close();
        return response;
    }
    catch (err) {
        client.close();
        return err;
    }
}

async function getUsers(user = undefined) {
    try {
        const db = await connectToDb();
        if(user === undefined) {
            const response = await db.collection(USER_COLLECTION).find({}).toArray();
            client.close();
            return response;
        }
        const response = await db.collection(USER_COLLECTION).findOne({ name: user.name });
        client.close();
        return response;
    }
    catch (err) {
        return err;
    }
}

async function updateStatus(user) {
    try {
        const db = await connectToDb();
        await db.collection(USER_COLLECTION).updateOne({ name: user.name }, { $set: { lastStatus: Date.now() } });
        client.close();
        return;
    } catch(err) {
        client.close();
        return err;
    }
}

async function checkForInactives() {
    try {
        const { timeNowMinusTen } = scripts;
        const db = await connectToDb();
        const usersList = await db.collection(USER_COLLECTION).find({ lastStatus: { $lt: timeNowMinusTen() }}).toArray();
        usersList.map(async(user) => {
            await db.collection(USER_COLLECTION).deleteOne({ name: user.name });
            client.close();
            insertSystemMessage(user, false);
        })
        return;
    }
    catch (err) {
        client.close();
        return err;
    }
}

const actions = {
    getOriginalMessage,
    checkForInactives,
    updateMessage,
    deleteMessage,
    updateStatus,
    insertMessage,
    getMessages,
    insertUser,
    getUsers
}
export default actions;