import Url from "../models/Url.model.js";

const createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;
    const shortUrl = Math.random().toString(16).substring(2, 6);

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
    const urls = await Url.find().sort({ clicks: -1 });

    res.status(200).json({
      success: true,
      urls
    });
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