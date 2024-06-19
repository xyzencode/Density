import { fileURLToPath } from "url";
import { watchFile, unwatchFile } from "fs";

export default {
    lol: "Anastasya",
    skizo: "Anastasya",
    azure: "2e6532692d764b48b5454f0f4abf8c81"
}

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})