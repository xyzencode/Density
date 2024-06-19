/** 
 * 
 *  Scapers Created By Muhammad Adriansyah
 *  https://github.com/xyzendev
 *  
*/

import axios from "axios";
import FormData from "form-data";
import cheerio from "cheerio";

export async function tiktokdl(url) {
    let result = {};
    let form = new FormData();
    form.append("q", url);
    form.append("lang", "id");

    try {
        let { data } = await axios("https://savetik.co/api/ajaxSearch", {
            method: "post",
            data: form,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "User-Agent": "PostmanRuntime/7.32.2"
            }
        });

        let $ = cheerio.load(data.data);

        result.status = true;
        result.caption = $("div.video-data > div > .tik-left > div > .content > div > h3").text();
        result.server1 = {
            quality: "MEDIUM",
            url: $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href")
        };
        result.serverHD = {
            quality: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").text().split("MP4 ")[1],
            url: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").attr("href")
        };
        result.audio = $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href");

    } catch (error) {
        result.status = false;
        result.message = error;
        console.log(result);
    }

    return result;
}

export async function ttslide(url) {
    try {
        const res = await axios({
            method: 'POST',
            url: 'https://tikvideo.app/api/ajaxSearch',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
            },
            data: {
                "q": url,
                "lang": "id"
            }
        });
        var result = [];
        if (res.data.status === 'ok') {
            let $ = cheerio.load(res.data.data);
            $('img').each((index, element) => {
                const a = $(element).attr('src');
                if (!a.includes('.webp')) {
                    result.push(a);
                }
            });
        }
        if (result.length > 0) {
            return result;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}