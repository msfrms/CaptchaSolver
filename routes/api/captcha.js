var router = require('express').Router();

const wrap = fn => (...args) => fn(...args).catch(args[2])

router.get('/', wrap(async function (req, res) {
    res.send("need implemented")
}));

module.exports = router;