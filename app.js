require("dotenv").config();
const express=require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose = require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const Schools=require("./models/schools");
const User=require("./models/users");
const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.use(session({
  secret: process.env.PASS,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.URI);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine', 'ejs');


//home page rendering
app.get("/",function(req,res){
    res.render("index");
});

//search page render
app.get("/searchHome",async function(req,res){
  const allSchools=await Schools.find({});
  res.render("search",{allSchools:allSchools,school:""});
});

//login
app.get("/login",function(req,res){
  res.render("login");
});


app.post("/login",function(req,res){
  const user=new User({
      username: req.body.username,
      password: req.body.password
  });

  req.login(user,function(err){
      if(err){
          console.log(err);
      } else{
          passport.authenticate("local",{ failureRedirect: '/login' })(req,res,function(){
              res.redirect("/"+req.body.username);
          })
      }
  })
})
//saving details into database.
app.post("/register",function(req,res){
  User.register({username: req.body.username,name: req.body.name,email: req.body.email},req.body.password,function(err,user){
      if(err){
          console.log(err);
          res.redirect("/register");
      } else{
          passport.authenticate("local",{failureRedirect: '/register'})(req,res,function(){
              res.redirect("/"+req.body.username);
          })
      }
  })
});

app.get("/:username",async function(req,res){
  if(req.isAuthenticated()){
    const found=await User.find({username:req.params.username});
    const allSchools=await Schools.find({});
    res.render("search",{allSchools:allSchools,school:""});
  }
  else{
    res.redirect("/login");
  }
  
})

//registering user route
app.get("/register",function(req,res){
  res.render("register");
});


//everytime search refreshing to be done from here
app.post("/searchHome",async function(req,res){
  const searchKey=req.body.search;
  const allSchools= await Schools.find({$text: { $search: searchKey}});
  res.render("search",{allSchools: allSchools, school:searchKey})
});


//applying filters to be done here
app.post("/search/:schoolSearched", async function(req,res){
  const board=req.body.board;
  var Primary=req.body.Primary;
  var upper=req.body.Upper;
  var Secondary=req.body.Secondary;
  var transportation=req.body.Transportation; 
  var out=req.body.out;
  var hostel=req.body.hostel;
  var digital=req.body.digital;
  const searchKey=req.params.schoolSearched;
  var query={$text: {$search: searchKey}};
  if(Primary){
    query.Primary="YES";
  }
  if(Secondary){
    query.Secondary="YES";
  }
  if(upper){
    query.UpperPrimary="YES";
  }
  if(transportation){
    query.Transport="YES";
  }
  if(hostel){
    query.HostelFacility="YES";
  }
  if(digital){
    query.DigitalEd="YES";
  }
  if(out){
    query.Playgorund="YES";
  }
  console.log(query);

  const allSchools=await Schools.find(query);
  
  res.render("search",{allSchools: allSchools, school:searchKey})
});

//for viewing schools
app.get("/schools/:schoolID",async function(req,res){
  const schoolID=req.params.schoolID;
  const school=await Schools.findOne({_id: schoolID});
  res.render("school",{school:school});
})



app.use(bodyParser.urlencoded({extended: true}));
app.listen(3000,function(){
  console.log("Server running at 3000");
})