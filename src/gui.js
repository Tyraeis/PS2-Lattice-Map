define(["jquery", "./mapper", "./territory-control"], function($, mapper, control) {

    $("#continent-selector .selector-option").click(function(evt) {
        $("#continent-selector .selected").removeClass("selected");
        $(this).addClass("selected");
        mapper.load(this.dataset.id);
    });

    $("#world-selector .selector-option").click(function(evt) {
        $("#world-selector .selected").removeClass("selected");
        $(this).addClass("selected");
        control.setServer(this.dataset.id, mapper.continent);
    })

});