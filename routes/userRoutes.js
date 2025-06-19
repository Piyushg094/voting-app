const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');

const { generateToken, jwtAuthMiddleware } = require('../jwt')


router.post('/signup', async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user with hashed password
        const newUser = new User({ ...rest, password: hashedPassword });
        // Save the new user to the database
        let response = await newUser.save();
        console.log('data Saved');
        const payload = {
            id: response.id
        };
        response = response.toObject()
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log('Token is :', { token: token });
        delete response.password
        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'aadharCardNumber and password are required' });
        }
        const user = await User.findOne({ aadharCardNumber });
        if (!user) {
            return res.status(401).json({ error: 'Invalid aadharCardNumber or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const payload = { id: user.id };
        const token = generateToken(payload);
        res.status(200).json({ response:{message : 'user login succesfully '}, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/profile', jwtAuthMiddleware, async (req, res)=>{
    try{
        const userData = req.user;

        const userId = userData.id;
        const user = await User.findById(userId);
        const response = user.toObject();
        delete response.password
        res.status(200).json({response});
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal server error'});

    }
});

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        console.log('coming')
        const userId = req.user.id;

        const { currentPassword, newPassword } = req.body;
        // find the user by userID
        const user = await User.findById(userId);
        // if currentPass is equal to my db pass
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid currentPassword' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({response: 'password has been updated'})
        // (rest of your logic here)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;