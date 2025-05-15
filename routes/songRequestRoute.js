const express = require('express');
const router = express.Router();
const songRequestForm = require('../models/songRequest');
const { BadRequestError, NotFoundError } = require('../expressError');

router.post('/submit', async (req, res, next) => {
  try {
    const { name, songTitle, artist, albumOrVersion, reason } = req.body;
    if (!name || !songTitle || !artist || !reason) {
      throw new BadRequestError("Missing required fields");
    }
    const newRequest = await songRequestForm.createRequest(req.body);
    res.status(201).json({ message: "Request submitted successfully", request: newRequest });
  } catch (err) {
    next(err);
  }
});

router.get('/requests', async (req, res, next) => {
  try {
    const requests = await songRequestForm.getRequests();
    if (!requests.length) {
      throw new NotFoundError("No song requests found");
    }
    res.json({ requests });
  } catch (err) {
    next(err);
  }
});

router.delete('/requests/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRequest = await songRequestForm.deleteRequest(id);
    if (!deletedRequest) {
      throw new NotFoundError(`Song request with ID ${id} not found`);
    }
    res.json({ message: "Request deleted successfully", request: deletedRequest });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
