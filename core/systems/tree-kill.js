/** 
 *  Source from : https://github.com/pkrumins/node-tree-kill
 *  Modified By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

"use strict"; import { spawn, exec } from "child_process"; export default function (e, r, i) { if ("function" == typeof r && void 0 === i && (i = r, r = void 0), e = parseInt(e), Number.isNaN(e)) { if (i) return i(new Error("pid must be a number")); throw new Error("pid must be a number") } var t = {}, n = {}; switch (t[e] = [], n[e] = 1, process.platform) { case "win32": exec("taskkill /pid " + e + " /T /F", i); break; case "darwin": buildProcessTree(e, t, n, (function (e) { return spawn("pgrep", ["-P", e]) }), (function () { killAll(t, r, i) })); break; default: buildProcessTree(e, t, n, (function (e) { return spawn("ps", ["-o", "pid", "--no-headers", "--ppid", e]) }), (function () { killAll(t, r, i) })) } } function killAll(e, r, i) { var t = {}; try { Object.keys(e).forEach((function (i) { e[i].forEach((function (e) { t[e] || (killPid(e, r), t[e] = 1) })), t[i] || (killPid(i, r), t[i] = 1) })) } catch (e) { if (i) return i(e); throw e } if (i) return i() } function killPid(e, r) { try { process.kill(parseInt(e, 10), r) } catch (e) { if ("ESRCH" !== e.code) throw e } } function buildProcessTree(e, r, i, t, n) { var o = t(e), c = ""; o.stdout.on("data", (function (e) { e = e.toString("ascii"), c += e })); o.on("close", (function (o) { delete i[e], 0 == o ? c.match(/\d+/g).forEach((function (o) { o = parseInt(o, 10), r[e].push(o), r[o] = [], i[o] = 1, buildProcessTree(o, r, i, t, n) })) : 0 == Object.keys(i).length && n() })) }