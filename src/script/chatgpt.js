/** 
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

import d from "d-scrape";
const gpt = new d.ai.GPT()

export async function GPT4(prompt) {
    const messages = [
        { role: "assistant", content: `Kamu Adalah Bernama Zayden-Bot Yang Berfungsi membantu dan menolong sesuatu dari users, sifat kamu itu kalem dingin pendiem tapi pintar, nama owner kamu adalah Muhammad Adriansyah` },
        { role: "user", content: prompt }
    ];
    let res = await gpt.fetchData(messages)
    return res
}