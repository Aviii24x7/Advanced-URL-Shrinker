const userModel = require('../models/user')
const {v4: uuidv4} = require('uuid')
const {setUser} = require('../services/auth')

async function handleUserSignUp(req, res){
    const {name, email, password} = req.body;
    await userModel.create({
        name, email, password
    });
    return res.render("home")
}

async function handleUserLogin(req, res){
    const {email, password} = req.body
    const user = await userModel.findOne({
        email:email,
        password: password
    });
    if(!user) res.render("login", {error: "Invalid Username or Password"});

// Stateful auth - using cookies
    // const sessionId = uuidv4();
    // setUser(sessionId, user);
    // res.cookie('uid', sessionId);

// Stateless auth - using JWT
    const token = setUser(user);
    res.cookie("token", token)
    return res.redirect('/');
}

module.exports = {handleUserSignUp, handleUserLogin};