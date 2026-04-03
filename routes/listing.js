const express = require("express");
// const router = require("../classRoom/routes/user");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");   // for error middleware

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");

const listingController =require("../controllers/listings.js");

// fo image upload section 
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// router.route use jbb same route ka use ho -> basiccaly for compact code
router.route("/")
.get(wrapAsync(listingController.index))   // index Route
.post(isLoggedIn ,upload.single('listing[image]'), validateListing ,wrapAsync(listingController.createListing)); // Create route After form submitt post k liy


// create a new route  for form
router.get("/new", isLoggedIn ,listingController.renderForm);

router.route("/:id")
.get( isLoggedIn ,wrapAsync(listingController.showListing))// Show Route
.put( isLoggedIn ,isOwner, upload.single('listing[image]') ,validateListing, wrapAsync(listingController.updateListing))// Update Route - edit form submitt hone par
.delete( isLoggedIn , isOwner, wrapAsync(listingController.destroyListing));//Delete Route

// edit Route - edit form dikhao
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;

