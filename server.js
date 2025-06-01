const express=require("express");
const app=express();
const port=3000;

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.get("/index.html",(req,res)=>{
    res.render("index.ejs");
});
app.get("/about.html",(req,res)=>{
    res.render("about.ejs");
});
app.get("/control.html",(req,res)=>{
    res.render("control.ejs");
});
app.get("/crop-sugg.html",(req,res)=>{
    res.render("crop-sugg.ejs");
});
app.get("/crop.html",(req,res)=>{
    res.render("crop.ejs");
});
app.get("/farmer.html",(req,res)=>{
    res.render("farmer.ejs");
});
app.get("/features.html",(req,res)=>{
    res.render("features.ejs");
});
app.get("/field.html",(req,res)=>{
    res.render("field.ejs");
});
app.get("/history.html",(req,res)=>{
    res.render("history.ejs");
});

app.get("/news.html",(req,res)=>{
    res.render("news.ejs");
});
app.get("/notifications.html",(req,res)=>{
    res.render("notifications.ejs");
});
app.get("/payment.html",(req,res)=>{
    res.render("payment.ejs");
});
app.get("/profile.html",(req,res)=>{
    res.render("profile.ejs");
});
app.get("/readings.html",(req,res)=>{
    res.render("readings.ejs");
});
app.get("/seed.html",(req,res)=>{
    res.render("seed.ejs");
});
app.get("/signin.html",(req,res)=>{
    res.render("signin.ejs");
});
app.get("/signup.html",(req,res)=>{
    res.render("signup.ejs");
});
app.get("/soil.html",(req,res)=>{
    res.render("soil.ejs");
});

// Start the server
app.listen(port, () => {
    console.log(`GREENLOT server running at http://localhost:${port}`);
});
