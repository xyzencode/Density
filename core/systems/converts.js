// Description: This file contains the convert functions.
// Cuma buat convert doang, jangan diapa-apain.
// Cuma Fix Daong hehehe
// By Muhammad Adriansyah

import { promises } from 'fs'
import { join } from 'path'
import { spawn } from 'child_process'

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
    return new Promise(async (resolve, reject) => {
        try {
            let tmp = join('./temp', +new Date + '.' + ext)
            let out = tmp + '.' + ext2
            await promises.writeFile(tmp, buffer)
            spawn('ffmpeg', [
                '-y',
                '-i', tmp,
                ...args,
                out
            ])
                .on('error', reject)
                .on('close', async (code) => {
                    try {
                        await promises.unlink(tmp)
                        if (code !== 0) return reject(code)
                        resolve({
                            data: await promises.readFile(out),
                            filename: out,
                            delete() {
                                return promises.unlink(out)
                            }
                        })
                    } catch (e) {
                        reject(e)
                    }
                })
        } catch (e) {
            reject(e)
        }
    })
}

function toPTT(buffer, ext) {
    return ffmpeg(buffer, [
        '-vn',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-vbr', 'on',
    ], ext, 'ogg')
}

function toAudio(buffer, ext) {
    return ffmpeg(buffer, [
        '-vn',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-vbr', 'on',
        '-compression_level', '10'
    ], ext, 'opus')
}

function toImage(buffer, ext) {
    return ffmpeg(buffer, [
        '-vf', 'scale=1080:1080',
        '-q:v', '2',
        '-vframes', '1'
    ], ext, 'jpg')
}
export {
    toAudio,
    toPTT,
    ffmpeg,
    toImage
}