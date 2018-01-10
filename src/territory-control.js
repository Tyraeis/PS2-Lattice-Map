define(["jquery", "./link-data"], function($, link_data) {

    var regionToFacility = {};
    for (continent_id in link_data) {
        var links = link_data[continent_id].links;
        for (i in links) {
            var link = links[i]
            regionToFacility[link.facility_a.map_region_id] = Number(link.facility_id_a);
            regionToFacility[link.facility_b.map_region_id] = Number(link.facility_id_b);
        }
    }

    var world = 17;

    Control = {}
    
    Control.onFacilityCapture = function(facility_id, new_owner) {}

    var socket = new WebSocket("wss://push.planetside2.com/streaming?environment=ps2&service-id=" + DAYBREAK_SERVICE_ID);

    socket.addEventListener("open", function (evt) {
        socket.send(JSON.stringify({
            service: "event",
            action: "subscribe",
            eventNames: ["FacilityControl"],
            worlds: [String(world)]
        }));
    });

    socket.addEventListener("message", function (evt) {
        var msg = JSON.parse(evt.data).payload;

        if (msg) {
            if (msg.event_name == "FacilityControl" && msg.old_faction_id != msg.new_faction_id) {
                Control.onFacilityCapture(Number(msg.facility_id), Number(msg.new_faction_id));
            }
        }
    });

    Control.load = function(continent) {
        $.get({
            url: "https://census.daybreakgames.com/" + DAYBREAK_SERVICE_ID + "/get/ps2:v2/map?zone_ids=" + continent + "&world_id=" + world,
            dataType: "json",
            success: (data) => {
                console.log(data);
                var facilities = data.map_list[0].Regions.Row;
                for (f of facilities) {
                    this.onFacilityCapture(regionToFacility[f.RowData.RegionId], Number(f.RowData.FactionId));
                }
            }
        });
    }

    Control.setServer = function(new_server_id, initial_continent) {
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(JSON.stringify({
                service: "event",
                action: "clearSubscribe",
                eventNames: ["FacilityControl"],
                worlds: [String(world)],
            }));
            socket.send(JSON.stringify({
                service: "event",
                action: "subscribe",
                eventNames: ["FacilityControl"],
                worlds: [String(new_server_id)],
            }));
        }

        world = new_server_id;

        this.load(initial_continent);
    }

    

    return Control;

});