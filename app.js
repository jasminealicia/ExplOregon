var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    flash          = require("connect-flash"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"), //allows us to use PUT and DELETE
    Location       = require("./models/location"),
    Comment        = require("./models/comment"),
    User           = require("./models/user");

//requiring routes
var indexRoutes    = require("./routes/index"),
    locationRoutes = require("./routes/locations"),
    commentRoutes  = require("./routes/comments")

mongoose.connect("mongodb://localhost/exploregon");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); //let's us use the stylesheets in the public dir
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION (AUTHORIZATION)
app.use(require("express-session")({
    secret: "Todd and Trist are cute",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//CURRENT USER 
app.use(function(req, res, next) {
    //this allows currentUser to be available in all the templates
    res.locals.currentUser = req.user; //this will be empty is no one is logged in
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Use the three route files
app.use(indexRoutes);
app.use(locationRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started...");
});


