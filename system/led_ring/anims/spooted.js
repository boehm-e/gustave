var stripe = require('rpi-sk6812-native');                                                                                                                                                                                  

function sleep (time) {
    return new Promise((resolve) => {
	setTimeout(() => resolve(), time)
    })
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
    await timeout(3000);
}

module.exports = async () => {
    stripe.setBrightness(255);
    stripe.clear();
    for (var i = 0; i < stripe.LED_COUNT; i++) {
	stripe.pixelData[i] = stripe.rgb2Int(255,255,255)
    }
    console.log(stripe.pixelData);
    for (var i = 0; i <= 255; i+=15) {
	stripe.setBrightness(i);
	stripe.render(stripe.pixelData);
	await timeout(5)
    }
    for (var i = 255; i >= 0; i-=15) {
	stripe.setBrightness(i);
	console.log(i)
	await timeout(5)
	stripe.render(stripe.pixelData);
    }

}
