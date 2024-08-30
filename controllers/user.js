const user_model = require('../models/user');
const bcrypt = require('bcrypt');
const { setUser, getUser } = require("../service/auth");
const { checkAuth } = require('../middlewares/auth');

async function handleUserSignUp(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide proper inputs" });
    }
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await user_model.create({
            email,
            password: hashedPassword
        });

        const token = setUser(user);

        return res.status(200).json({ message: "User signed up successfully", "access-token": token });

    } catch (err) {
        return res.status(400).json({ error: `User already exists` });
    }
}

async function handUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await user_model.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "Invalid Username/Password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ error: "Invalid Username/Password" });
    }

    const token = setUser(user);

    return res.status(200).json({ message: "Login successful", "access-token": token });
}

module.exports = {
    handleUserSignUp,
    handUserLogin,
};