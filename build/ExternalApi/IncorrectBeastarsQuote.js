"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncorrectBeastarsQuote = void 0;
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
        const url = new url_1.URL(`https://api.tumblr.com/v2/blog/${IncorrectBeastarsQuote.identifer}/posts`);
        url.searchParams.append("api_key", process.env.TUMBLR_API_KEY);
        url.searchParams.append("limit", "20");
        url.searchParams.append("filter", "text");
        const getQuotes = async (offset = 0) => {
            const total_quotes = [];
            url.searchParams.set("offset", offset.toString());
            const res = await axios_1.default.get(url.toString()).catch(() => {
                throw new types_1.CommandError("Cannot access tumblr's api");
            });
            const data = res.data.response;
            if (data.posts.length > 0) {
                for (const quote of data.posts) {
                    //Only add quotes
                    if ((quote.type === "text" || quote.type === "chat") && quote.tags.includes("incorrect beastars quotes")) {
                        total_quotes.push({ url: quote.post_url, text: quote.body });
                    }
                }
                if (data.posts.length === 20) {
                    return total_quotes.concat(await getQuotes(offset + 20));
                }
            }
            return total_quotes;
        };
        return await getQuotes();
    }
}
exports.IncorrectBeastarsQuote = IncorrectBeastarsQuote;
IncorrectBeastarsQuote.identifer = "incorrect-beastars";
//# sourceMappingURL=IncorrectBeastarsQuote.js.map