requirejs.config({
    baseUrl: "lib",
    paths: {
        src: "../src",
        data: "../data",
    }
});

DAYBREAK_SERVICE_ID = "s:ps2LatticeMap";

requirejs(["src/main"]);