$(document).ready(function () {
});

// update profile
$('#cardForm').validate({
    rules: {
        'cardEmail': {
            required: true,
            email: true
        },
        'cardFirstName': {
            required: true,
        },
        'cardLastName': {
            required: true,
        },
        'cardPhone': {
            required: true,
        },
        'cardAmount': {
            required: true,
            min: 10000
        },
    },
    messages: {
        'cardEmail': {
            required: TEXTS.COMMON.validate.required,
            email: TEXTS.COMMON.validate.email
        },
        'cardFirstName': {
            required: TEXTS.COMMON.validate.required,
        },
        'cardLastName': {
            required: TEXTS.COMMON.validate.required,
        },
        'cardPhone': {
            required: TEXTS.COMMON.validate.required,
        },
        'cardAmount': {
            required: TEXTS.COMMON.validate.required,
            min : "Vui lòng nhập số tiền >= 10000"
        },
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
        error.addClass('text-danger');
        element.closest('.form-group-item').append(error);
    }
});


function createPayment() {
    $("#cardForm").valid();

    if ($("#cardForm").valid()) {

        var data = {
            email: $("#cardEmail").val(),
            name: $("#cardLastName").val() + " " + $("#cardFirstName").val(),
            phone: $("#cardPhone").val(),
            amount: $("#cardAmount").val(),
        }

        ajaxServices.post(CONSTANTS.ROUTES.payment.createPayment, data).then(function (response) {
            if (response != null && response.mutationResponse != null) {
                if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                    var createPaymentUrlRequest = {
                        Name: data.name,
                        Amount: Number(data.amount),
                        Id: response.mutationResponse.message
                    }
                    vnPayCreatePaymentUrl(createPaymentUrlRequest)
                }
                else {
                    toastr.error(response.mutationResponse.message);
                }
            }     
        }).catch(function (error) {
        })
       
    }
}

function vnPayCreatePaymentUrl(data) {
    ajaxServices.post(CONSTANTS.ROUTES.vnpay.createPaymentUrl, data).then(function (response) {
        if (response) {
            window.open(response.url,"_self");
        }    
    }).catch(function (error) {
    })
}

// end. update profile