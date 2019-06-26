"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class Wikia {
    static async searchFirstLink(search) {
        const articles = await this.searchArticles(search);
        //No article found
        if (articles.length === 0)
            return null;
        return articles[0].url;
    }
    static async searchArticles(search) {
        const url = `https://beastars-eng.fandom.com/api/v1/Search/List?query=${encodeURIComponent(search)}`;
        const result = await axios_1.default.get(url).catch(() => {
            return null;
        });
        //Cannot find article
        if (result == null)
            return [];
        return result.data.items;
    }
}
exports.Wikia = Wikia;
//# sourceMappingURL=Wikia.js.map