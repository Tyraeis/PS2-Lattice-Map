define(["./gui", "./mapper", "./renderer"], function(_, mapper, renderer) {

    $(window).resize(function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        renderer.render();
    }).resize();

    requestAnimationFrame(function update() {
        mapper.update();
        renderer.render();

        requestAnimationFrame(update);
    });

    mapper.load(2);

});