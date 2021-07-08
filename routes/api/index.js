var router = require('express').Router();

router.use('/captcha', require('./captcha'));

module.exports = router;