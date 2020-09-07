"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Imgur = void 0;
const axios_1 = require("axios");
const types_1 = require("../types");
const Cache_1 = require("../Cache");
//1 day cache
const cache = new Cache_1.default(60 * 60 * 24);
class Imgur {
    static async getRandomImageInAlbum(albumId) {
        const images = await cache.get(albumId, this.getAllImagesInAlbum.bind(this, albumId));
        if (images.length === 0) {
            cache.flush();
            throw new types_1.CommandError("Unable to find an image");
        }
        return images[Math.floor(Math.random() * images.length)];
    }
    static async getAllImagesInAlbum(albumId) {
        const url = `https://api.imgur.com/3/album/${albumId}/images`;
        const res = await axios_1.default.get(url, { headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` } }).catch(() => {
            throw new types_1.CommandError("Cannot access imgur's api");
        });
        const imageUrls = [];
        for (const image of res.data.data) {
            imageUrls.push(image.link);
        }
        return imageUrls;
    }
}
exports.Imgur = Imgur;
//# sourceMappingURL=Imgur.js.map