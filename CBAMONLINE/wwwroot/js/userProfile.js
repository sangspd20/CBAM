$(document).ready(function () {
    // update current page text when click link 
    $(".nav-link").click(function () {
        $("#currentPage").text($(this).text())
        sessionStorage.setItem(CONSTANTS.STORAGE_KEY.userCurrentTab, $(this).text().trim());
    })
    checkActiveTab();

    // set default value for birthDate
    if (!userProfile.dob) {
        $('#birthDate').datepicker({
            autoclose: true,
            todayHighlight: true,
            format: 'dd/mm/yyyy',
            language: 'vi',
            endDate: new Date()
        }).datepicker("setDate", new Date());
    }
    else {
        $('#birthDate').datepicker({
            autoclose: true,
            todayHighlight: true,
            format: 'dd/mm/yyyy',
            language: 'vi',
            endDate: new Date()
        })
    }

    // set default checked for checkbok gender
    if (userProfile.gender) {
        if (userProfile.gender.toLowerCase() == "nam")
            $("input[name=gender][value='Nam']").prop("checked", true);
        else
            $("input[name=gender][value='Nữ']").prop("checked", true);
    }
    else {
        $("input[name=gender][value='Nam']").prop("checked", true);
    }

    checkAfterUpdateProfile();
});

function checkAfterUpdateProfile() {
    var reloadUserProfile = sessionStorage.getItem(CONSTANTS.STORAGE_KEY.reloadUserProfile);
    if (reloadUserProfile) {
        toastr.success("Cập nhật thông tin tài khoản thành công!");
        sessionStorage.removeItem(CONSTANTS.STORAGE_KEY.reloadUserProfile);
    }
}

function checkActiveTab() {
    var currentTab = sessionStorage.getItem(CONSTANTS.STORAGE_KEY.userCurrentTab);
    if (currentTab) {
        $(".nav-link").each(function (index, el) {
            if ($(el).text().trim() == currentTab) {
                $(el).click();
            }
        })
    }
    else {
        $("#home-tab").click();
    }
}

// change passWord
$('#changePasswordForm').validate({
    rules: {
        'oldPassword': {
            required: true
        },
        'newPassword': {
            required: true,
        },

        'confirmNewPassword': {
            required: true,
            equalTo: "#newPassword"
        }
    },
    messages: {
        'oldPassword': {
            required: TEXTS.COMMON.validate.required,
        },
        'newPassword': {
            required: TEXTS.COMMON.validate.required,
        },
        'confirmNewPassword': {
            required: TEXTS.COMMON.validate.required,
            equalTo: 'Mật khẩu mới không trùng khớp',
        },
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
        error.addClass('text-danger');
        element.closest('.form-group-item').append(error);
    }
});

var isChangingPassword = false;
$("#changePasswordForm input").keypress(function (e) {
    //Event.which == 1 mouse click left and event. which == 13 is enter key.
    if ((e.which == 13 || e.which == 1) && !isChangingPassword) {
        changePassword();
    }
})


function changePassword() {
    isChangingPassword = true;
    $("#changePasswordForm").valid();

    if ($("#changePasswordForm").valid()) {
        var data = {
            oldPassword: $("#oldPassword").val(),
            newpassword: $("#newPassword").val(),
        }

        ajaxServices.post(CONSTANTS.ROUTES.auth.changePassword, data).then(function (response) {
            isChangingPassword = false;

            resetChangePasswordForm();
            if (response != null && response.mutationResponse != null) {
                if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                    toastr.success("Đổi mật khẩu thành công!");
                }
                else {
                    toastr.error(response.mutationResponse.message);
                }
            }
        }).catch(function (error) {
            isChangingPassword = false;
        })
    }
}

function resetChangePasswordForm() {
    $("#oldPassword").val("");
    $("#newPassword").val("");
    $("#confirmNewPassword").val("");
}

// end. change passWord

// update profile
$('#updateProfileForm').validate({
    rules: {
        'email': {
            required: true,
            email: true
        },
        'firstName': {
            required: true,
        },
        'lastName': {
            required: true,
        },
        'phone': {
            required: true,
        },
        'birthDate': {
            required: true
        },
        'address': {
            required: true
        },
    },
    messages: {
        'email': {
            required: TEXTS.COMMON.validate.required,
            email: TEXTS.COMMON.validate.email
        },
        'firstName': {
            required: TEXTS.COMMON.validate.required,
        },
        'lastName': {
            required: TEXTS.COMMON.validate.required,
        },
        'birthDate': {
            required: TEXTS.COMMON.validate.required,
        },
        'address': {
            required: TEXTS.COMMON.validate.required,
        },
        'phone': {
            required: TEXTS.COMMON.validate.required,
        },
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
        error.addClass('text-danger');
        element.closest('.form-group-item').append(error);
    }
});

var isUpdatingProfile = false;
$("#updateProfileForm input").keypress(function (e) {
    //Event.which == 1 mouse click left and event. which == 13 is enter key.
    if ((e.which == 13 || e.which == 1) && !isUpdatingProfile) {
        updateProfile();
    }
})

function updateProfile() {
    isUpdatingProfile = true;
    $("#updateProfileForm").valid();

    if ($("#updateProfileForm").valid()) {

        var data = {
            address: $("#address").val(),
            avatar: "",
            dob: $("#birthDate").val(),
            email: $("#email").val(),
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            gender: $('input[name="gender"]:checked').val(),
            phone: $("#phone").val(),
            price: 1,
            status: 1,
            userName: $("#userName").val(),
            avatar: userProfile.avatar
        }

        var formData = new FormData();
        formData.append("data", JSON.stringify(data));
        formData.append("avatar", $("#avatar-file")[0].files[0]);

        $.ajax({
            url: CONSTANTS.ROUTES.userProfile.updateProfile,
            type: 'post',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                isUpdatingProfile = false;

                if (response != null && response.mutationResponse != null) {
                    if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                        sessionStorage.setItem(CONSTANTS.STORAGE_KEY.reloadUserProfile, true)
                        window.location.reload();
                    }
                    else {
                        toastr.error(response.mutationResponse.message);
                    }
                }
            },
            error: function (error) {
                isUpdatingProfile = false;
            }
        })
    }
}
// end. update profile

function chooseImage() {
    $("#avatar-file").click();
}

function previewFile(input) {
    var file = $("#avatar-file").get(0).files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function () {
            $("#avatar-image").attr("src", reader.result);
            $("#avatar-file-name").text(file.name)

        }

        reader.readAsDataURL(file);
    }
}
