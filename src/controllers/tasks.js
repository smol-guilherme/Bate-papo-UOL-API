import { Router } from "express";
const router = Router();

router.get('/health', (req, res) => {
    res.send('OK');
});

router.get('/', (req, res) => {
    res.send('rota /')
});

export default router;