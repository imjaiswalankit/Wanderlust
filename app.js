if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");  // like hum jo hcizz likhe woo same template same jaise rahe jha jha use akre hum. eg- wanderlust likha hua har jhg likha rahe
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");  // signup form

const { date } = require("joi");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");  // create model 


const dbUrl = process.env.ATLASDB_URL;


main().then(()=>{
    console.log(`Connect with DB`);
}).catch((err)=>{
    console.log(err);
})

async function main(params) {
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); // static public fille ko access

// app.js mein yeh add karo
app.locals.mapToken = process.env.MAP_TOKEN;


const store = MongoStore.create({
   mongoUrl: dbUrl,
   crypto: {
        secret: process.env.SECRET,
   },
   touchAfter: 24 * 3600,
});

store.on("error",() =>{
   console.log("Error In MONGO SSESSION STORE", err);
});

// Sessison Option

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:  7*24*60*60*1000,
        httpOnly: true,
    }
};

// Middleware
app.use(session(sessionOptions));
app.use(flash());    // models par popup masg alert


// Passport Middleware -> for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Root Route
// app.get("/",(req,res)=>{
//     res.send(`Hii, im root`);
// })

app.use((req, res, next)=>{
     res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user;  // signup,login, logout k liy make

    next();
})

app.use("/listings/",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);


app.all("*splat",(req, res, next)=>{
    next(new ExpressError(`Page not found`,400));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message, err});
    // res.render("error.ejs", { message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is litning to port ${PORT}`);
});
