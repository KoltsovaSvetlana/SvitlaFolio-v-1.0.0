$( function () {

    var countSlide = 5;

    $("#next").click( function (event) {
        var slider = $("#slider");
        var widthSlide = $("#slider li").width();

        if (slider.position().left > widthSlide * (2 - countSlide)) {
            var offset = "-=" + widthSlide;
            slider.animate({
                left: offset
            }, 800);
        } else {
            slider.animate({
                left: "0"
            }, 400);
        }

        event.preventDefault();
    });

    $("#prev").click( function (event) {
        var slider = $("#slider");
        var widthSlide = $("#slider li").width();

        if (slider.position().left < 0) {
            var offset = "+=" + widthSlide;
            $("#slider").animate({
                left: offset
            }, 800);
        } else {
            var offsetSlider = (widthSlide * (1 - countSlide)).toString();
            slider.animate({
                left: offsetSlider
            }, 400);
        }

        event.preventDefault();
    });
});