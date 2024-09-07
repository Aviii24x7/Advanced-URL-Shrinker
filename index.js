const express = require("express")
const path = require("path")
const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const adminRoute = require('./routes/adminRoute')
const cookieParser = require('cookie-parser')
const {connectToMongoDb} = require('./connect-db')
const {checkForAuthentication, restrictTo} = require('./middlewares/auth')
const useragent = require('express-useragent');
const app = express();
const PORT = 3000;

connectToMongoDb('mongodb://localhost:27017/short-url')
.then(console.log("MongoDb Connected!"))
.catch(err=>console.log("!!! Mongo Db Not Connected !!!", err))

// defineing view engine to the express
app.set("view engine","ejs");
// assigning the path of views ejs files
app.set('views', path.resolve("./views") )
// for ip
app.set('trust proxy', true)

// middleware to always run
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(useragent.express());
app.use(cookieParser());
app.use(checkForAuthentication);


// middleware: restrictToLoggedInUserOnly
// app.use('/url', restrictToLoggedInUserOnly,  urlRoute);
app.use('/url', restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use('/user', userRoute);
app.use('/', staticRoute);
app.use('/admin', restrictTo(['ADMIN']),  adminRoute);





app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`))
