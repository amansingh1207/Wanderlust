const express = require('express');
const router = express.Router();

//posts
//Index
router.get("/", (req, res) => {
    res.send("GET for posts");
});

//Show
router.get("/:id", (req, res) => {
    res.send("GET for post id");
});

//POST
router.post("/", (req, res) => {
    res.send("POST for post");
});

//DELETE
router.get("/:id", (req, res) => {
    res.send("DELETE for post id");
});

module.exports = router;