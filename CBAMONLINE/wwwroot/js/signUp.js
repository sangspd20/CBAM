var isSigningUp = false;
$("#signUpForm input").keypress(function (e) {
    //Event.which == 1 mouse click left and event. which == 13 is enter key.
    if ((e.which == 13 || e.which == 1) && !isSigningUp) {
        signUp();
    }
})


function signUp() {
    isSigningUp = true;
    if ($("#signUpForm").valid()) {
        var data = $("#signUpForm").serialize();

        $.ajax({
            url: CONSTANTS.ROUTES.auth.signUp,
            type: "POST",
            data: data,
            success: function (response) {
                isSigningUp = false;
                if (response != null && response.mutationResponse != null) {
                    if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                        Swal.fire({
                            position: 'top-center',
                            icon: 'success',
                            title: 'Xin chúc mừng tài khoản của bạn đã được tạo thành công',
                            timer: 5000,
                            timerProgressBar: true,
                            allowOutsideClick: false,
                            html: 'Hệ thống sẽ chuyển sang trang login sau <b></b>s !',
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
                                window.location.href = CONSTANTS.ROUTES.auth.login
                            }
                        })
                    }
                    else {
                        toastr.error(response.mutationResponse.message);
                    }
                }
            },
            error: function (request, status, error) {
                isSigningUp = false;
                console.log(request.responseText);
            }

        });
    }
    else {
        isSigningUp = false
    }
}