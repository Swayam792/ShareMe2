import express from "express";

const route = express.Router();

route.get("/", (req, res) => {
    res.render("index");
})

route.get("/sender", (req, res) => {
    res.render("sender");
})

route.get("/receiver", (req, res) => {
    res.render("receiver")
})

export default route;