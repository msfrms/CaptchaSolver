var router = require('express').Router();

const wrap = fn => (...args) => fn(...args).catch(args[2])

router.get('/', wrap(async function (req, res) {
    const response = await fetch('https://api.vk.com/captcha.php?sid=679196306792&s=1')
    const imageData = await response.buffer()

    const width = 128
    const height = 64
    const channels = 4

    const resizeImageData = await sharp(imageData)
        .resize(128, 64)
        .ensureAlpha()
        .raw()
        .toBuffer();

    const imageInputData = Float32Array.from(resizeImageData);

    res.send("need implemented")
}));

module.exports = router;