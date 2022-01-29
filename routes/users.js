const express = require('express');
const bodyParser = require('body-parser');
const { getCurrentUser } = require('../controllers/users');

const router = express.Router();

router.use(bodyParser.json()); // parses data in JSON format
router.use(bodyParser.urlencoded({ extended: true })); // parses webpages inside POST requests

router.get('/users/me', getCurrentUser);

module.exports = router;
