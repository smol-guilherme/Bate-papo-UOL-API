import { Router } from "express";
import scripts from "./scripts.js";
import actions from "../database/index.js";
import validateMessage from "../models/message.js";
import validateUser from "../models/user.js"
import 'dotenv/config';

const router = Router();

// DEV
router.get('/health', (req, res) => {
    res.send('OK');
});
// DEV

router.post('/participants', async(req, res) => {
    const { insertUser } = actions;
    const user = req.body;
    if(!(await validateUser(user))) {
        res.status(422).send();
        return;
    }
    if(insertUser(user)) {
        res.status(201).send();
        return;
    }
    res.status(409).send();
    return;
})

router.post('/messages', async(req, res) => {
    const messageContent = req.body;
    const messageHeader = req.header('User').toString('utf-8');
    if(await validateMessage(messageContent)) {
        const { addTimeStamp } = scripts;
        const { insertMessage } = actions;
        const fullMessage = addTimeStamp(messageContent);

        fullMessage.from = messageHeader;

        insertMessage(fullMessage);

        res.status(201).send();
        return;
    }
    res.status(422).send("Erro no formato da mensagem");
});

router.get('/participants', (req, res) => {
    const { participants } = scripts
    res.status(200).send(participants);
});

router.get('/messages', (req, res) => {
    const limit = req.query.limit;
    const user = req.header('User');
    const { fillArrayUpToLimit } = scripts;
    const messageList = fillArrayUpToLimit(limit, user);
    res.status(200).send(messageList);
});


export default router;