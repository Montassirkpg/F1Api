const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/user');

router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ email, password, role });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.json({ email: user.email });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.put('/:user_id', auth, async (req, res) => {
    // Only admins can update user data
    if (req.user.role !== 0) {
        return res.status(403).json({ msg: 'Permission denied' });
    }
 
    res.send('Update user');
});


router.patch('/:user_id', auth, async (req, res) => {
    
    if (req.user.role !== 0) {
        return res.status(403).json({ msg: 'Permission denied' });
    }
    
    res.send('Patch user');
});


router.delete('/:user_id', auth, async (req, res) => {
   
    if (req.user.role !== 0) {
        return res.status(403).json({ msg: 'Permission denied' });
    }

    res.send('Delete user');
});

module.exports = router;
