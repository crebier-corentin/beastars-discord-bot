"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const axios_1 = require("axios");
const types_1 = require("../types");
const Cache_1 = require("../Cache");
//1 day cache
const cache = new Cache_1.default(60 * 60 * 24);
class IncorrectBeastarsQuote {
    static async getRandomQuote() {
        const quotes = await cache.get("quotes", this.getAllQuotes);
        if (quotes.length === 0) {
            cache.flush();
            throw new types_1.CommandError("Unable to find a quote");
        }
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
    static async getAllQuotes() {
        const url = new url_1.URL(`https://api.tumblr.com/v2/blog/${IncorrectBeastarsQuote.identifer}/posts/text`);
        url.searchParams.append("api_key", process.env.TUMBLR_API_KEY);
        url.searchParams.append("tag", "incorrect beastars quotes");
        url.searchParams.append("limit", "20");
        url.searchParams.append("filter", "text");
        const getQuotes = async (offset = 0) => {
            const total_quotes = [];
            url.searchParams.set("offset", offset.toString());
            const res = await axios_1.default.get(url.toString()).catch(() => {
                throw new types_1.CommandError("Cannot access tumblr's api");
            });
            const data = res.data.response;
            if (data.total_posts > 0) {
                for (const quote of data.posts) {
                    total_quotes.push(quote.body);
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
IncorrectBeastarsQuote.identifer = "incorrect-beastars";
exports.IncorrectBeastarsQuote = IncorrectBeastarsQuote;
//# sourceMappingURL=IncorrectBeastarsQuote.js.map