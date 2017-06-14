const stripe = require('rpi-sk6812-native');                                                                                                                                                                                  

function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
    else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
    else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

var loop;

const start = () => {
    let offset = 0;
    stripe.setBrightness(200)
    loop = setInterval(function () {
	stripe.LED_COUNT

	Array.from(new Array(stripe.LED_COUNT), (x,i) => stripe.pixelData[i] = colorwheel((offset + i) % 256))
	
	offset = (offset + 1) % 256;
	stripe.render(stripe.pixelData);
    }, 1000/30);
}

const stop = () => {
    clearInterval(loop)
    stripe.clear();
}



exports.start = start;
exports.stop = stop;

