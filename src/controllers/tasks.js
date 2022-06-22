import { Router } from "express";
import scripts from "./scripts.js";
import uolDb from "../database/index.js";
import validateMessage from "../models/message.js";
import 'dotenv/config';

const router = Router();
let db = uolDb;
const MESSAGE_COLLECTION = process.env.MONGO_DATA_COLLECTION;

// DEV
router.get('/health', (req, res) => {
    res.send('OK');
});
// DEV

router.post('/messages', (req, res) => {
    const messageContent = req.body;
    const messageHeader = req.header('User');
    if(validateMessage(messageContent)) {
        db.collection(MESSAGE_COLLECTION).insertOne({})
        res.status(201).send();
        return;
    }
    res.status(422).send("Erro no formato da mensagem");
})

router.get('/participants', (req, res) => {
    const { participants } = scripts
    res.status(200).send(participants);
});

router.get('/messages', (req, res) => {
    const limit = req.query.limit;
    const user = req.header('User');
    const { fillArrayUpToLimit } = scripts
    const messageList = fillArrayUpToLimit(limit, user);
    res.status(200).send(messageList);
});


export default router;