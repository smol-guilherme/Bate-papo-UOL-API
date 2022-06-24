import { Router } from "express";
import scripts from "./scripts.js";
import actions from "../database/index.js";
import validateMessage from "../models/message.js";
import validateUser from "../models/user.js"
import 'dotenv/config';

const router = Router();
const { checkForInactives, updateStatus } = actions;
const A_SECOND = 1000;
const pId = setInterval(checkForInactives, 15*A_SECOND); 
const alwaysOnlineAdemir = setInterval(() => updateStatus({ name: "Ademir" }), 9*A_SECOND);

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
    if(await insertUser(user)) {
        res.status(201).send();
        return;
    }
    res.status(409).send();
    return;
})

router.post('/messages', async(req, res) => {
    const messageContent = req.body;
    const targetUser = { name: req.header('user').toString('utf-8') }
    const { getUser } = actions;
    if(!(await validateUser(targetUser))) {
        console.log('entered validate...')
        res.status(422).send("Formato de usuário inválido");
        return;
    }
    if(await getUser(targetUser) === null) {
        console.log('entered get...')
        res.status(422).send("Usuário não encontrado");
        return;
    }
    if(await validateMessage(messageContent)) {
        const { addTimeStamp } = scripts;
        const { insertMessage } = actions;
        const fullMessage = addTimeStamp(messageContent);
        fullMessage.from = targetUser.name;
        insertMessage(fullMessage);
        res.status(201).send();
        return;
    }
    res.status(422).send("Erro no formato da mensagem");
    return;
});

router.post('/status', async(req, res) => {
    const { getUser } = actions;
    const user = { 
        name: req.header('user')
    };
    if(getUser(user) === null) {
        return res.status(404).send();
    }
    return res.status(200).send();
});

router.get('/participants', (req, res) => {
    const { participants } = scripts
    res.status(200).send(participants);
});

router.get('/messages', (req, res) => {
    const limit = req.query.limit;
    const user = req.header('user');
    const { fillArrayUpToLimit } = scripts;
    const messageList = fillArrayUpToLimit(limit, user);
    res.status(200).send(messageList);
});


export default router;