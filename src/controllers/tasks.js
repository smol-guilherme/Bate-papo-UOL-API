import { Router } from "express";
import scripts from "./scripts.js";
import uolDb from "../database/index.js";

const router = Router();
let db = uolDb;


// DEV
router.get('/health', (req, res) => {
    res.send('OK');
});
// DEV

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