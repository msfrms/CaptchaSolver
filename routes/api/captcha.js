const fetch = require('node-fetch');
const onnx = require('onnxjs')
var router = require('express').Router();
const sharp = require('sharp');

const wrap = fn => (...args) => fn(...args).catch(args[2])

const captchaSession = new onnx.InferenceSession({ backendHint: "cpu" });
const ctcSession = new onnx.InferenceSession({ backendHint: "cpu" });
captchaSession.loadModel("models/captcha_model.onnx").then(_ => console.log("captcha_model loaded"));
ctcSession.loadModel("models/ctc_model.onnx").then(_ => console.log("ctc_model loaded"));

router.post('/', wrap(async function (req, res) {

    const captchaUrl = req.body.captcha_url
    const response = await fetch(captchaUrl)
    const imageData = await response.buffer()

    const width = 128
    const height = 64
    const channels = 4
    const codemap = " 24578acdehkmnpqsuvxyz";

    const resizeImageData = await sharp(imageData)
        .resize(width, height)
        .ensureAlpha()
        .raw()
        .toBuffer();

    const imageInputData = Float32Array.from(resizeImageData);

    const imageInputTensor = new onnx.Tensor(imageInputData, "float32", [
        1,
        width * height * channels
    ]);

    const captchaOutputTensor = (await captchaSession.run([imageInputTensor])).get("argmax");
    captchaOutputTensor.type = "float32";
    captchaOutputTensor.internalTensor.type = "float32";

    const ctcOutputMap = await ctcSession.run([captchaOutputTensor]);
    const ctcOutputData = ctcOutputMap.values().next().value.data;
    const ctcOutputArray = Array.from(ctcOutputData.values())

    const captcha = Array.from(captchaOutputTensor.data)
        .filter(function (_, i) {
            return ctcOutputArray[i] > 0;
        })
        .map((x, _) => codemap[x])
        .join("");

    res.json({
        code: captcha
    })
}));

module.exports = router;