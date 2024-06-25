/** 
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

import axios from "axios";

export default function quote(text, ppurl, nickname) {
    return new Promise(async (resolve, reject) => {
        const json = {
            type: "quote",
            format: "png",
            backgroundColor: "#FFFFFF",
            width: 512,
            height: 768,
            scale: 2,
            messages: [
                {
                    entities: [],
                    avatar: true,
                    from: {
                        id: 1,
                        name: nickname,
                        photo: {
                            url: ppurl
                        }
                    },
                    text: text,
                    replyMessage: {}
                }
            ]
        };
        try {
            const res = await axios.post("https://bot.lyo.su/quote/generate", JSON.stringify(json, null, 2), {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
}