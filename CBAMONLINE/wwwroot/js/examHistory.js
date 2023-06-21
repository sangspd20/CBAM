var cityList = [];
$(document).ready(function () {
    // get city list
    var location = {
        path: "",
        type: CONSTANTS.LOCATION_TYPE.city
    }
    getLocations(location);
});

function getRecentExamHistory() {
    var pagingDashboard = {
        skip: 1,
        take: 10
    }

    getExamHistoryPagingDashboard(pagingDashboard);
}

function getExamHistory() {
    var paging = {
        skip: 1,
        take: CONSTANTS.PAGING.pageSize
    }
    getExamHistoryPaging(paging);
    UTILS.addLoading("exam-history-skeleton", "accordionExamHistory");
    $("#exam-history-pagination").hide();
}

var isRenderExamPagination = false;
// get  exam history in exam history tab
function getExamHistoryPaging(paging) {
    ajaxServices.post(CONSTANTS.ROUTES.examHistory.getExamHistoryPaging, paging).then(function (response) {
        if (response && response.queryResponse) {
            renderExamHistory(response.queryResponse.items, response.queryResponse.metaData);

            var metaData = response.queryResponse.metaData;

            if (metaData.TotalPages > 1 && !isRenderExamPagination) {
                $('#exam-history-pagination').twbsPagination({
                    totalPages: metaData.TotalPages,
                    visiblePages: CONSTANTS.PAGING.visiblePages,
                    prevClass: "page-item page-previous",
                    nextClass: "page-item page-next"
                }).on('page', function (evt, page) {
                    UTILS.addLoading("exam-history-skeleton", "accordionExamHistory");
                    UTILS.disablePaginationClick("exam-history-pagination")
                    var paging = {
                        skip: page,
                        take: CONSTANTS.PAGING.pageSize
                    }
                    getExamHistoryPaging(paging)
                });
            }

            isRenderExamPagination = true;
            UTILS.removeLoading("exam-history-skeleton", "accordionExamHistory");
            $("#exam-history-pagination").show();
            UTILS.enablePaginationClick("exam-history-pagination");


        }
    }).catch(function (error) {
        UTILS.removeLoading("exam-history-skeleton", "accordionExamHistory");
    })
}

// get recent exam history in dashboard tab
function getExamHistoryPagingDashboard(paging) {
    ajaxServices.post(CONSTANTS.ROUTES.examHistory.getExamHistoryPaging, paging).then(function (response) {
        if (response && response.queryResponse) {
            console.log(response.queryResponse);

            renderRecentExamHistory(response.queryResponse.items);
        }
    }).catch(function (error) {
    })
}

// render exam history in exam history tab
function renderExamHistory(examList, metaData) {
    var start = metaData.StartOrder || 1;
    var examItems = "";
    for (var i = 0; i < examList.length; i++) {
        var item = examList[i];
        var children = item.children;
        var childItems = "";
        for (var child of children) {
            var scoreItems = "";
            for (var score of child.scores) {
                var scoreItem = ` <p>
                                    ${score.name}
                                    <span class="text-gray-01">${score.mark}/${score.total}</span> câu
                                 </p>`
                scoreItems += scoreItem;
            }

            var startTime = UTILS.formatDateMomentJS(child.start, "DD/MM/YYYY")

            var childItem = ` <tr class="d-flex">
                                        <td class="col-3">${child.name}</td>
                                        <td class="col-3 min-width-150">
                                            ${scoreItems}
                                        </td>
                                        <td class="col-2 text-purple-01 text-center">
                                            #${child.order}
                                        </td>
                                        <td class="col-2 min-width-150">${child.timeEnd}</td>
                                        <td class="col-2 text-end">${startTime}</td>
                                    </tr>`;

            childItems += childItem;
        }

        var collapseId = item.id;
        var examItem = `   <div class="accordion-item">
                    <h2 class="accordion-header position-relative"
                        id="heading-${collapseId}">
                        <button class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapse-${collapseId}"
                                aria-expanded="true"
                                aria-controls="collapse-${collapseId}">
                            ${start}. ${item.name}
                           
                        </button>
                         <button onclick="updateExamProfileModal('${item.id}')" class="btn btn-primary btn-sm me-2 btn-edit-exam">
                            <i class="bx bxs-edit"></i>
                            ${TEXTS.COMMON.button.update}
                        </button>
                    </h2>
                    <div id="collapse-${collapseId}"
                         class="accordion-collapse collapse"
                         aria-labelledby="heading-${collapseId}"
                         data-bs-parent="#accordionExamHistory">
                        <div class="accordion-body">
                            <table id="exam-table" class="table custom-table">
                                <thead>
                                    <tr class="d-flex">
                                        <th class="col-3">Vòng thi</th>
                                        <th class="col-3 min-width-150">Môn thi</th>
                                        <th class="col-2 text-center">Hạng</th>
                                        <th class="col-2 min-width-150">Thời gian hoàn thành</th>
                                        <th class="col-2 text-end">Ngày thi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${childItems}
                                   
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                `
        examItems += examItem;
        start++
    }

    $("#accordionExamHistory").html(examItems);
}

// render recent exam history in dashboard tab
function renderRecentExamHistory(examList) {
    var recentExam = "";
    for (var exam of examList) {
        if (exam.children.length > 0) {
            var lastChild = exam.children[exam.children.length - 1];
            var start = UTILS.formatDateMomentJS(lastChild.start, "DD/MM/YYYY")
            var item = `  <tr class="d-flex">
                            <td class="col-5 col-lg-7 col-xl-9">${exam.name}</td>
                            <td class="col-3 col-lg-2 col-xl-1 text-center text-purple-01">#${lastChild.order}</td>
                            <td class="col-4 col-lg-3 col-xl-2 text-end">${start}</td>
                        </tr>`;
            recentExam += item;

        }
    }

    $("#recent-exam-body").html(recentExam);

}

function updateExamProfileModal(id) {
    $("#examId").val(id);
    var url = CONSTANTS.ROUTES.examProfile.getExamProfile + "?id=" + id;
    getExamProfile(url);
    $("#updateExamProfileModal").modal("toggle");

}

function getExamProfile(url) {
    ajaxServices.get(url).then(function (response) {
        if (response != null && response.queryResponse != null) {
            var examProfile = response.queryResponse;
            // set default value for birthDate
            if (!examProfile.dob) {
                $('#examBirthDate').datepicker({
                    autoclose: true,
                    todayHighlight: true,
                    format: 'dd/mm/yyyy',
                    language: 'vi',
                    endDate: new Date()
                }).datepicker("setDate", new Date());
            }
            else {
                var date = UTILS.getDateFromString(examProfile.dob)
                $('#examBirthDate').datepicker({
                    autoclose: true,
                    todayHighlight: true,
                    format: 'dd/mm/yyyy',
                    language: 'vi',
                    endDate: new Date()
                }).datepicker("setDate", date._d);
            }

            // bind province and city if have data
            // find city in list by name
            if (examProfile.city) {
                var findCity = UTILS.findById(examProfile.city, cityList);
                if (findCity) {
                    $("#city").val(findCity.id);

                    // get province
                    if (examProfile.province) {
                        // get province by city id
                        var provinceRequest = {
                            path: findCity.id,
                            type: CONSTANTS.LOCATION_TYPE.province
                        }

                        ajaxServices.post(CONSTANTS.ROUTES.system.getLocations, provinceRequest).then(function (response) {
                            if (response && response.queryResponse) {
                                var locations = response.queryResponse;
                                var list = `<option hidden selected value="">Chọn quận/ huyện</option>`;
                                for (var item of locations) {
                                    var location = `<option value="${item.id}">${item.name}</option>`
                                    list += location;
                                }

                                $("#province").html(list);

                                // find province in list province
                                var findProvince = UTILS.findById(examProfile.province, response.queryResponse);

                                if (findProvince)
                                    $("#province").val(findProvince.id);

                            }
                        }).catch(function (error) {
                        })
                    }
                }
            }

            // bind data 
            $("#examFirstName").val(examProfile.firstName);
            $("#examLastName").val(examProfile.lastName);
            $("#examAddress").val(examProfile.address);
            $("#examClass").val(examProfile.Class);
            $("#examPhone").val(examProfile.phone);
            $("#school").val(examProfile.school);
        }

    }).catch(function (error) {
    })
}

// get city or province
function getLocations(request) {
    if (request.type == CONSTANTS.LOCATION_TYPE.city) {
        $("#city").empty()
    }
    else {
        $("#province").empty()
    }

    ajaxServices.post(CONSTANTS.ROUTES.system.getLocations, request).then(function (response) {
        if (response && response.queryResponse) {
            var locations = response.queryResponse;
            var list = request.type == CONSTANTS.LOCATION_TYPE.city ? `<option hidden selected value="">Chọn tỉnh/ thành phố</option>"` : `<option hidden selected value="">Chọn quận/ huyện</option>`;
            for (var item of locations) {
                var location = `<option value="${item.id}">${item.name}</option>`
                list += location;
            }

            // render city
            if (request.type == CONSTANTS.LOCATION_TYPE.city) {
                cityList = response.queryResponse;
                $("#city").html(list)
            }
            else {
                $("#province").html(list)
            }

        }
    }).catch(function (error) {
    })
}

function changeCity() {
    var cityId = $("#city").val();

    // get province by city id
    var location = {
        path: cityId,
        type: CONSTANTS.LOCATION_TYPE.province
    }
    getLocations(location)
}

$('#updateExamProfileForm').validate({
    rules: {
        'examFirstName': {
            required: true,
        },
        'examLastName': {
            required: true,
        },
        'examPhone': {
            required: true,
        },
        'examBirthDate': {
            required: true
        },
        'examAddress': {
            required: true
        },
        'examClass': {
            required: true
        },

        'school': {
            required: true
        },
        'city': {
            required: true
        },
        'province': {
            required: true
        },
    },
    messages: {
        'examFirstName': {
            required: TEXTS.COMMON.validate.required,
        },
        'examLastName': {
            required: TEXTS.COMMON.validate.required,
        },
        'examBirthDate': {
            required: TEXTS.COMMON.validate.required,
        },
        'examAddress': {
            required: TEXTS.COMMON.validate.required,
        },
        'examPhone': {
            required: TEXTS.COMMON.validate.required,
        },
        'examClass': {
            required: TEXTS.COMMON.validate.required,
        },
        'school': {
            required: TEXTS.COMMON.validate.required,
        },
        'city': {
            required: TEXTS.COMMON.validate.required,
        },
        'province': {
            required: TEXTS.COMMON.validate.required,
        },
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
        error.addClass('text-danger');
        element.closest('.form-group-item').append(error);
    }
});

var isUpdatingExamProfile = false;
$("#updateExamProfileForm input").keypress(function (e) {
    //Event.which == 1 mouse click left and event. which == 13 is enter key.
    if ((e.which == 13 || e.which == 1) && !isUpdatingExamProfile) {
        updateExamProfile();
    }
})

function updateExamProfile() {
    isUpdatingExamProfile = true;
    $("#updateExamProfileForm").valid();
    if ($("#updateExamProfileForm").valid()) {

        var data = {
            address: $("#examAddress").val(),
            dob: $("#examBirthDate").val(),
            firstName: $("#examFirstName").val(),
            lastName: $("#examLastName").val(),
            phone: $("#examPhone").val(),
            class: $("#examClass").val(),
            school: $("#school").val(),
            city: $("#city").val(),
            province: $("#province").val(),
            examId: $("#examId").val()
        }

        ajaxServices.post(CONSTANTS.ROUTES.examProfile.updateExamProfile, data).then(function (response) {
            isUpdatingExamProfile = false;

            if (response != null && response.mutationResponse != null) {
                if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                    toastr.success("Cập nhật thông tin cuộc thi thành công!");
                }
                else {
                    if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.forbidden) {
                        toastr.error("Hết thời gian thi! Không thể cập nhật thông tin!");
                    }
                    else
                        toastr.error(response.mutationResponse.message);
                }
            }

            // close modal
            $("#updateExamProfileModal").modal("toggle");
        }).catch(function (error) {
            isUpdatingExamProfile = false;
        })

    }
}
