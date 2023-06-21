const UTILS = {
    makeTimer: function (endTime) {
        endTime = (Date.parse(endTime) / 1000);

        var now = new Date();
        now = (Date.parse(now) / 1000);

        var timeLeft = endTime - now;

        var days = Math.floor(timeLeft / 86400);
        var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
        var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
        var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

        if (days < "10") { days = "0" + days; }
        if (hours < "10") { hours = "0" + hours; }
        if (minutes < "10") { minutes = "0" + minutes; }
        if (seconds < "10") { seconds = "0" + seconds; }

        var objTime = {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }
        return objTime
    },

    formatDateMomentJS: function (date, format) {
        return moment(date).format(format)
    },

    // DD/MM/YYYY
    formatDateMomentJSDefault: function (date) {
        return moment(date).format("DD/MM/YYYY")
    },

    getWeekDayName: function (date) {
        var weekDay = moment(date).isoWeekday();
        var weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
        return weekDays[weekDay - 1];
    },

    // dd/mm/yyyy format
    getDateFromString: function (dateString) {
        dateString = dateString.split('/').reverse().join('-');
        return moment(dateString);
    },

    findById: function (id, array) {
        var result;
        for (var i in array) {
            if (array[i].id == id) {
                result = array[i];
                break;
            }
        }

        return result;
    },

    findByProp: function (prop, val, array) {
        var result;
        for (var i in array) {
            if (array[i][prop] == val) {
                result = array[i];
                break;
            }
        }

        return result;
    },

    sortByKeyDesc: function (array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    },

    sortByKeyAsc: function (array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    },

    addLoading: function (id, blockId) {
        $("#" + id).removeClass("d-none");
        $("#" + blockId).hide();
    },

    removeLoading: function (id, blockId) {
        $("#" + id).addClass("d-none")
        $("#" + blockId).show();

    },

    disablePaginationClick: function (id) {
        $("#" + id + " .page-item").addClass("disabled-click");
    },

    enablePaginationClick: function (id) {
        $("#" + id + " .page-item").removeClass("disabled-click");

    },

    getAnswerLabel: function (order) {
        var answerLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        return answerLabels[order - 1];
    },

    checkIndexedDbExisted: function (dbName) {
        var dbExists = true;
        var request = window.indexedDB.open(dbName);
        request.onupgradeneeded = function (e) {
            e.target.transaction.abort();
            dbExists = false;
            return dbExists;
        }

        return dbExists;
    },

    debounce: function (func, within = 500, timerId = null) {
        window.callOnceTimers = window.callOnceTimers || {};
        if (timerId == null)
            timerId = func;
        var timer = window.callOnceTimers[timerId];
        clearTimeout(timer);
        timer = setTimeout(() => func(), within);
        window.callOnceTimers[timerId] = timer;
    }


}
