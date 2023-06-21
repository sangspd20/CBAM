(function ($) {
    "use strict"; // Start of use strict
    // js for step
    var totalSteps = $(".steps li").length;

    activeTab(1);

    $(".step-content").on("click", ".next", function () {
        var id = $(this).prop("id");
        if (id != "finish-capture-image") {
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

}(jQuery, this));

$(document).ready(function () {
    // validate registered and finished exam
    validateExam();
    // render count down time to start contest
    var timeStart = $("#timeStart").val();
    if (timeStart)
        renderCountDown(timeStart);

    // countdown
    setInterval(function () {
        renderCountDown(timeStart);
    }, 1000);
});

function validateExam() {
    // check registered
    var isRegisted = $("#isRegisted").val();
    if (isRegisted == CONSTANTS.BOOLEAN_TEXTS.false) {
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: TEXTS.PAGES.home.alert.notRegisterExam,
            timer: 5000,
            timerProgressBar: true,
            allowOutsideClick: false,
            html: 'Hệ thống sẽ chuyển sang trang chủ sau <b></b>s !',
            didOpen: () => {
                var time = 5;
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                b.textContent = 5;
                timerInterval = setInterval(() => {
                    b.textContent = time - 1;
                    time = time - 1;
                }, 1000)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                window.location.href = CONSTANTS.ROUTES.home.index;
            }
        })

        return;
    }

    // check finished
    var finished = $("#finished").val();
    if (finished == CONSTANTS.BOOLEAN_TEXTS.true) {
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: TEXTS.PAGES.home.alert.examDone,
            timer: 5000,
            timerProgressBar: true,
            allowOutsideClick: false,
            html: 'Hệ thống sẽ chuyển sang trang chủ sau <b></b>s !',
            didOpen: () => {
                var time = 5;
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                b.textContent = 5;
                timerInterval = setInterval(() => {
                    b.textContent = time - 1;
                    time = time - 1;
                }, 1000)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                window.location.href = CONSTANTS.ROUTES.home.index;
            }
        })

        return;
    }

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

function showCamera(el) {
    $("#results").addClass("d-none");
    $("#my-camera").removeClass("d-none");

    var isCheckAgree = $("#agreeCapture").is(":checked");
    if (!isCheckAgree) {
        Swal.fire(TEXTS.PAGES.examReady.alert.agreeCapture)
    }
    else {
        // render camera
        Webcam.set({
            width: 400,
            height: 298,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach('#my-camera');

        $("#camera-icon").hide();
        $("#my-camera").removeClass("d-none")
        $(el).addClass("d-none");
        $("#take-photo").removeClass("d-none");
    }
}

function capturePhoto() {
    // take snapshot and get image data
    Webcam.snap(function (data_uri) {
        // display results in page
        $("#results").html('<img src="' +
            data_uri +
            '"/>');

        $("#my-camera").addClass("d-none");
        $("#take-photo").addClass("d-none");
        $("#show-camera").removeClass("d-none")
        $("#results").removeClass("d-none");

        Webcam.upload(data_uri,
            '/ExamProfile/Capture?id=' + $("#contestId").val(),
            function (code, text) {

            });
    });
}

function finishCapture() {
    var avatar = $("#avatar").val();
    if (!avatar) {
        // check option must have take photo when ready for contest
        var isMustCapturePhoto = $("#isMustCapturePhoto").val().toLowerCase();
        if (isMustCapturePhoto == "true") {
            if (!$("#results").html()) {
                Swal.fire(TEXTS.PAGES.examReady.alert.takeCapture)
            }
            else {
                activeTab(3);
                removeActiveTab(2);
            }
        }
        else {
            activeTab(3);
            removeActiveTab(2);
        }
    }
    else {
        activeTab(3);
        removeActiveTab(2);
    }

}

function renderCountDown(date) {
    var timeObj = UTILS.makeTimer(moment(date));
    if (timeObj) {
        if (timeObj.days >= 0) {
            var timeCheck = timeObj.days + ":" + timeObj.hours + ":" + timeObj.minutes + ":" + timeObj.seconds
            var timerHtml = `                                    
                                            <span class="count-down-item">${timeObj.minutes}</span>
                                            <span class="count-down-item">${timeObj.seconds}</span>`;

            $("#count-down-ready").html(timerHtml);

            if (timeCheck == "00:00:00:00") {
                $("#count-down-ready").hide();
                $("#btn-start-contest").removeClass("d-none")
            }
        }
        else {
            $("#count-down-ready").hide();
            $("#btn-start-contest").removeClass("d-none")
        }
    }
}

function startExercise() {
    window.location.href = CONSTANTS.ROUTES.exam.index + "?childId=" + $("#childId").val()
}





