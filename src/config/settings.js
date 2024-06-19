import { fileURLToPath } from "url";
import { watchFile, unwatchFile } from "fs";

export default {
    write_store: false,
    pairing_code: true,
    self: false,
    groupOnly: true,
    packName: "",
    packPublish: "© OLXYZ 2024 GEN 2"
}

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})