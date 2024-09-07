const express = require("express");
const UrlModel = require("../models/url");
const { restrictTo } = require("../middlewares/auth");
const router = express.Router();

router.get('/', restrictTo(["NORMAL", "ADMIN"]), async (req,res)=>{
    const entries = await UrlModel.find({createdBy: req.user._id});

    return res.render('home', {
        entries:entries
    })
});



router.get('/sign-up', (req, res)=> {
    return res.render("signup");
});

router.get('/login', (req, res)=> {
    return res.render("login");
});


module.exports= router;