$(document).ready(function () {
});

// payment history tabs
function getPaymentHistory() {
    var paging = {
        skip: 1,
        take: CONSTANTS.PAGING.pageSize,
        type: "payment",
        isread: -1
    }
    getPaymentNotificationPaging(paging);
    UTILS.addLoading("payment-history-skeleton", "transaction-table-body");
    $("#payment-history-pagination").hide();
}

var isRenderPaymentNotificationPagination = false;
function getPaymentNotificationPaging(paging) {
    ajaxServices.post(CONSTANTS.ROUTES.notification.getNotificationPaging, paging).then(function (response) {
        if (response && response.queryResponse) {
            var metaData = response.queryResponse.metaData;
            if (metaData.TotalPages > 1 && !isRenderPaymentNotificationPagination) {
                $('#payment-history-pagination').twbsPagination({
                    totalPages: metaData.TotalPages,
                    visiblePages: CONSTANTS.PAGING.visiblePages,
                    prevClass: "page-item page-previous",
                    nextClass: "page-item page-next"
                }).on('page', function (evt, page) {
                    UTILS.addLoading("payment-history-skeleton", "transaction-table-body");
                    UTILS.disablePaginationClick("payment-history-pagination")
                    var paging = {
                        skip: page,
                        take: CONSTANTS.PAGING.pageSize,
                        type: "payment",
                        isread: -1
                    }

                    getPaymentNotificationPaging(paging)
                });


            }

            isRenderPaymentNotificationPagination = true;
            renderPaymentHistory(response.queryResponse);
            UTILS.removeLoading("payment-history-skeleton", "transaction-table-body");
            UTILS.enablePaginationClick("payment-history-pagination");
            $("#payment-history-pagination").show();

        }
    }).catch(function (error) {
    })
}

function renderPaymentHistory(response) {
    var paymentItems = "";
    for (var item of response.items) {
        var date = UTILS.formatDateMomentJSDefault(item.created);
        var paymentItem = `>
                    <tr class="d-flex">
                        <td class="col-1 min-width-100 text-purple-01">${item.transactionId}</td>
                        <td class="col-3 min-width-150 text-red">${item.header}</td>
                        <td class="col-1 min-width-100">${item.amount}</td>
                        <td class="col-5 min-width-250">${item.message}</td>
                        <td class="col-2 min-width-100 text-end">${date}</td>
                    </tr>            
                    `;
        paymentItems += paymentItem;
    }

    $("#transaction-table-body").html(paymentItems);
}
// end. payment history tabs

// notification tabs
function getNotificationHistory() {
    var paging = {
        skip: 1,
        take: CONSTANTS.PAGING.pageSize,
        type: "",
        isread: -1
    }
    getNotificationPaging(paging);
    UTILS.addLoading("notification-history-skeleton", "notifications");
    $("#notification-history-pagination").hide();
}

var isRenderNotificationPagination = false;
function getNotificationPaging(paging) {
    ajaxServices.post(CONSTANTS.ROUTES.notification.getNotificationPaging, paging).then(function (response) {
        console.log(response)
        if (response && response.queryResponse) {
            var metaData = response.queryResponse.metaData;
            if (metaData.TotalPages > 1 && !isRenderNotificationPagination) {
                $('#notification-history-pagination').twbsPagination({
                    totalPages: metaData.TotalPages,
                    visiblePages: CONSTANTS.PAGING.visiblePages,
                    prevClass: "page-item page-previous",
                    nextClass: "page-item page-next"
                }).on('page', function (evt, page) {
                    UTILS.addLoading("notification-history-skeleton", "notifications");
                    UTILS.disablePaginationClick("notification-history-pagination")
                    var paging = {
                        skip: page,
                        take: CONSTANTS.PAGING.pageSize,
                        type: "",
                        isread: -1
                    }

                    getNotificationPaging(paging)
                });


            }

            isRenderNotificationPagination = true;
            renderNoticationHistory(response.queryResponse);
            UTILS.removeLoading("notification-history-skeleton", "notifications");
            UTILS.enablePaginationClick("notification-history-pagination");
            $("#notification-history-pagination").show();
        }
    }).catch(function (error) {
        UTILS.removeLoading("notification-history-skeleton", "notifications");
    })
}

function renderNoticationHistory(response) {
    var notifications = "";
    for (var item of response.items) {
        var date = UTILS.formatDateMomentJSDefault(item.created);
        var isReadClass = !item.isRead ? "item-unread" : "";
        var isShowReadButton = item.isRead ? "d-none" : "";
        var notification = `
                         <div id="notification-${item.id}" class="notification-item ${isReadClass}">
                <div class="mr-5">
                    <p class="fs-16 text-purple-01">${item.header}</p>
                    <p class="fs-14 mt-2">
                        ${item.message}
                    </p>
                    <p class="fs-14 text-gray-05 mt-2">${date}</p>
                </div>
                <div class="d-flex ms-3 ms-sm-0">
                    <button  onclick="updateNotification('${item.id}',this)" class="btn btn-isRead btn-primary btn-sm me-2 text-nowrap ${isShowReadButton}">
                        Đã xem
                    </button>
                    <button onclick="deleteNotification('${item.id}')" class="btn btn-delete btn-sm">
                        Xoá
                    </button>
                </div>
            </div>
                    `;
        notifications += notification;
    }

    $("#notifications").html(notifications);
}

function updateNotification(id, el) {
    ajaxServices.post(CONSTANTS.ROUTES.notification.updateIsReadNotification, id).then(function (response) {
        if (response != null && response.mutationResponse != null) {
            if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                toastr.success(TEXTS.COMMON.alert.update.success);
                $(el).hide();
                $("#notification-" + id).removeClass("item-unread")
            }
            else {
                toastr.error(response.mutationResponse.message);
            }
        }
    }).catch(function (error) {
    })
}

function updateIsReadAllNotification() {
    ajaxServices.post(CONSTANTS.ROUTES.notification.updateIsReadAllNotification, null).then(function (response) {
        if (response != null && response.mutationResponse != null) {
            if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                toastr.success(TEXTS.COMMON.alert.update.success);
                $(".btn-isRead").hide();
                $(".notification-item").removeClass("item-unread")
            }
            else {
                toastr.error(response.mutationResponse.message);
            }
        }
    }).catch(function (error) {
    })
}

function deleteNotification(id) {
    Swal.fire({
        title: TEXTS.COMMON.alert.delete.confirm,
        showCancelButton: true,
        confirmButtonText: TEXTS.COMMON.button.confirm,
        cancelButtonText: TEXTS.COMMON.button.cancel,
    }).then((result) => {
        if (result.isConfirmed) {
            ajaxServices.post(CONSTANTS.ROUTES.notification.deleteNotification, id).then(function (response) {
                if (response != null && response.mutationResponse != null) {
                    if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                        toastr.success(TEXTS.COMMON.alert.delete.success);
                        $('#notification-history-pagination').twbsPagination('destroy');
                        UTILS.addLoading("notification-history-skeleton", "notifications");
                        isRenderNotificationPagination = false;
                        getNotificationHistory();
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

// end. notification tabs




