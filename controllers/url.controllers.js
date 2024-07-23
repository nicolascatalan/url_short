import Url from "../models/Url.model.js";
import { createClient } from 'redis';
import clientss from "prom-client";


const client = createClient({
  host: "127.0.0.1",
  port: 6379,
});

await client.connect() 
const  collect =  clientss.collectDefaultMetrics;
collect({timeout:5000})


const counter = new clientss.Counter({
  name:'node_request_operations_total',
  help:'the total number of processed requests'
});

const histogram = new clientss.Histogram({
  name: 'node_request_duration_seconds',
  help:'Histogram for the duration in seconds',
  buckets: [1,2,5,6,10]
});



const createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;
    const shortUrl = Math.random().toString(16).substring(2, 6);

    var star = new Date()
    var simulateTime = 1000

    setTimeout(function(argument){
      var end = new Date() - star
      histogram.observe(end/1000);

    },simulateTime)
    counter.inc();

    res.set('Content-type',clientss.register.contentType)
    res.end(clientss.register.metrics())  

    if (!originalUrl) {
      res.status(400);
      return next(new Error("originalUrl is required"));
    }

    // check if url already exists
    const isUrlExists = await Url.findOne({ originalUrl });

    if (isUrlExists) {
      res.status(400)
      return next(new Error("originalUrl already shortened"));
    }

    const newUrl = await Url.create({
      originalUrl,
      shortUrl
    });

    res.status(201).json({
      success: true,
      newUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    next(new Error(error.message));
  }
}

const getUrls = async (req, res, next) => {
  try {
    // Search Data in Redis
    const reply = await client.get("character");

    // if exists returns from redis and finish with response
    if (reply) return res.send(JSON.parse(reply));

    // Fetching Data from Rick and Morty API
    const urls = await Url.find().sort({ clicks: -1 });


    // Saving the results in Redis. The "EX" and 10, sets an expiration of 10 Seconds
    const saveResult = await client.set(
      "character",
      JSON.stringify(urls),
      {
        EX: 10,
      }
    );
    console.log(saveResult)

    // resond to client
    res.send(urls);
  } catch (error) {
    console.error(error);
    res.status(500);
    next(new Error(error.message));
  }
}

const getURL = async (req, res, next) => {
  try {
    const { shortUrl } = req.params;
    
    if (!shortUrl) {
      res.status(400)
      return next(new Error("shortUrl is required"));
    }

    const url = await Url.findOne({ shortUrl });

    
    if (!url) {
      res.status(404);
      return next(new Error("URL not found"));
    }
    //console.log(url.clicks)
    res.status(200).json(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500);
    next(new Error(error.message));
  }
}

const redirectUrl = async (req, res, next) => {
  try {
    const { shortUrl } = req.params;

    if (!shortUrl) {
      res.status(400)
      return next(new Error("shortUrl is required"));
    }

    const url = await Url.findOne({ shortUrl });
    if (!url) {
      res.status(404);
      return next(new Error("URL not found"));
    }
      if (shortUrl == null) return res.sendStatus(404)

    //console.log("entro")    
    url.clicks++
    url.save()
    res.status(301).redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500);
    next(new Error(error.message));
  }
}

const updateUrl = async (req, res, next) => {
  const { shortUrl } = req.params;
  const { originalUrl } = req.body;

  if (!shortUrl || !originalUrl) {
    res.status(400);
    return next(new Error("shortUrl in route params & originalUrl in the request body is required"));
  }

  try {
    const url = await Url.findOneAndUpdate({ shortUrl }, {
      originalUrl
    }, {
      new: true
    });

    if (!url) {
      res.status(404)
      return next(new Error("URL not found to update"));
    }

    res.status(200).json(url);
  } catch (error) {
    console.error(error);
    res.status(500);
    next(new Error(error.message));
  }
}

const deleteUrl = async (req, res, next) => {
  const { shortUrl } = req.params;

  if (!shortUrl) {
    res.status(400);
    return next(new Error("shortUrl is required"));
  }

  try {
    const deletedUrl = await Url.findOneAndDelete({ shortUrl });
    if (!deletedUrl) {
      res.status(404)
      return next(new Error("URL not found to delete"));
    }

    res.status(200).json(deletedUrl);
  } catch (error) {
    console.error(error);
    res.status(500);
    next(new Error(error.message));
  }
}

export {
  createShortUrl,
  getUrls,
  getURL,
  redirectUrl,
  updateUrl,
  deleteUrl
}