/** 
 *  Created By DikaArdnt
 *  Modified By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

import { areJidsSameUser, downloadContentFromMessage, downloadMediaMessage, extractMessageContent, generateWAMessage, generateWAMessageContent, jidDecode, jidNormalizedUser, prepareWAMessageMedia } from "@xyzendev/baileys";
import { parsePhoneNumber } from "libphonenumber-js"
import baileys from "@xyzendev/baileys";
import { escapeRegExp } from "./functions.js";
import { fileURLToPath } from 'url';
import { watchFile, unwatchFile, writeFileSync } from 'fs';
import pino from "pino"
import { fileTypeFromBuffer } from "file-type";
import { randomBytes } from "crypto";
import jimp from "jimp";

const { proto, generateWAMessageFromContent } = baileys

export async function appenTextMessage(text, originalMsg, m, client) {
    let messages = await generateWAMessage(m.from, { text: text, mentions: m.mentionedJid }, {
        userJid: client.user.id,
        quoted: m.quoted
    });
    messages.key.fromMe = areJidsSameUser(m.sender, client.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let newMsg = {
        ...originalMsg,
        messages: [proto.WebMessageInfo.fromObject(messages)],
        type: 'append'
    };
    client.ev.emit('messages.upsert', newMsg);
}

export function getContentType(a) {
    if (a) {
        const keys = Object.keys(a);
        const key = keys.find(k => (k === 'conversation' || k.endsWith('Message') || k.includes('V2') || k.includes('V3')) && k !== 'senderKeyDistributionMessage');
        return key ? key : keys[0];
    }
}


export function getGroupAdmins(participants) {
    let admins = [];
    for (let i of participants) {
        i.admin === "superadmin" ? admins.push(i.id) : i.admin === "admin" ? admins.push(i.id) : "";
    }
    return admins || [];
}

export function parseMessage(content) {
    content = extractMessageContent(content);

    if (content && content.viewOnceMessageV2Extension) {
        content = content.viewOnceMessageV2Extension.message;
    }
    if (content && content.protocolMessage && content.protocolMessage.type == 14) {
        let type = getContentType(content.protocolMessage);
        content = content.protocolMessage[type];
    }
    if (content && content.message) {
        let type = getContentType(content.message);
        content = content.message[type];
    }

    return content;
}


export function Module({ client, store }) {
    const Client = Object.defineProperties(client, {
        getName: {
            async value(jid) {
                let id = jidNormalizedUser(jid);
                if (id.endsWith("g.us")) {
                    let metadata = store.groupMetadata?.[id] || await client.groupMetadata(id);
                    return metadata.subject;
                } else {
                    let metadata = store.contacts[id];
                    return (
                        metadata?.name ||
                        metadata?.verifiedName ||
                        metadata?.notify ||
                        parsePhoneNumber("+" + id.split("@")[0]).format("INTERNATIONAL")
                    );
                }
            }
        },

        sendContact: {
            async value(jid, number, quoted, options = {}) {
                let list = [];
                for (let v of number) {
                    if (v.endsWith("g.us")) continue;
                    v = v.replace(/\D+/g, "");
                    list.push({
                        displayName: await client.getName(v + "@s.whatsapp.net"),
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await client.getName(v + '@s.whatsapp.net')}\nFN:${await client.getName(v + '@s.whatsapp.net')}\nitem1.TEL;waid=${v}:${v}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:owner@zayden.dev\nitem2.X-ABLabel:Email\nitem3.URL:https://xyzen.tech\nitem3.X-ABLabel:pPrtofolio\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
                    });
                }
                return client.sendMessage(jid, {
                    contacts: {
                        displayName: `${list.length} Contact`,
                        contacts: list
                    }
                }, { quoted, ...options });
            },
            enumerable: true
        },

        decodeJid: {
            value(jid) {
                if (!jid) return jid
                if (/:\d+@/gi.test(jid)) {
                    let decode = jidDecode(jid) || {}
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid
                } else return jid
            }
        },

        sendImage: {
            value(jid, path, caption = '', quoted, options = {}) {
                return client.sendMessage(jid, { image: { url: path }, caption }, { quoted, ...options });
            }
        },

        sendVideo: {
            value(jid, path, caption = '', quoted, options = {}) {
                return client.sendMessage(jid, { video: { url: path }, caption }, { quoted, ...options });
            }
        },

        sendVideo: {
            value(jid, path, caption = '', quoted, options = {}) {
                return client.sendMessage(jid, { video: { url: path }, caption }, { quoted, ...options });
            }
        },

        reply: {
            value(jid, text, quoted, options = {}) {
                return client.sendMessage(jid, { text }, { quoted, ...options });
            }
        },

        resize: {
            async value(media, width, height) {
                let image = await jimp.read(media);
                image.resize(width, height);
                return await image.getBufferAsync(jimp.MIME_JPEG);
            }
        },

        sendListWithImage: {
            async value(jid, title, footer, btn, imageUrl, options = {}) {
                let msg = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            "messageContextInfo": {
                                "deviceListMetadata": {},
                                "deviceListMetadataVersion": 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                ...options,
                                body: proto.Message.InteractiveMessage.Body.create({ text: title }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || "Powered By Adrian" }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    ...(await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: client.waUploadToServer })),
                                    title: null,
                                    subtitle: footer,
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            "name": "single_select",
                                            "buttonParamsJson": JSON.stringify(btn)
                                        },
                                    ]
                                })
                            })
                        }
                    }
                }, {})
                return await client.relayMessage(msg.key.remoteJid, msg.message, {
                    messageId: msg.key.id
                })
            }
        },

        sendList: {
            async value(jid, title, footer, btn, options = {}) {
                let msg = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            "messageContextInfo": {
                                "deviceListMetadata": {},
                                "deviceListMetadataVersion": 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                ...options,
                                body: proto.Message.InteractiveMessage.Body.create({ text: title }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || "Powered By Adrian" }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            "name": "single_select",
                                            "buttonParamsJson": JSON.stringify(btn)
                                        },
                                    ]
                                })
                            })
                        }
                    }
                }, {})
                return await client.relayMessage(msg.key.remoteJid, msg.message, {
                    messageId: msg.key.id
                })
            }
        },

        sendCard: {
            async value(jid, title, image, btn = [], options = {}) {
                async function createImage(url) {
                    const { imageMessage } = await generateWAMessageContent({
                        image: {
                            url
                        }
                    }, {
                        upload: client.waUploadToServer
                    });
                    return imageMessage;
                };
                const cards = await Promise.all(image.map(async (url, index) => ({
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        title: `${index + 1}/${image.length}`,
                        hasMediaAttachment: true,
                        imageMessage: await createImage(url)
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                        buttons: btn
                    })
                })));
                const msg = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: "Powered By Adrian" }),
                                body: proto.Message.InteractiveMessage.Body.fromObject({
                                    text: title
                                }),
                                carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                    cards
                                })
                            })
                        }
                    }
                }, {});

                await client.relayMessage(msg.key.remoteJid, msg.message, {
                    messageId: msg.key.id
                }, { quoted: msg });
            }
        },

        parseMention: {
            value(text) {
                return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') || [];
            }
        },

        downloadMediaMessage: {
            async value(message, filename) {
                let media = await downloadMediaMessage(
                    message,
                    "buffer",
                    {},
                    {
                        logger: pino({ timestamp: () => `,"time":"${new Date().toJSON()}"`, level: "fatal" }).child({ class: "xyzen" }),
                        reuploadRequest: client.updateMediaMessage
                    }
                );

                if (filename) {
                    let mime = await fileTypeFromBuffer(media);
                    let filePath = path.join(process.cwd(), `${filename}.${mime.ext}`);
                    fs.promises.writeFile(filePath, media);
                    return filePath;
                }

                return media;
            },
            enumerable: true
        },
        downloadAndSaveMediaMessage: {
            async value(message, attachExtension = true) {
                let quoted = message.msg ? message.msg : message
                let mime = (message.msg || message).mimetype || ''
                let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
                const filename = "./temp/" + randomBytes(6).readUIntLE(0, 6).toString(36)
                const stream = await downloadContentFromMessage(quoted, messageType)
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                let type = await fileTypeFromBuffer(buffer)
                let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
                await writeFileSync(trueFileName, buffer)
                return trueFileName
            }
        },
        cMod: {
            value(jid, copy, text = '', sender = client.user.id, options = {}) {
                let mtype = getContentType(copy.message);
                let content = copy.message[mtype];
                if (typeof content === "string") copy.message[mtype] = text || content;
                else if (content.caption) content.caption = text || content.caption;
                else if (content.text) content.text = text || content.text;
                if (typeof content !== "string") {
                    copy.message[mtype] = { ...content, ...options };
                    copy.message[mtype].contextInfo = {
                        ...(content.contextInfo || {}),
                        mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
                    };
                }
                if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
                if (copy.key.remoteJid.includes("@s.whatsapp.net")) sender = sender || copy.key.remoteJid;
                else if (copy.key.remoteJid.includes("@broadcast")) sender = sender || copy.key.remoteJid;
                copy.key.remoteJid = jid;
                copy.key.fromMe = areJidsSameUser(sender, client.user.id);
                return baileys.proto.WebMessageInfo.fromObject(copy);
            },
            enumerable: false
        }
    })

    return Client
}

export default async function smsg(client, msg, store) {
    try {
        const m = {};

        if (!msg.message) return;

        if (!msg) return msg;

        m.message = parseMessage(msg.message);

        if (msg.key) {
            m.key = msg.key;
            m.from = m.key.remoteJid.startsWith("status") ? jidNormalizedUser(m.key.participant) : jidNormalizedUser(m.key.remoteJid);
            m.fromMe = m.key.fromMe;
            m.id = m.key.id;
            m.device = /^3A/.test(m.id) ? 'ios' : /^3E/.test(m.id) ? 'web' : /^.{21}/.test(m.id) ? 'android' : /^.{18}/.test(m.id) ? 'desktop' : 'unknown';
            m.isBot = (m.id.startsWith("BAE5") || m.id.startsWith("HSK"));
            m.isGroup = m.from.endsWith("@g.us");
            m.participant = jidNormalizedUser(msg?.participant || m.key.participant) || false;
            m.sender = jidNormalizedUser(m.fromMe ? client.user.id : m.isGroup ? m.participant : m.from);
        }

        if (m.isGroup) {
            m.metadata = store.groupMetadata[m.from] || await client.groupMetadata(m.from);
            m.groupAdmins = m.isGroup && (m.metadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, []));
            m.isAdmin = m.isGroup && !!m.groupAdmins.find((member) => member.id === m.sender);
            m.isBotAdmin = m.isGroup && !!m.groupAdmins.find((member) => member.id === jidNormalizedUser(client.user.id));
            m.participants = m.metadata.participants.map(a => a.id);
        }

        m.mentionedJid = m.message?.contextInfo?.mentionedJid || [];
        m.botNumber = client.decodeJid(client.user.id)
        m.pushName = msg.pushName;

        if (m.message) {
            m.type = getContentType(m.message) || Object.keys(m.message)[0];
            m.msg = parseMessage(m.message[m.type]) || m.message[m.type];
            m.mentions = [...(m.msg?.contextInfo?.mentionedJid || []), ...(m.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])];
            m.body = m.msg?.text || m.msg?.conversation || m.msg?.caption || m.message?.conversation || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || m.msg?.selectedId || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || m.msg?.name || m.msg?.interactiveResponseMessage || m.msg?.nativeFlowResponseMessage || "";
            m.prefix = new RegExp(`^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]`, "gi").test(m.body) ? m.body.match(new RegExp(`^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]`, "gi"))[0] : "";
            m.command = m.body && m.body.trim().replace(m.prefix, '').trim().split(/ +/).shift();
            m.args = m.body.trim().replace(new RegExp("^" + escapeRegExp(m.prefix), 'i'), '').replace(m.command, '').split(/ +/).filter(a => a) || [];
            m.text = m.args.join(" ").trim();
            m.expiration = m.msg?.contextInfo?.expiration || 0;
            m.timestamps = (typeof msg.messageTimestamp === "number") ? msg.messageTimestamp * 1000 : m.msg.timestampMs * 1000;
            m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath;
            m.isQuoted = false;

            if (m.msg?.contextInfo?.quotedMessage) {
                m.isQuoted = true;
                m.quoted = {};
                m.quoted.message = parseMessage(m.msg?.contextInfo?.quotedMessage);

                if (m.quoted.message) {
                    m.quoted.type = getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0];
                    m.quoted.msg = parseMessage(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type];
                    m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath;
                    m.quoted.key = {
                        remoteJid: m.msg?.contextInfo?.remoteJid || m.from,
                        participant: jidNormalizedUser(m.msg?.contextInfo?.participant),
                        fromMe: areJidsSameUser(jidNormalizedUser(m.msg?.contextInfo?.participant), jidNormalizedUser(client?.user?.id)),
                        id: m.msg?.contextInfo?.stanzaId
                    };
                    m.quoted.from = /g\.us|status/.test(m.msg?.contextInfo?.remoteJid) ? m.quoted.key.participant : m.quoted.key.remoteJid;
                    m.quoted.fromMe = m.quoted.key.fromMe;
                    m.quoted.id = m.msg?.contextInfo?.stanzaId;
                    m.quoted.device = /^3A/.test(m.quoted.id) ? 'ios' : /^3E/.test(m.quoted.id) ? 'web' : /^.{21}/.test(m.quoted.id) ? 'android' : /^.{18}/.test(m.quoted.id) ? 'desktop' : 'unknown';
                    m.quoted.isGroup = m.quoted.from.endsWith("@g.us");
                    m.quoted.participant = jidNormalizedUser(m.msg?.contextInfo?.participant) || false;
                    m.quoted.sender = jidNormalizedUser(m.msg?.contextInfo?.participant || m.quoted.from);
                    m.quoted.mentions = [...(m.quoted.msg?.contextInfo?.mentionedJid || []), ...(m.quoted.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])];
                    m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || "";
                    m.quoted.prefix = new RegExp(`^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]`, "gi").test(m.quoted.body) ? m.quoted.body.match(new RegExp(`^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]`, "gi"))[0] : "";
                    m.quoted.command = m.quoted.body && m.quoted.body.replace(m.quoted.prefix, '').trim().split(/ +/).shift();
                    m.quoted.args = m.quoted.body.trim().replace(new RegExp("^" + escapeRegExp(m.quoted.prefix), 'i'), '').replace(m.quoted.command, '').split(/ +/).filter(a => a) || [];
                    m.quoted.text = m.quoted.args.join(" ").trim() || m.quoted.body;
                }
            }
        }

        m.reply = async (text, options = {}) => {
            if (typeof text === "string") {
                return await client.sendMessage(m.from, { text, ...options, contextInfo: { forwardedNewsletterMessageInfo: { newsletterName: "Powered By Adrian", newsletterJid: "120363182916458068@newsletter" } } }, { quoted: m, ephemeralExpiration: m.expiration, ...options });
            } else if (typeof text === "object" && typeof text !== "string") {
                return client.sendMessage(m.from, { ...text, ...options }, { quoted: m, ephemeralExpiration: m.expiration, ...options });
            }
        };

        return m;
    } catch (e) {
        console.log(e)
    }
}

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})