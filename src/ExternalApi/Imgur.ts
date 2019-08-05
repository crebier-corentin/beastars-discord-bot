import axios, {AxiosResponse} from "axios";
import {CommandError} from "../types";
import Cache from "../Cache";

interface ImgurAlbumImages {
    data: {
        link: string;
    }[];
}

//1 day cache
const cache = new Cache(60 * 60 * 24);

export class Imgur {

    static async getRandomImageInAlbum(albumId: string): Promise<string> {
        const images = await cache.get(albumId, this.getAllImagesInAlbum.bind(this, albumId));

        if (images.length === 0) {
            cache.flush();
            throw new CommandError("Unable to find an image");
        }

        return images[Math.floor(Math.random() * images.length)];
    }

    private static async getAllImagesInAlbum(albumId: string): Promise<string[]> {

        const url = `https://api.imgur.com/3/album/${albumId}/images`;

        const res = <AxiosResponse<ImgurAlbumImages>>await axios.get(url, {headers: {Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`}}).catch(() => {
            throw new CommandError("Cannot access imgur's api");
        });

        const imageUrls: string[] = [];

        for (const image of res.data.data) {
            imageUrls.push(image.link);
        }

        return imageUrls;
    }
}