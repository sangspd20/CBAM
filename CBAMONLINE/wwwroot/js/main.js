(function ($) {
    "use strict"; // Start of use strict

    $(document).ready(function () {
        if (document.getElementById('noti-content'))
            new SimpleBar(document.getElementById('noti-content'));
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-center",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    });

    // Prevent entering letters and Special Characters for input phone number
    $('.field-number').on('input', function () {
        $(this).val($(this).val().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
    });

    // set active page when click navbar item
    $(".user-info .dropdown-item").click(function () {
        sessionStorage.setItem(CONSTANTS.STORAGE_KEY.userCurrentTab, $(this).text().trim());
    })

    getNotification();

}(jQuery, this));

function getNotification() {
    ajaxServices.get(CONSTANTS.ROUTES.notification.getNotification).then(function (response) {
        console.log(response)
        if (response != null && response.queryResponse != null) {
            if (response.queryResponse.length > 0) {
                $(".number-noti").removeClass("d-none");
                renderNotification(response.queryResponse)
            }
        }
    }).catch(function (error) {
    })
}

function renderNotification(list) {
    var notifications = "";
    for (var item of list) {
        var date = UTILS.formatDateMomentJSDefault(item.created)

        var notification = `                            <div class="d-flex align-items-start noti-item p-abs-10 br-bottom-gray-02">
                                <img src="/images/icon-noti-item.png" alt="icon-noti-item" />
                                <div class="ms-2 me-2 fs-16 flex-fill">
                                    <p class="text-gray-04">${item.header}</p>
                                    <p class="text-gray-05 mt-2">${date}</p>
                                </div>
                                <button type="button" onclick="deleteNotificationFun('${item.noteId}')" class="btn-close btn-sm fs-12" aria-label="Close"></button>
                            </div>
                                `

        notifications += notification;
    }

    $("#noti-content .noti-content-wrapper").html(notifications);

}

function viewAllNoti() {
    window.location.href = CONSTANTS.ROUTES.userProfile.index;
    sessionStorage.setItem(CONSTANTS.STORAGE_KEY.userCurrentTab, TEXTS.LAYOUTS.tabs.notification);
}

function deleteNotificationFun(id) {
    Swal.fire({
        title: TEXTS.COMMON.alert.delete.confirm,
        showCancelButton: true,
        confirmButtonText: TEXTS.COMMON.button.confirm,
    }).then((result) => {
        if (result.isConfirmed) {
            ajaxServices.post(CONSTANTS.ROUTES.notification.deleteNotification, id).then(function (response) {
                if (response != null && response.mutationResponse != null) {
                    if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                        toastr.success(TEXTS.COMMON.alert.delete.success);
                        getNotification();
                    }
                    else {
                        toastr.error(response.mutationResponse.message);
                    }
                }
            }).catch(function (error) {
            })
        }
    })
}


$(".icon-hide").click(function () {
    $(this).next().removeClass("d-none");
    $(this).addClass("d-none");
    $(this).parents(".input-group").find("input").attr('type', 'text');
})

$(".icon-show").click(function () {
    $(this).prev().removeClass("d-none");
    $(this).addClass("d-none");
    $(this).parents(".input-group").find("input").attr('type', 'password');
})



