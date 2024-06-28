/** 
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

import { fileURLToPath } from "url";
import { watchFile, unwatchFile } from "fs";

import mess from "./mess.js";
import settings from "./settings.js";
import number from "./number.js"

export default { mess, settings, number }

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
    unwatchFile(fileP);
    console.log(`Successfully To Update File ${fileP}`)
})