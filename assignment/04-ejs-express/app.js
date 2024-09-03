import express from "express";
import bodyParser from "body-parser";

const app = express();

app.set("view engine", "ejs")-
app.set("views", "views")

app.use(bodyParser.urlencoded({extended: false}))

const users = []

app.get("/", (req, res)=>{
    res.render("users", {users, pageTitle: "users", path: "/"})
})

app.get("/add-user", (req, res)=>{
    res.render("add-user", {pageTitle: "Add user", path: "/add-user"})
})

app.post("/add-user", (req, res)=>{
    users.push(req.body)
    console.log(req.body);
    res.redirect("/")
})

app.listen(3000);
