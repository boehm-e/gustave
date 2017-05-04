var stripe = require('rpi-sk6812-native');
stripe.LED_COUNT = 31;
stripe.pixelData = new Uint32Array(stripe.LED_COUNT);
stripe.rgb2Int = (r, g, b) => {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
stripe.clear = () => {
    for (var i = 0; i < stripe.LED_COUNT; i++) {
	stripe.pixelData[i] = stripe.rgb2Int(0,0,0);
	stripe.render(stripe.pixelData);
    }     
}

stripe.init(stripe.LED_COUNT, {
    gammaCorrection: true,
//    frequency:  19200000
});


const loading = require('./anims/loading');
const spooted = require('./anims/spooted');

exports.loading = loading;
exports.spooted = spooted;
