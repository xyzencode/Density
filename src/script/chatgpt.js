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