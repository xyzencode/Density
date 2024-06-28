// Copas + Modif Sama Gw
import FormData from "form-data";

export default async function processing(urlPath, method) {
    try {
        return new Promise(async (resolve, reject) => {
            let Methods = ["enhance", "recolor", "dehaze"];
            Methods.includes(method) ? (method = method) : (method = Methods[0]);
            let buffer,
                Form = new FormData(),
                scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
            Form.append("model_version", 1, {
                "Content-Transfer-Encoding": "binary",
                contentType: "multipart/form-data; charset=uttf-8",
            });
            Form.append("image", Buffer.from(urlPath), {
                filename: "enhance_image_body.jpg",
                contentType: "image/jpeg",
            });
            Form.submit(
                {
                    url: scheme,
                    host: "inferenceengine" + ".vyro" + ".ai",
                    path: "/" + method,
                    protocol: "https:",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A",
                        Connection: "Keep-Alive",
                        "Accept-Encoding": "gzip",
                    },
                },
                function (err, res) {
                    if (err) reject();
                    let data = [];
                    res
                        .on("data", function (chunk, resp) {
                            data.push(chunk);
                        })
                        .on("end", () => {
                            resolve(Buffer.concat(data));
                        });
                    res.on("error", (e) => {
                        reject();
                    });
                }
            );
        });
    } catch (e) {
        console.log(e)
    }
}