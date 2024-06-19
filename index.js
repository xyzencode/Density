console.clear();

await import("./src/lib/start.js").then(({ default: start }) => {
    start("main.js");
});