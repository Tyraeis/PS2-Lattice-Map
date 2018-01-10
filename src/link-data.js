define(["text!data/links.json"], function(link_json) {
    var raw = JSON.parse(link_json);
    var data = {};

    for (i in raw.zone_list) {
        var continent = raw.zone_list[i];
        data[continent.zone_id] = continent
    }

    return data;
});