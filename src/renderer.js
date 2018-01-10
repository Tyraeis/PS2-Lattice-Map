define(["domReady!", "./mapper", "./input"], function(_, map, input) {

    var facility_sizes = {
        2: 7, // amp station
        3: 7, // biolab
        4: 7, // tech plant
        5: 5, // large outpost
        6: 3, // small outpost
        7: 9, // warpgate
    };

    var facility_type_names = {
        2: "Amp Station",
        3: "Bio Lab",
        4: "Tech Plant",
        5: "Large Outpost",
        6: "Small Outpost",
        7: "Warpgate",
    }

    var faction_colors = [
        "#AAAAAA", // Nanite Systems
        "#6D1599", // Vanu Soverignty
        "#005E99", // New Congolmerate
        "#CC1019", // Terran Republic
    ];

    function dist(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.sqrt(dx*dx + dy*dy);
    }

    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext("2d");

    Renderer = {
        canvas: canvas,
        ctx: ctx,
    };

    Renderer.render = function() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.translate(canvas.width / 2, canvas.height / 2);

        var h = canvas.height;
        
        for (var i = 0; i < map.links.length; i++) {
            var f_a = map.facilities[map.links[i][0]];
            var f_b = map.facilities[map.links[i][1]];
            
            var pos_a = input.mapToScreen(f_a.x, f_a.y);
            var pos_b = input.mapToScreen(f_b.x, f_b.y);
            
            if (f_a.faction == f_b.faction) {
                ctx.strokeStyle = faction_colors[f_a.faction]
            } else {
                ctx.strokeStyle = "#ff0";
            }
            
            ctx.beginPath();
            ctx.moveTo(pos_a.x, pos_a.y);
            ctx.lineTo(pos_b.x, pos_b.y);
            ctx.stroke();
        }
        
        var show_small_names = input.scale * h > 0.15;

        for (var f_id in map.facilities) {
            var f = map.facilities[f_id];

            var pos = input.mapToScreen(f.x, f.y);

            var radius = facility_sizes[f.type_id];

            ctx.fillStyle = faction_colors[f.faction];
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
            ctx.fill();

            if (show_small_names || f.type_id != 6 || dist(input.mouse_x, input.mouse_y, pos.x, pos.y) < 35) {
                var name = f.name;
                if (f.type_id == 2 || f.type_id == 3 || f.type_id == 4) {
                    name += " " + facility_type_names[f.type_id];
                }
                
                ctx.fillStyle = "#fff";
                var metrics = ctx.measureText(name);
                ctx.fillText(name, pos.x - metrics.width / 2, pos.y - radius - 1);
            }
        }
    }

    return Renderer

});