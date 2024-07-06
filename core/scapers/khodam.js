/** 
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

// Update: 04 Juli 2024

import axios from "axios";
import cheerio from "cheerio";

export default async function Khodam(nama) {
    return new Promise(async (resolve, reject) => {
        await axios.get(`https://khodam.vercel.app/v2?nama=${nama}`).then(({ data }) => {
            const $ = cheerio.load(data);

            const khodam = $('span.__className_cad559.text-3xl.font-bold.text-rose-600').text().trim();
            const result = {
                nama,
                khodam,
                share: `https://khodam.vercel.app/v2?nama=${nama}&share`
            }
            resolve(result);
        }).catch(reject);
    })
}