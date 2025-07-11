const express = require("express");
const app = express();

const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");

app.use(session({ secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
}));//Now after going on any routes it sends a session id to the browser and saves it

app.get("/test", (req, res) => {
    res.send("test successful");
});

app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count ++;
    } else {
        req.session.count = 1;
    }
res.send(`You sent a request ${req.session.count} times`);
});

// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("color", "red", {signed: true});
//     res.send("done!");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.cookies);
//     req.send("verified");//If we completely changes the value of signed cookie the result will be empty object and if we onlychange the value in link then it will show false
// })

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "India");
//     res.send("sent you some cookie");
// });

// app.get("/greet", (req, res) => {
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);
// })

// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Hi I am root");
// });

// app.use("/users", users);//jo bhi routes /users se start hogi unki mapping users  wali file se kiya jayega
// app.use("/posts", posts);


app.listen(3000, () => {
    console.log("server is listening to port 3000");
});