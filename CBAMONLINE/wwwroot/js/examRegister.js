(function ($) {
    "use strict"; // Start of use strict
    // js for step
    var totalSteps = $(".steps li").length;

    var contestDone = sessionStorage.getItem(CONSTANTS.STORAGE_KEY.contestDone);
    // check when refresh after resgiter done
    if (contestDone)
        activeTab(3);
    else
        activeTab(1);

    $(".step-content").on("click", ".next", function () {
        var id = $(this).prop("id");
        if (id != "register-contest-btn") {
            $(".steps li").eq($(this).parents(".step-content").index() - totalSteps).addClass('done').removeClass('active');
            $(".steps li").eq($(this).parents(".step-content").index() + 1).addClass("active");
            $(this).parents(".step-content").removeClass("active").next().addClass("active");
        }
    });

    $(".step-content").on("click", ".back", function () {
        $(".steps li").eq($(this).parents(".step-content").index() - totalSteps).removeClass("active");
        $(".steps li").eq($(this).parents(".step-content").index() - 1).addClass("active").removeClass('done');
        $(this).parents(".step-content").removeClass("active").prev().addClass("active");
    });

    $('#examBirthDate').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        language: 'vi',
        endDate: new Date()
    })

}(jQuery, this));

var cityList = [];
$(document).ready(function () {
    // get city list
    var location = {
        path: "",
        type: CONSTANTS.LOCATION_TYPE.city
    }
    getLocations(location);

});

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
function registerContest() {
    $("#updateExamProfileForm").valid();

    if ($("#updateExamProfileForm").valid()) {

        var profile = {
            address: $("#examAddress").val(),
            dob: $("#examBirthDate").val(),
            firstName: $("#examFirstName").val(),
            lastName: $("#examLastName").val(),
            phone: $("#examPhone").val(),
            class: $("#examClass").val(),
            school: $("#school").val(),
            city: $("#city").val(),
            province: $("#province").val(),
        }

        var data = {
            profile: profile,
            contestId: $("#contestId").val()
        }

        ajaxServices.post(CONSTANTS.ROUTES.examProfile.registerExam, data).then(function (response) {
            if (response != null && response.mutationResponse != null) {
                var statusCode = response.mutationResponse.statusCode;
                if (statusCode == CONSTANTS.STATUS_CODE.ok) {
                    activeTab(3)
                    removeActiveTab(2);
                    sessionStorage.setItem(CONSTANTS.STORAGE_KEY.contestDone, $("#contestId").val());
                }
                else {
                    if (statusCode == CONSTANTS.STATUS_CODE.forbidden) {
                        sessionStorage.setItem(CONSTANTS.STORAGE_KEY.userCurrentTab, TEXTS.LAYOUTS.tabs.pay);
                        window.location.href = CONSTANTS.ROUTES.userProfile.index;
                    } else {
                        toastr.error(response.mutationResponse.message);
                    }
                }
            }
        }).catch(function (error) {
        })

    }
}

function activeTab(number) {
    $(`.steps li:nth-of-type(${number})`).addClass("active");
    $(`.step-wrapper .step-content:nth-of-type(${number})`).addClass("active");
}

function removeActiveTab(number) {
    $(`.steps li:nth-of-type(${number})`).removeClass("active");
    $(`.step-wrapper .step-content:nth-of-type(${number})`).removeClass("active");
}

function registerDone() {
    window.location.href = CONSTANTS.ROUTES.home.index;
    sessionStorage.removeItem(CONSTANTS.STORAGE_KEY.contestDone);
}





