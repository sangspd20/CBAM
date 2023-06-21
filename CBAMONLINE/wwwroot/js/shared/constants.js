const CONSTANTS = {
    CONTEST_MODE: {
        exam: "exam",
        test: "test",
        all: ""
    },

    STORAGE_KEY: {
        userCurrentTab: "userCurrentTab",
        contestName: "contestName",
        contestDone: "contestDone",
        reloadUserProfile: "reloadUserProfile",
        timeStart: "timeStart",
        isPlayingAudio: "isPlayingAudio",
    },

    TEXT: {
        validate: {
            required: "Vui lòng nhập thông tin!",
            email: "Vui lòng nhập đúng định dạng email!"
        },

        button: {
            update: "Thay đổi"
        }
    },

    STATUS_CODE: {
        ok: 200,
        notFound: 404,
        forbidden: 403
    },

    ROUTES: {
        auth: {
            changePassword: "/Auth/ChangePassword",
            signUp: "/Auth/SignUp",
            login: "/Auth/Login",
            resetPassword: "/Auth/ResetPassword"
        },

        userProfile: {
            updateProfile: "/UserProfile/UpdateProfile",
            index: "/UserProfile/Index"
        },

        examHistory: {
            getExamHistoryPaging: "/ExamHistory/GetExamHistoryPaging"
        },

        examProfile: {
            getExamProfile: "/ExamProfile/GetExamProfile",
            updateExamProfile: "/ExamProfile/UpdateExamProfile",
            examRegister: "/ExamProfile/ExamRegister",
            registerExam: "/ExamProfile/RegisterExam",
            examReady: "/ExamProfile/ExamReady"
        },

        system: {
            getLocations: "/System/GetLocations"
        },

        notification: {
            getNotificationPaging: "/Notification/GetNotificationPaging",
            updateIsReadNotification: "/Notification/updateIsReadNotification",
            updateIsReadAllNotification: "/Notification/UpdateIsReadAllNotification",
            deleteNotification: "/Notification/DeleteNotification",
            getNotification: "/Notification/GetNotification",
        },

        payment: {
            createPayment: "/Payment/CreatePayment",
            updatePayment: "/Payment/UpdatePayment",
        },

        vnpay: {
            createPaymentUrl: "/Vnpay/CreatePaymentUrl"
        },

        home: {
            index: "/Home/Index"
        },
        contest: {
            getContestDetail: "/Contest/GetContestDetail",
            getContestScoresDetailPaging: "/Contest/GetContestScoresDetailPaging",
            getContestWithPaging: "/Contest/GetContestWithPaging",
            scoreBoardDetail: "/Contest/ScoreBoardDetail"
        },

        exam: {
            index: "/Exam/Index",
            saveAnswer: "/Exam/SaveAnswer",
            updateEndTimeSubject: "/Exam/UpdateEndTimeSubject",
            getExam: "/Exam/GetExam",
            examResult: "/Exam/ExamResult",
            uploadScreenshot: "/Exam/UploadScreenshot"

        }
    },

    PAGING: {
        pageSize: 10,
        visiblePages: 5
    },

    LOCATION_TYPE: {
        city: "city",
        province: "province"
    },

    QUESTION_TYPE: {
        checkbox: "checkbox",
        radio: "radio",
        fill: "fill",
        write: "write"
    },

    INDEXEX_DB: {
        seameoDb: {
            name: "seameoDb",
            collections: {
                audio: "audio",
                answer: "answer"
            }
        }

    },

    SYSTEM_SETTINGS: {
        autoCaptureScreenSeconds: 5000
    },

    BOOLEAN_TEXTS: {
        true: "true",
        false: "false"
    }

}
