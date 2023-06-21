$(".icon-hide").click(function () {
    $(".icon-show").removeClass("d-none");
    $(this).addClass("d-none");

    $("#password").attr('type', 'text');
})

$(".icon-show").click(function () {
    $(".icon-hide").removeClass("d-none");
    $(this).addClass("d-none");
    $("#password").attr('type', 'password');
})
