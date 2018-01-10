define(["./link-data", "./territory-control"], function(link_data, territory_control) {

    var x_axis = "location_z"
    var y_axis = "location_x"

    var repulsion_constant = 150000;
    var attraction_constant = 0.01;

    var Mapper = {
        continent: -1,
        facilities: {},
        links: [],
    }

    var faction_names = [
        "Nanite Systems",
        "the Vanu Soverignty",
        "the New Conglomerate",
        "the Terran Republic",
    ]

    territory_control.onFacilityCapture = function(f_id, faction) {
        if (Mapper.facilities[f_id]) {
            console.log(Mapper.facilities[f_id].name + " was captured by " + faction_names[faction]);
            Mapper.facilities[f_id].faction = faction;
        }
    }

    // get the angle of the link from facility a to facility b
    Mapper.facility_angle = function (a, b) {
        var f_a = this.facilities[a] || a;
        var f_b = this.facilities[b] || b;
        return Math.atan2(f_b.y - f_a.y, f_b.x - f_a.x);
    }

    // get the distance from facility a to facility b
    Mapper.facility_dist = function (a, b) {
        var f_a = this.facilities[a] || a;
        var f_b = this.facilities[b] || b;
        var dx = f_a.x - f_b.x;
        var dy = f_a.y - f_b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    Mapper.init_facility = function (f) {
        this.facilities[f.facility_id] = this.facilities[f.facility_id] || {
            name: f.facility_name,
            type: f.facility_type,
            type_id: Number(f.facility_type_id),
            faction: 0,
            links: [],
            x: Number(f[x_axis]),
            y: -Number(f[y_axis]),
            vx: 0,
            vy: 0
        }
    }

    Mapper.load = function(continent) {
        territory_control.load(continent);

        console.log(link_data);
        var data = link_data[continent].links;

        this.continent = continent;
        this.facilities = {};
        this.links = [];

        for (link of data) {
            var id_a = Number(link.facility_a.facility_id);
            var id_b = Number(link.facility_b.facility_id);

            this.init_facility(link.facility_a);
            this.init_facility(link.facility_b);

            this.links.push([id_a, id_b]);
            this.facilities[id_a].links.push(id_b);
            this.facilities[id_b].links.push(id_a);
        }

        for (f_id in this.facilities) {
            var f = this.facilities[f_id];

            f.links.sort((a, b) => {
                var angle_a = this.facility_angle(f, a);
                var angle_b = this.facility_angle(f, b);

                return angle_a - angle_b;
            });
        }
    }

    Mapper.update = function() {
        for (f_id in this.facilities) {
            var f = this.facilities[f_id];

            // facilities are repeled from nearby facilities
            for (f_id2 in this.facilities) {
                if (f_id != f_id2) {
                    var f2 = this.facilities[f_id2];

                    var angle = this.facility_angle(f2, f);
                    var dist = this.facility_dist(f2, f);
                    // this assumes that dist is never 0 (which it should never be)
                    var force = repulsion_constant / (dist * dist);

                    f.vx += force * Math.cos(angle);
                    f.vy += force * Math.sin(angle);
                }
            }

            // facilities are attracted to linked facilities
            for (var i = 0; i < f.links.length; i++) {
                var f2 = this.facilities[f.links[i]];

                var angle = this.facility_angle(f2, f);
                var dist = this.facility_dist(f2, f);
                var force = -attraction_constant * dist;

                f.vx += force * Math.cos(angle);
                f.vy += force * Math.sin(angle);
            }
        }
        for (f_id in this.facilities) {
            var f = this.facilities[f_id];

            //console.log(f.vx, f.vy);

            f.x += f.vx;
            f.y += f.vy;

            f.vx = 0;
            f.vy = 0;
        }
    }

    return Mapper;
});