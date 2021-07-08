var router = require('express').Router();

const wrap = fn => (...args) => fn(...args).catch(args[2])

const captchaSession = new onnx.InferenceSession({ backendHint: "cpu" });
const ctcSession = new onnx.InferenceSession({ backendHint: "cpu" });
captchaSession.loadModel("models/captcha_model.onnx").then(_ => console.log("captcha_model loaded"));
ctcSession.loadModel("models/ctc_model.onnx").then(_ => console.log("ctc_model loaded"));

router.get('/', wrap(async function (req, res) {
    const response = await fetch('https://api.vk.com/captcha.php?sid=679196306792&s=1')
    const imageData = await response.buffer()

    const width = 128
    const height = 64
    const channels = 4

    const resizeImageData = await sharp(imageData)
        .resize(width, height)
        .ensureAlpha()
        .raw()
        .toBuffer();

    const imageInputData = Float32Array.from(resizeImageData);

    res.send("need implemented")
}));

module.exports = router;