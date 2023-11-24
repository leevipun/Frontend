const listingRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const List = require("../models/listModel");
require("express-async-errors");
const User = require("../models/userModel");

listingRouter.get("/:id", async (req, res, next) => {
  const listings = await List.findById(req.params.id);
  if (listings) {
    res.json(listings);
  } else {
    response.status(404).end();
  }
});

listingRouter.get("/", async (req, res, next) => {
  const listings = await List.find({});
  if (listings) {
    res.json(listings);
  } else {
    response.status(404).end();
  }
});

listingRouter.post("/", async (req, res, next) => {
  const body = req.body;

  console.log(req.token);

  console.log("Request user", req.user);

  console.log("Authorization Header:", req.headers.authorization);

  const deCodedToken = jwt.verify(req.token, process.env.SECRET);
  console.log(deCodedToken.id);
  if (!deCodedToken.id) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const user = req.user;

  const listing = new List({
    name: body.name,
    country: body.country,
    description: body.description,
  });

  console.log(listing);

  if (body.name && body.country && body.description) {
    console.log("Täällä");
    const savedListing = await listing.save();
    console.log(user._id);
    console.log(savedListing);
    user.listings = user.listings.concat(savedListing._id);
    await user.save();
    res.json(savedListing);
    console.log("onnistui!");
  } else {
    console.log("Täällä päin");
    res.sendStatus(400).send("Add missing information to continue");
  }
});

module.exports = listingRouter;
