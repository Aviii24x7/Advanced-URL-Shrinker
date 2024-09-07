// We will use nanoid module to generate short url
const shortid = require("shortid")
const UrlModel = require("../models/url")
const useragent = require('express-useragent');
const { render } = require("ejs");



async function handleGenerateNewShortUrl(req, res){
    const body = req.body
    console.log(body.shortid);
    let shortId = shortid();

    
    if(!body.url) {return res.status(400).render('home', { error: "'url' is required!!!"})}
        
    if(body.shortid){
      const entry = await UrlModel.findOne({ shortId: body.shortid });
      console.log(entry);
      if(entry){
        console.log("this")
          return res.status(400).render('home', { error: "'short_id' Already Exists! Try some other id!!!"})
        }
      else{
        console.log("else mei aagya")
          shortId = body.shortid;
        }
      }


    await UrlModel.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id
    });

    const entries = await UrlModel.find({createdBy: req.user._id});
    // res.status(500).json({id: shortId, entries : entries});

    return res.render('home', {id: shortId, entries : entries})
};


async function handleURLAnalytics(req,res){
    const shortId = req.params.shortId;
    const entry = await UrlModel.findOne({shortId});
    return res.render('home',{ 
        "total Clicks": entry.visitHistory.length, 
        "unique Visitors":  new Set(entry.visitHistory.map(visit => visit.ip)).size,
        "device Type Count" : entry.visitHistory.reduce((acc, visit) => {
            acc[visit.deviceType] = (acc[visit.deviceType] || 0) + 1;
            return acc;
          }, {}),
        analytics: entry.visitHistory})
};


async function handleRedirection(req,res){
    const shortId = req.params.shortId;

    const entry = await UrlModel.findOneAndUpdate(
        { shortId } , { $push : {  visitHistory : {
                timestamp: Date.now(),
                userAgent: req.useragent.source || "Unknown",
                deviceType: req.useragent.isMobile ? 'mobile' : req.useragent.isTablet ? 'tablet' : 'desktop',
                ip:  req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown', 
            
            }, }, } );

        res.redirect(302, entry.redirectURL);
};

// async function handleAnalysisOfURL(req, res) {

//   try {
// // url to analyse
//     const entry = await UrlModel.findOne({ shortId: req.params.shortId });
    
//     if (!entry) {
//       return res.render('analysis', { message: 'Shortened URL not found' });
//     }

//     // Total Number of Visits
//     const totalVisits = entry.visitHistory.length;

//     // Number of Unique Visitors (by IP)
//     const uniqueVisitors = new Set(entry.visitHistory.map(visit => visit.ip)).size;

//     // Visits by Device Type
//     const deviceTypeCount = entry.visitHistory.reduce((acc, visit) => {
//       acc[visit.deviceType] = (acc[visit.deviceType] || 0) + 1;
//       return acc;
//     }, {});



//     // Time Series Data (grouped by day)
//     const dailyVisit = entry.visitHistory.reduce((acc, visit) => {
//       const day = new Date(visit.timestamp).toISOString().split('T')[0]; // Group by day
//       acc[day] = (acc[day] || 0) + 1;
//       return acc;
//     }, {});


//     // Prepare and send analytics data
//     const analyticsData = {
//       shortid: req.params.shortId,
//       totalVisits: totalVisits,
//       uniqueVisitors: uniqueVisitors,
//       deviceTypeCount: deviceTypeCount,
//       dailyVisit: dailyVisit,
//       redirectURL: entry.redirectURL
//     };
//     console.log("hiiii",analyticsData["deviceTypeCount"])
//     res.render('analysis', analyticsData);

//   } catch (error) {
//     console.error('Error fetching analytics:', error);
//     res.render('analysis', { message: 'Internal server error' });
//   }
// }

// setting up redis
// to use this also keep server open
const redis = require('redis');
const client = redis.createClient();

let useRedis = false;

client.on('error', (err) => {
  console.error('Redis Error:', err);
  useRedis = false;

});

if(useRedis){
  client.connect();
}

async function handleAnalysisOfURL(req, res) {
  try {
    const shortId = req.params.shortId;

    // Cahcing
    if(useRedis){
      const cachedData = await client.get(`url_analysis_${shortId}`);
  
      if (cachedData) {
        console.log('Serving from Redis Cache');
        return res.render('analysis', JSON.parse(cachedData));
      }

    }

   const entry = await UrlModel.findOne({ shortId: shortId });

    if (!entry) {
      return res.render('analysis', { message: 'Shortened URL not found' });
    }

    const totalVisits = entry.visitHistory.length;

    const uniqueVisitors = new Set(entry.visitHistory.map((visit) => visit.ip)).size;

    const deviceTypeCount = entry.visitHistory.reduce((acc, visit) => {
      acc[visit.deviceType] = (acc[visit.deviceType] || 0) + 1;
      return acc;
    }, {});

    const dailyVisit = entry.visitHistory.reduce((acc, visit) => {
      const day = new Date(visit.timestamp).toISOString().split('T')[0]; // Group by day
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const analyticsData = {
      shortid: shortId,
      totalVisits: totalVisits,
      uniqueVisitors: uniqueVisitors,
      deviceTypeCount: deviceTypeCount,
      dailyVisit: dailyVisit,
      redirectURL: entry.redirectURL,
    };

    if(useRedis){
      await client.setEx(`url_analysis_${shortId}`, 3600, JSON.stringify(analyticsData));

    }

    console.log('Serving from MongoDB and caching result if Redis server is on!');
    // res.status(500).json(analyticsData);

    res.render('analysis', analyticsData);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.render('analysis', { message: 'Internal server error' });
  }
}

module.exports = handleAnalysisOfURL;

    
module.exports = {
    handleGenerateNewShortUrl,
    handleURLAnalytics,
    handleRedirection,
    handleAnalysisOfURL
}



