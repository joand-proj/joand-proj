const { Schema, model } = require("mongoose");

const albumSchema = new Schema ({
    name: String,
    artist:  String,
    imgName: String,
	imgPath: String,
    release: Number,
    price: Number,
    userPrice: Number,
    discogsId: Number,
    userCoords: String,
    tracks: [{
        name: String,
        duration: String,
    }],    
});

const Album = model("Album", albumSchema);
module.exports = Album;
