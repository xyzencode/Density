// Code By Muhammad Adriansyah - Zayden
// Please Don't Change the Credit Or Delete This Comment
// Thanks For Using My Code

// Powered By apigratis.site
'use client';

// import fetch from 'node-fetch';
import { readFileSync, writeFileSync } from 'fs';

const session = JSON.parse(readFileSync("./src/storage/json/session-ponyoai.json"));

/*
    PonyoAI
    @param message: string
    @param chat_id: string
    @return Promise
*/
async function PonyoAI(message, chat_id = "", external_id) {
    return new Promise(async (resolve, reject) => {
        await fetch("https://api.apigratis.site/cai/send_message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                external_id,
                message,
                chat_id,
            })
        }).then((response) => {
            resolve(response.json());
        }).catch((error) => {
            reject(error);
        });
    });
}

// Session Handler
export const getSession = async (users) => {
    const session = JSON.parse(readFileSync("./src/storage/json/session-ponyoai.json"));
    const a = session.find((session) => session.users === users);
    return a ? a : null;
}

export const addSession = async (users, chat_id, cai = "3Lln4tP_SbI46QrFwvs4Y4GhqgZTIwPASYCxfPykeRA") => {
    const session = JSON.parse(readFileSync("./src/storage/json/session-ponyoai.json"));
    session.push({ users, chat_id, cai });
    writeFileSync("./src/storage/json/session-ponyoai.json", JSON.stringify(session, null, 2));
}

export const updateSession = async (users, data) => {
    const session = JSON.parse(readFileSync("./src/storage/json/session-ponyoai.json"));
    const index = session.findIndex((session) => session.users === users);
    session[index] = data;
    writeFileSync("./src/storage/json/session-ponyoai.json", JSON.stringify(session, null, 2));
}

export const deleteSession = async (users) => {
    const session = JSON.parse(readFileSync("./src/storage/json/session-ponyoai.json"));
    const index = session.findIndex((session) => session.users === users);
    if (index === -1) return false;
    session.splice(index, 1);
    writeFileSync("./src/storage/json/session-ponyoai.json", JSON.stringify(session, null, 2));
    return true;
}
/*
    PonyoAIHandler
    @param message: string
    @param number: string
    @return Promise
*/
export default async function PonyoAIHandler(message, number) {
    return new Promise(async (resolve, reject) => {
        const session = await getSession(number);
        if (session) {
            PonyoAI(message, session.chat_id, session.cai || "3Lln4tP_SbI46QrFwvs4Y4GhqgZTIwPASYCxfPykeRA")
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        } else {
            PonyoAI(message, "", "3Lln4tP_SbI46QrFwvs4Y4GhqgZTIwPASYCxfPykeRA")
                .then((response) => {
                    const chat_id = response.result.chat_id;
                    addSession(number, chat_id);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        }
    });
}