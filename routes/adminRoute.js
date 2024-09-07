const express = require("express");
const UrlModel = require("../models/url");

const router = express.Router();


router.get("/", async (req,res)=>{
    const entries = await UrlModel.find({});

    console.log(entries);

    return res.render('home', {
        adminUser: req.user,
        entries:entries
    })
});
router.get("/deleteOldUrl", async (req,res)=>{

    try {
        // Calculate the date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Delete URLs older than 7 days
        const result = await UrlModel.deleteMany({ createdAt: { $lt: sevenDaysAgo } });

        res.status(200).json({
            message: "Old URLs deleted successfully",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("Error deleting old URLs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }


});

module.exports = router;