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