import { fileURLToPath } from "url";
import { watchFile, unwatchFile } from "fs";

export default {
    skizo: process.env.API_KEY_SKIZO
}

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})