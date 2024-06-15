console.clear();

await import("./lib/start.js").then(({ default: start }) => {
    start("main.js");
});