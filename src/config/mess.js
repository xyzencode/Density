import { fileURLToPath } from "url";
import { watchFile, unwatchFile } from "fs";

export default {
    admin: "Fitur Hanya Digunakan Oleh Admin",
    owner: "Hanya Pemilik yang Bisa Menggunakan Perintah Ini",
    group: "Perintah Ini Hanya Berfungsi di Grup",
    private: "Perintah Ini Hanya Berfungsi di Chat Pribadi",
    wait: "Mohon Tunggu, Sedang Diproses...",
    error: "Terjadi Kesalahan, Silakan Coba Lagi Nanti",
    ban: "Anda Dilarang Menggunakan Bot Ini",
    botAdmin: "Bot Harus Menjadi Admin Untuk Menggunakan Perintah Ini",
    endLimit: "Batas Telah Tercapai",
    notAllow: "Anda Tidak Diizinkan Menggunakan Perintah Ini",
    notfound: 'Tidak Ditemukan',
    success: "Berhasil",
    reply: "Mohon Balas Pesan",
    media: {
        default: "Mohon Balas Media",
        image: "Mohon Balas Gambar",
        video: "Mohon Balas Video",
        sticker: "Mohon Balas Stiker",
        audio: "Mohon Balas Audio",
        url: 'Mohon Kirimkan Tautan',
        prompt: "Mohon Balas Prompt",
        file: "Mohon Balas File",
        contact: "Mohon Balas Kontak",
        forward: "Mohon Balas Forward",
        query: "Mohon Balas Query",
    }
}

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})