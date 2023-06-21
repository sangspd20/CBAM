const sweetAlertService = {
    success: function (title,text) {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
        })
    },
    error: function (title, text) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
        })
    },
    warning: function (title, text) {
        Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
        })
    },

    info: function (title, text) {
        Swal.fire({
            icon: 'info',
            title: title,
            text: text,
        })
    }
}
