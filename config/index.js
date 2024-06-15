import { fileURLToPath } from "url";
import { watchFile, unwatchFile } from "fs";

import mess from "./mess.js";
import settings from "./settings.js";
import number from "./number.js"
import api from "./api.js"

export default { mess, settings, number, api }

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})