// Created By Muhammad Adriansyah - Zayden

import { randomUUID } from 'crypto';
import fs from 'fs';
import ytdl from 'youtubedl-core';
import yts from 'yt-search';

export async function ytmp3(client, m, url) {
    try {
        await ytdl.getInfo(url);
        let a = "./temp/" + randomUUID() + ".mp3";
        let b = await ytdl(url, {
            filter: "audioonly"
        }).pipe(fs.createWriteStream(a)).on("finish", async () => {
            const stats = fs.statSync(a);
            const fileSizeInBytes = stats.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
            if (fileSizeInMB < 50) {
                await client.sendMessage(m.from, {
                    audio: fs.readFileSync(a),
                    mimetype: "audio/mp4",
                    ptt: false
                }, { quoted: m, sendEphemeral: true })
            } else await client.sendMessage(m.from, { text: "File size exceeds 50MB limit." }, { quoted: m, sendEphemeral: true });
        })
        return b
    } catch (e) {
        client.reply(m.from, "Error: " + e, m)
    }
}

export async function ytmp4(client, m, url) {
    try {
        await ytdl.getInfo(url);
        let a = "./temp/" + randomUUID() + ".mp4";
        let b = await ytdl(url, {
            filter: "videoandaudio"
        }).pipe(fs.createWriteStream(a)).on("finish", async () => {
            const stats = fs.statSync(a);
            const fileSizeInBytes = stats.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
            if (fileSizeInMB < 50) {
                await client.sendMessage(m.from, {
                    video: fs.readFileSync(a),
                    mimetype: "video/mp4",
                }, { quoted: m, sendEphemeral: true });
            } else {
                await client.sendMessage(m.from, { text: "File size exceeds 50MB limit." }, { quoted: m, sendEphemeral: true });
            }
        });
        return b;
    } catch (e) {
        return e;
    }
}

export async function search(query) {
    try {
        const a = ((await yts(query)).videos)
        return a;
    } catch (e) {
        console.error(e)
        return null
    }
}
