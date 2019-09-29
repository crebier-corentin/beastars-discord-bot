require("dotenv").config();
import axios, {AxiosError, AxiosResponse} from "axios";

interface GoogleDriveFilesListResponse {
    files: {
        id: string;
        name: string;
    }[];
    nextPageToken: string;
}

axios.defaults.headers["authorization"] = process.argv[2];
axios.defaults.timeout = 0;

async function getPagesFolders(pageToken?: string): Promise<string[]> {

    const params = {
        q: `'${process.env.DRIVE_BEASTARS_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder'`
    };

    if (pageToken != undefined) {
        params["pageToken"] = pageToken;
    }

    const res = <AxiosResponse<GoogleDriveFilesListResponse>>await axios.get("https://www.googleapis.com/drive/v3/files", {
        params
    });

    let ids: string[] = res.data.files.map(value => value.id);

    //Handle page token via recursion
    if (res.data.nextPageToken !== "" && res.data.nextPageToken !== undefined) {
        ids = [...ids, ...(await getPagesFolders(res.data.nextPageToken))];
    }

    return ids;
}

function buildQ(folders: string[]): string {
    let q: string = `not name contains '0' and ('${folders[0]}' in parents `;

    for (const folder of folders.slice(1)) {
        q += `or '${folder}' in parents `;
    }

    q += ")";

    return q;
}

async function getPagesIdsAndNames(q: string, pageToken?: string): Promise<{ [id: string]: string }> {

    const params = {q};

    if (pageToken != undefined) {
        params["pageToken"] = pageToken;
    }

    const res = <AxiosResponse<GoogleDriveFilesListResponse>>await axios.get("https://www.googleapis.com/drive/v3/files", {
        params
    });

    let files: { [id: string]: string } = res.data.files.reduce((obj, value) => {
        obj[value.id] = value.name;
        return obj;
    }, {});

    //Handle page token via recursion
    if (res.data.nextPageToken !== "" && res.data.nextPageToken !== undefined) {
        files = {...files, ...(await getPagesIdsAndNames(q, res.data.nextPageToken))};
    }

    return files;

}

function padFileName(currentName: string): string {
    let [name, ext] = currentName.split(".");

    return `${name.padStart(2, "0")}.${ext}`;
}

async function updateFileName(id: string, name: string) {
    await axios.patch(`https://www.googleapis.com/drive/v3/files/${id}`, {
        name
    });
}

(async () => {

    const q = buildQ((await getPagesFolders()).slice(100));

    const files = await getPagesIdsAndNames(q);
    const total = Object.keys(files).length;
    console.log(`Got ${total} pages`);

    let counter = 0;
    for (const [id, name] of Object.entries(files)) {
        await updateFileName(id, padFileName(name)).catch((reason: AxiosError) => {
            console.error(reason.message);
        });

        console.log(`${++counter}/${total}`);
    }

    console.log("Done");

})();
