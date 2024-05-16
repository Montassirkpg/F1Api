const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Timer = require('../models/timer');


router.post('/:user_id/timer', auth, async (req, res) => {
    const { time } = req.body;
    try {
        const newTimer = new Timer({ user_id: req.user.id, time });
        const timer = await newTimer.save();
        res.json(timer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/:user_id/timer', auth, async (req, res) => {
    try {
        const timers = await Timer.find({ user_id: req.user.id });
        res.json(timers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/:user_id/timer/avg', auth, async (req, res) => {
    try {
        const timers = await Timer.find({ user_id: req.user.id });
        const avgTime = timers.reduce((acc, timer) => acc + timer.time, 0) / timers.length;
        res.json({ average_time: avgTime });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
