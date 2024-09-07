const express = require("express");
const {handleGenerateNewShortUrl, handleURLAnalytics, handleRedirection, handleAnalysisOfURL} = require("../controllers/url");
const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

// localhost:8001/url
router.post("/", handleGenerateNewShortUrl);
router.get("/:shortId", handleRedirection);

// localhost:8001/url/analytics/ndwDfut10
router.get("/analyse/:shortId", handleAnalysisOfURL);

module.exports = router;