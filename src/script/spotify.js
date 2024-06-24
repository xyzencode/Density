/** 
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

import dScrape from "d-scrape";
import Spotify from "spotifydl-x";

const spotify = new Spotify.default({ clientId: '941540aaf96c456a9d1ad7ea26817da0', clientSecret: '07d4dd6ed5634187b525566b9e328517' });

export default async function downloadTrack(url) {
    try {
        const res = await spotify.downloadTrack(url);
        const buffer = Buffer.from(res, 'binary');
        return buffer;
    } catch (e) {
        console.error(e)
        return null;
    }
}

export async function searchSpoti(query) {
    const data = await dScrape.search.spotifySearch(query);
    const result = []
    data.map((data) => {
        result.push({
            name: data.album.name,
            image: data.album.images[0].url,
            url: data.external_urls.spotify,
            artist: data.artists[0].name,
            duration: (data.duration_ms / 1000).toFixed(0),
        })
    })
    return result;
}
