import { Router } from "express";
import actions from "../database/index.js";
import validateMessage from "../models/message.js";
import validateUser from "../models/user.js"
import 'dotenv/config';

const router = Router();
const { checkForInactives } = actions;
const A_SECOND = 1000;
const pId = setInterval(checkForInactives, 15*A_SECOND);

router.post('/participants', async(req, res) => {
    const { insertUser } = actions;
    const user = req.body;
    user.name = user.name.trim();
    if(!(await validateUser(user))) {
        res.status(422).send();
        return;
    }
    const userName = await insertUser(user);
    if(userName !== false) {
        res.status(201).send(userName);
        return;
    }
    res.status(409).send();
    return;
})

router.post('/messages', async(req, res) => {
    const { getUsers } = actions;
    const messageContent = req.body;
    const originUser = { name: req.header('user').toString('utf-8') }
    if(!(await validateUser(originUser))) {
        res.status(422).send("Formato de usuário inválido");
        return;
    }
    if(await getUsers(originUser) === null) {
        res.status(422).send("Usuário não encontrado");
        return;
    }
    if(await validateMessage(messageContent)) {
        const { insertMessage } = actions;
        insertMessage(messageContent, originUser);
        res.status(201).send();
        return;
    }
    res.status(422).send("Erro no formato da mensagem");
    return;
});

router.post('/status', async(req, res) => {
    const { getUsers, updateStatus } = actions;
    const user = { name: req.header('user').toString('utf-8') };
    if(await getUsers(user) === null) {
        return res.status(404).send();
    }
    await updateStatus(user)
    return res.status(200).send();
});

router.get('/participants', async(req, res) => {
    const { getUsers } = actions;
    const userList = await getUsers();
    res.status(200).send(userList);
});

router.get('/messages', async(req, res) => {
    const { getMessages } = actions;
    const limit = req.query.limit;
    const user = { name: req.header('user').toString('utf-8') };
    const messagesList = await getMessages(user, limit);
    res.status(200).send(messagesList);
});

router.delete('/messages/:id', async(req,res) => {
    const { getOriginalMessage, deleteMessage } = actions;
    const messageId = req.params.id;
    const originUser = { name: req.header('user').toString('utf-8') };
    const original = await getOriginalMessage(messageId);
    if(original === null) {
        res.status(404).send("Mensagem não encontrada");
        return;
    }
    if(original.from !== originUser.name) {
        res.status(401).send();
        return;
    }
    deleteMessage(messageId);
    res.status(200).send();
    return;
})

router.put('/messages/:id', async(req, res) => {
    const { getOriginalMessage } = actions;
    const messageId = req.params.id;
    const messageContent = req.body;
    const originUser = { name: req.header('user').toString('utf-8') };
    const original = await getOriginalMessage(messageId);
    if(original === null) {
        res.status(404).send("Mensagem não encontrada");
        return;
    }
    if(original.from !== originUser.name) {
        res.status(401).send();
        return;
    }
    if(!(await validateUser(originUser))) {
        res.status(422).send("Formato de usuário inválido");
        return;
    }
    if(await validateMessage(messageContent)) {
        const { updateMessage } = actions;
        updateMessage(messageId, messageContent);
        res.status(201).send();
        return;
    }
})

export default router;