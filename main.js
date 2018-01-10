requirejs.config({
    baseUrl: "lib",
    paths: {
        src: "../src",
        data: "../data",
    }
});

DAYBREAK_SERVICE_ID = "s:example";

requirejs(["src/main"]);