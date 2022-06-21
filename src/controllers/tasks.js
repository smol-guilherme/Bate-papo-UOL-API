import { Router } from "express";
import scripts from "./scripts.js";

const router = Router();

router.get('/health', (req, res) => {
    res.send('OK');
});

router.get('/participants', (req, res) => {
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