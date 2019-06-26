import axios, {AxiosResponse} from 'axios';

interface WikiaSearchResult {
    quality: number;
    url: string;
    ns: number;
    id: number;
    title: string;
    snippet: string;
}

export class Wikia {
    static async searchFirstLink(search: string): Promise<string | null> {

        const articles = await this.searchArticles(search);

        //No article found
        if (articles.length === 0) return null;

        return articles[0].url;

    }

    private static async searchArticles(search: string): Promise<WikiaSearchResult[]> {

        const url = `https://beastars-eng.fandom.com/api/v1/Search/List?query=${encodeURIComponent(search)}`;

        const result = <AxiosResponse>await axios.get(url).catch(() => {
            return null;
        });

        //Cannot find article
        if (result == null) return [];

        return result.data.items;

    }
}