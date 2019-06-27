import {URL} from "url";
import axios, {AxiosResponse} from "axios";
import {CommandError} from "../types";
import Cache from "../Cache";

interface TumblrPostsResponse {
    response: {
        posts: {
            post_url: string;
            body: string;
            tags: string[];
        }[];
        total_posts: number;
    };
}

interface Quote {
    url: string;
    text: string;
}

//1 day cache
const cache = new Cache(60 * 60 * 24);

export class IncorrectBeastarsQuote {

    private static identifer = "incorrect-beastars";

    static async getRandomQuote(): Promise<Quote> {
        const quotes = await cache.get("quotes", this.getAllQuotes);

        if (quotes.length === 0) {
            cache.flush();
            throw new CommandError("Unable to find a quote");
        }

        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    private static async getAllQuotes(): Promise<Quote[]> {

        const url = new URL(`https://api.tumblr.com/v2/blog/${IncorrectBeastarsQuote.identifer}/posts/text`);
        url.searchParams.append("api_key", process.env.TUMBLR_API_KEY);
        url.searchParams.append("limit", "20");
        url.searchParams.append("filter", "text");

        const getQuotes = async (offset: number = 0): Promise<Quote[]> => {

            const total_quotes: Quote[] = [];

            url.searchParams.set("offset", offset.toString());

            const res = <AxiosResponse<TumblrPostsResponse>>await axios.get(url.toString()).catch(() => {
                throw new CommandError("Cannot access tumblr's api");
            });

            const data = res.data.response;

            if (data.total_posts > 0) {
                for (const quote of data.posts) {

                    //Only add quotes
                    if(quote.tags.includes("incorrect beastars quotes")) {
                        total_quotes.push({url: quote.post_url, text:quote.body});
                    }
                }

                if (data.total_posts === 20) {
                    total_quotes.concat(await getQuotes(offset + 20));
                }

            }

            return total_quotes;

        };

        return await getQuotes();
    }

}

