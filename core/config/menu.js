/** 
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

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
        'igstory',
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