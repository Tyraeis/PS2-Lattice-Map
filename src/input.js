define(["domReady!", "jquery"], function(_, $) {


    var Input = {
        scale: 1 / 6000,
        x: 0,
        y: 0,
        mouse_x: 0,
        mouse_y: 0,
    }

    $(window).on("wheel", function (e) {
        var dy = e.originalEvent.deltaY;
        Input.scale = Math.pow(Input.scale, 1 + 0.003 * dy);
    });

    var dragging = false;
    var last_x = 0;
    var last_y = 0;
    $(window).mousedown(function (e) {
        if (e.which == 1) {
            dragging = true;
            last_x = e.pageX;
            last_y = e.pageY;
        }
    });

    $(window).mouseup(function (e) {
        if (e.which == 1) {
            dragging = false;
        }
    });

    $(window).mousemove(function (e) {
        Input.mouse_x = e.pageX - canvas.width / 2;
        Input.mouse_y = e.pageY - canvas.height / 2;

        if (dragging) {
            Input.x += (last_x - e.pageX) / Input.scale / canvas.height;
            Input.y += (last_y - e.pageY) / Input.scale / canvas.height;
            last_x = e.pageX;
            last_y = e.pageY;
        }
    });

    Input.mapToScreen = function(x, y) {
        return {
            x: (x - this.x) * this.scale * canvas.height,
            y: (y - this.y) * this.scale * canvas.height,
        }
    }

    return Input
});