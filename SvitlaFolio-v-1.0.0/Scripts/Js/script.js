$(function () {
    var btnMenu = $(".btn-menu");
    var navHeader = $("header nav");
    var ulNav = $("header nav ul");

    btnMenu.click( function () {
        navHeader.toggleClass("hidden-xs hidden-sm");
        btnMenu.toggleClass("icons-btn-hamburger icons-btn-cross");
        ulNav.toggleClass("sm-menu");
    });
});