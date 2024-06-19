import { fileURLToPath } from "url";
import { watchFile, unwatchFile } from "fs";

export default {
    bot: "6285174451711",
    owner: ["6289513081052"],
}

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})