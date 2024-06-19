import { fileURLToPath } from "url";
import { watchFile, unwatchFile } from "fs";

export default {
    owner: [
        'getcase'
    ],
    main: [
        "owner",
        'menu',
        'license',
        'thanksto'
    ],
    download: [
        "instagram",
        "tiktokdl",
        "tiktok",
        'tiktokmusic',
        'spotifydl',
        'ytdl',
        'ytmp4',
        'ytmp3'
    ],
    group: [
        'antilink',
        'hidetag',
        'kick',
        'add',
        'listonline'
    ],
    search: [
        'spotify',
        'ytplay',
        'pinterest'
    ],
    tool: [
        'shorturl',
        'fetch',
        'readviewonce',
        'quoted',
        'delete',
        'tourl',
        'quotely',
        'attp',
        'ttp',
        'sticker'
    ],
    ai: [
        'openai',
        'remini',
        'hdr',
        'dalle3',
        'imagetoprompt',
        'whatmusic'
    ],
    function: [
        'addrulespin',
        'addpinrule'
    ]
}

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})