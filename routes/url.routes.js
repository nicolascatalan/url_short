import express from "express";
import { createShortUrl, deleteUrl, getURL, getUrls, redirectUrl, updateUrl } from "../controllers/url.controllers.js";

const router = express.Router();

// Create short URL
router.post("/create", createShortUrl);

// GET all URL order desc
router.get("/", getUrls);

// Get a specific URL by shorturl
router.get("/:shortUrl", getURL)




// Redirect  
router.get("/redirect/:shortUrl", redirectUrl);

// update original url by shortUrl
router.put("/:shortUrl", updateUrl);

// Delete a URL by shortUrl
router.delete("/:shortUrl", deleteUrl);

export default router;