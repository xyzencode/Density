/** 
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

import "dotenv/config.js";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export default async function Suno(prompt, full = true) {
    new Promise(async (resolve, reject) => {
        const res = await replicate.run("suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787", {
            input: {
                prompt,
                text_temp: 0.7,
                output_full: full,
                waveform_temp: 0.7,
                history_prompt: "announcer"
            }
        })
        resolve(res);

        if (!res) {
            reject("Failed to generate audio");
        }
    });
}