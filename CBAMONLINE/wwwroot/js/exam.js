var seameoDb;
var isSendingRequest = false;
var questionArray = [];
var questionSimplebar;
var currentExam;
var questionScrollElement;
var intervalList = [];

$(document).ready(function () {
    seameoDb = new Localbase(CONSTANTS.INDEXEX_DB.seameoDb.name);
    currentExam = examModel;
    console.log(currentExam)
    // render camera
    Webcam.set({
        width: 'auto',
        height: 200,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach('#my-camera');

    // disable copy paste and right click jquery
    //$('body').bind('cut copy paste', function (event) {
    //    event.preventDefault();
    //});

    //$(document).bind("contextmenu", function (e) {
    //    return false;
    //});

    renderSubjects(currentExam.subjects);

    // count down timer
    if (currentExam.subjects.length > 0) {
        var activeSubject = UTILS.findByProp("actived", true, currentExam.subjects);
        if (activeSubject) {
            renderCountDown(activeSubject.timeEnd);

            // countdown
            intervalList[activeSubject.order] = setInterval(function () {
                renderCountDown(activeSubject.timeEnd);
            }, 1000);
        }
    }

    // render question list 
    if (currentExam.quizGroup.length > 0) {
        renderQuestionList(currentExam.quizGroup);

        // render table answered
        renderAnsweredTable();
        renderAnsweredList();
    }

    sessionStorage.removeItem(CONSTANTS.STORAGE_KEY.isPlayingAudio);

    checkAudioPlayed();

    // auto capture screen
    var autoCaptureScreenSeconds = $("#autoCaptureScreenSeconds").val() || CONSTANTS.SYSTEM_SETTINGS.autoCaptureScreenSeconds;
    setInterval(function () {
        takeScreenshot();
    }, autoCaptureScreenSeconds);

    updateScreenPath(currentExam.id);

});

function checkAudioPlayed() {
    $(".wrapper-audio").each(function (index, el) {
        var id = $(el).prop("id");
        var audioId = id.replace("wrapper-", "");

        // find audio
        seameoDb.collection(CONSTANTS.INDEXEX_DB.seameoDb.collections.audio).doc({ id: audioId }).get().then(document => {
            if (document && document.isDone) {
                $("#playing-" + audioId).removeClass("d-none");
                $("#playing-" + audioId).next().hide();
            }
        })
    })
}

function renderSubjects(subjectList) {
    var subjects = "";
    for (var item of subjectList) {
        var activeClass = item.actived ? "active" : "";
        var subject = `<div onclick="nextSubject('${item.order}')" id="${item.id}" data-order="${item.order}" class="exam-subject-item ${activeClass}">${item.name}</div>`
        subjects += subject;
    }

    $("#exam-subject-list").html(subjects);
}

function renderCountDown(date) {
    var timeObj = UTILS.makeTimer(moment(date));
    if (timeObj) {
        if (timeObj.days >= 0) {
            var timeCheck = timeObj.days + ":" + timeObj.hours + ":" + timeObj.minutes + ":" + timeObj.seconds
            var timerHtml = `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`;

            $("#exam-count-down").text(timerHtml);

            if (timeCheck == "00:00:00:00") {
                var activeSubject = $(".exam-subject-item.active");
                var activeOrder = $(activeSubject).data("order");
                if (activeOrder < currentExam.subjects.length) {
                    Swal.fire({
                        position: 'top-center',
                        icon: 'success',
                        title: 'Thời gian làm bài của chủ đề thi này đã hết!',
                        timer: 5000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        html: 'Hệ thống sẽ tự động chuyển sang chủ đề tiếp theo sau <b></b>s !',
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
                            nextSubjectHandle();
                        }
                    })
                }
                else {
                    Swal.fire({
                        position: 'top-center',
                        icon: 'success',
                        title: 'Thời gian làm bài thi đã hết, chúc mừng bạn đã hoàn thành bài thi!',
                        timer: 5000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        html: 'Hệ thống sẽ tự động nộp bài sau <b></b>s !',
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
                            submitExamHandle();
                        }
                    })
                }
            }
        }
        else {

        }
    }
}

function renderQuestionList(questionList) {
    var questions = "";
    var examId = $("#examId").val();
    var count = 1;
    for (var i = 0; i < questionList.length; i++) {
        var item = questionList[i];
        var question = "";
        // single question
        if (item.questions.length == 1) {
            // loop question list
            for (var q of item.questions) {
                var answers = "";
                for (var a of q.answers) {
                    // check box and radio
                    if (q.type == CONSTANTS.QUESTION_TYPE.checkbox || q.type == CONSTANTS.QUESTION_TYPE.radio) {
                        var answer = ` <li class="form-check">
                            <input class="form-check-input"
                                   type="${q.type}"
                                   name="ans-${item.id}-${q.id}"
                                   id="ans-${item.id}-${q.id}-${a.id}"
                                   onclick = "saveAnswerButtonHandle('${q.type}','${item.id}','${q.id}','${a.id}','${count}')"
                                   value="${a.id}" />
                            <label class="form-check-label d-flex" for="ans-${a.id}">
                               <span class="me-2"> ${UTILS.getAnswerLabel(a.order)}.</span> ${a.content}
                            </label>
                        </li>`;
                        answers += answer;
                    }
                    else {
                        if (q.type == CONSTANTS.QUESTION_TYPE.fill) {
                            answers = `<div class="d-flex"><input type="text" id="ans-${item.id}-${q.id}" class="form-control" placeholder="nhập câu trả lời">
                            <button onclick= "saveAnswerButtonHandle('${q.type}','${item.id}','${q.id}','${a.id}','${count}')" class="btn btn-primary"> Lưu </button></div>
                            `
                        }
                    }
                }

                // question write not have answer 
                if (q.type == CONSTANTS.QUESTION_TYPE.write) {
                    answers = `<div><textarea onkeyup="calculateCurrentWord('char-number-${item.id}-${q.id}',this)" placeholder="Nhập câu trả lời" id="ans-${item.id}-${q.id}" class="form-control"> </textarea>
                                 <div class="d-flex justify-content-end write-count mt-1" id="the-count">
                                    <span class="me-1">Số từ:</span><span id="char-number-${item.id}-${q.id}">0</span>
                                 </div>
                                <div class="d-flex  justify-content-end">
                                 <button onclick= "saveAnswerButtonHandle('${q.type}','${item.id}','${q.id}','', '${count}')" class="btn btn-primary mt-2"> Lưu </button>
                                 </div>
                             </div>`;
                }

                var radioPlayer = q.link ? `<div class="wrapper-audio"  id="wrapper-audio-${q.id}"> <div class="d-flex justify-content-between align-items-center"> <i  id="playing-audio-${q.id}" class='bx bx-pause-circle text-purple-01 fs-38 d-none'></i><i onclick="playAudio('audio-${q.id}',this)" class='bx play-audio-icon bx-play-circle text-purple-01 fs-38'></i> <small id="start-time-audio-${q.id}"></small> <span class="audio-progress-bar w-100 mx-2"><progress value="0" max="1" class="progress w-100" id="progress-audio-${q.id}"></progress></span> <small id="end-time-audio-${q.id}"></small></div> 
                 </div>` : "";
                var audio = q.link ? ` <audio id="audio-${q.id}">
                      <source src="${q.link}" type="audio/mpeg">
                      Your browser does not support the audio element.
                    </audio>` : "";
                var description = item.description ? ` <div class=" question-description">
                       ${item.description}
                    </div>` : "";

                var flexCol = q.content.length > 300 ? "flex-column" : "";

                if (item.screen == 1) {

                    question = ` <div id="wrapper-question-${item.id}" class="box-shadow-2 bg-white br-radius-4 mt-3 p-3">
                                        ${radioPlayer}
                                        ${audio}
                                        ${description}
                                        <div class="d-flex">          
                                        <div class="fs-16 me-2 number-question-wrapper ${flexCol}">
                                            <p class="number-question">Câu ${count}:</p>
                                            <div>${q.content}</div>
                                        </div>
                                         </div>
                                        <ul class="answer-list">
                                           ${answers}        
                                        </ul>
                                  </div>`;
                }
                else {
                    question = `<div id="wrapper-question-${item.id}" class="box-shadow-2 bg-white br-radius-4 mt-3 p-2 question-2-screen d-flex">
                                     <div class="question-left box-shadow-2 bg-white br-radius-4 w-50 me-1 p-2">
                                        ${radioPlayer}
                                        ${audio}
                                        ${description}
                                    </div>
                                    <div class="question-right box-shadow-2 bg-white br-radius-4 w-50 ms-1  p-2">
                                       <div class="d-flex">
                                             <div class="fs-16 me-2 number-question-wrapper ${flexCol}">
                                            <p class="number-question">Câu ${count}:</p>
                                            <div>${q.content}</div>
                                        </div>
                                       </div>
                                        <ul class="answer-list">
                                            ${answers}        
                                        </ul>
                                </div></div>`

                }

                questions += question;
                questionArray.push({
                    id: examId + "-" + item.id + "-" + q.id
                })
                count++;
            }
        }
        // group questions
        else {
            var childQuestions = "";
            // loop question list
            for (var q of item.questions) {
                var answers = "";
                for (var a of q.answers) {
                    // check box and radio
                    if (q.type == CONSTANTS.QUESTION_TYPE.checkbox || q.type == CONSTANTS.QUESTION_TYPE.radio) {
                        var answer = ` <li class="form-check">
                            <input class="form-check-input"
                                   type="${q.type}"
                                   name="ans-${item.id}-${q.id}"
                                   id="ans-${item.id}-${q.id}-${a.id}"
                                   onclick = "saveAnswerButtonHandle('${q.type}','${item.id}','${q.id}','${a.id}', '${count}')"
                                   value="${a.id}" />
                            <label class="form-check-label d-flex" for="ans-${a.id}">
                               <span class="me-2"> ${UTILS.getAnswerLabel(a.order)}.</span> ${a.content}
                            </label>
                        </li>`;
                        answers += answer;
                    }
                    else {
                        if (q.type == CONSTANTS.QUESTION_TYPE.fill) {

                            answers = `<div class="d-flex"><input type="text" id="ans-${item.id}-${q.id}" class="form-control" placeholder="nhập câu trả lời">
                            <button onclick= "saveAnswerButtonHandle('${q.type}','${item.id}','${q.id}','${a.id}', '${count}')" class="btn btn-primary"> Lưu </button></div>
                            `
                        }
                    }
                }

                // question write not have answer 
                if (q.type == CONSTANTS.QUESTION_TYPE.write) {
                    answers = `<div><textarea onkeyup="calculateCurrentWord('char-number-${item.id}-${q.id}',this)" placeholder="Nhập câu trả lời" id="ans-${item.id}-${q.id}" class="form-control"> </textarea>
                                <div class="d-flex justify-content-end write-count mt-1">
                                    <span class="me-1">Số từ:</span><span id="char-number-${item.id}-${q.id}">0</span>
                                 </div>               
                                <div class="d-flex  justify-content-end">
                                 <button onclick= "saveAnswerButtonHandle('${q.type}','${item.id}','${q.id}','', '${count}')" class="btn btn-primary mt-2"> Lưu </button>
                                 </div>
                             </div>`;
                }

                var radioPlayerChild = q.link ? `<div class="wrapper-audio"  id="wrapper-audio-${q.id}"> <div class="d-flex justify-content-between align-items-center"> <i  id="playing-audio-${q.id}" class='bx bx-pause-circle text-purple-01 fs-38 d-none'></i><i onclick="playAudio('audio-${q.id}',this)" class='bx play-audio-icon bx-play-circle text-purple-01 fs-38'></i> <small id="start-time-audio-${q.id}"></small> <span class="audio-progress-bar w-100 mx-2"><progress value="0" max="1" class="progress w-100" id="progress-audio-${q.id}"></progress></span> <small id="end-time-audio-${q.id}"></small></div> 
                 </div>` : "";

                var audioChild = q.link ? ` <audio id="audio-${q.id}">
                      <source src="${q.link}" type="audio/mpeg">
                      Your browser does not support the audio element.
                    </audio>` : "";

                var flexCol = q.content.length > 300 ? "flex-column" : "";

                childQuestions += `<li> <div class=" mt-2 p-2">
                                                ${radioPlayerChild}
                                                ${audioChild}
                                                <div class="d-flex">
                                                 <div class="fs-16 me-2 number-question-wrapper ${flexCol}">
                                            <p class="number-question">Câu ${count}:</p>
                                            <div>${q.content}</div>
                                        </div>
                                                 </div>
                                                <ul class="answer-list">
                                                   ${answers}        
                                                </ul>
                                            </div></li> `;
                count++;
                questionArray.push({
                    id: examId + "-" + item.id + "-" + q.id
                })
            }

            var radioPlayer = item.link ? `<div class="wrapper-audio"  id="wrapper-audio-${item.id}"> <div class="d-flex justify-content-between align-items-center"> <i  id="playing-audio-${item.id}" class='bx bx-pause-circle text-purple-01 fs-38 d-none'></i><i onclick="playAudio('audio-${item.id}',this)" class='bx play-audio-icon bx-play-circle text-purple-01 fs-38'></i> <small id="start-time-audio-${item.id}"></small> <span class="audio-progress-bar w-100 mx-2"><progress value="0" max="1" class="progress w-100" id="progress-audio-${item.id}"></progress></span> <small id="end-time-audio-${item.id}"></small></div> 
                 </div>` : "";

            var audio = item.link ? ` <audio id="audio-${item.id}">
                      <source src="${item.link}" type="audio/mpeg">
                      Your browser does not support the audio element.
                    </audio>` : "";

            var description = item.description ? ` <div class=" question-description">
                       ${item.description}
                    </div>` : "";
            if (item.screen == 1) {
                question = ` <div id="wrapper-question-${item.id}" class="box-shadow-2 bg-white br-radius-4 mt-3 p-3">
                                    ${radioPlayer}
                                    ${audio}
                                    <div class="d-flex">
                                    ${description}
                                     </div>
                                    <ul class="child-question-list">
                                    ${childQuestions}
                                    </ul>
                            </div>`;
            }
            else {
                question = `<div id="wrapper-question-${item.id}" class="box-shadow-2 bg-white br-radius-4 mt-3 p-2 question-2-screen d-flex">
                                     <div class="question-left box-shadow-2 bg-white br-radius-4 w-50 me-1 p-2">
                                        ${radioPlayer}
                                        ${audio}
                                        <div class="d-flex">
                                        ${description}
                                         </div>
                                    </div>
                                    <div class="question-right box-shadow-2 bg-white br-radius-4 w-50 ms-1  p-2">
                                       <ul class="child-question-list">
                                        ${childQuestions}
                                       </ul>
                                </div></div>`
            }

            questions += question;


        }

        $(".question-list").html(questions);

        // simple bar question list handle
        questionSimplebar = new SimpleBar(document.getElementById('question-list'));

        questionSimplebar.getScrollElement().addEventListener('scroll', scrollHandler, { passive: true });

        questionScrollElement = questionSimplebar.getScrollElement();
    }
}

function scrollHandler(event) {
    const { scrollHeight, scrollTop, clientHeight } = event.target;
    const isBottomReached = (scrollHeight - Math.round(scrollTop) === clientHeight);

    if (isBottomReached) {
        var activeSubject = $(".exam-subject-item.active");
        var activeOrder = $(activeSubject).data("order");
        if (activeOrder == currentExam.subjects.length) {
            $("#btn-submit-subject").removeClass("d-none")
            $("#btn-next-subject").addClass("d-none")
        }
        else {
            $("#btn-submit-subject").addClass("d-none")
            $("#btn-next-subject").removeClass("d-none")
        }     
        $("#next-subject").removeClass("d-none");
        $("html, body").animate({ scrollTop: $(document).height() }, 0);

    }
    else {
        $("#next-subject").addClass("d-none")
    }
}



// handle audio 
function playAudio(audioId, el) {
    var examId = $("#examId").val();
    var key = examId + "-" + audioId;

    // check if exist one audio playing
    var isAudioPlayingSession = sessionStorage.getItem(CONSTANTS.STORAGE_KEY.isPlayingAudio);
    if (!isAudioPlayingSession) {
        seameoDb.collection(CONSTANTS.INDEXEX_DB.seameoDb.collections.audio).add({
            id: audioId,
            isDone: false
        }, key)

        $("#playing-" + audioId).removeClass("d-none");
        $(el).addClass("d-none");

        var audio = document.getElementById(audioId);
        audio.play();
        var timer;
        sessionStorage.setItem(CONSTANTS.STORAGE_KEY.isPlayingAudio, audioId);

        audio.addEventListener("playing", function (_event) {
            var duration = _event.target.duration;
            advance(duration, audio, timer, "progress-" + audioId);
        });
        audio.addEventListener("pause", function (_event) {
            clearTimeout(timer);
            //$("#progress-" + audioId).hide();
            //$("#wrapper-" + audioId).addClass("d-none");
            sessionStorage.removeItem(CONSTANTS.STORAGE_KEY.isPlayingAudio);

            seameoDb.collection(CONSTANTS.INDEXEX_DB.seameoDb.collections.audio).doc({ id: audioId }).update({
                id: audioId,
                isDone: true
            })
        });

        audio.addEventListener("timeupdate", function () {
            initProgressBar(audioId);
        });

    }
    else {
        toastr.error(TEXTS.COMMON.alert.isAudioPlaying)
    }
}

function advance(duration, element, timer, progressId) {
    var progress = document.getElementById(progressId);
    increment = 10 / duration
    percent = Math.min(increment * element.currentTime * 10, 100);
    progress.style.width = percent + '%'
    startTimer(duration, element, timer, progressId);
}

function startTimer(duration, element, timer, progressId) {
    if (percent < 100) {
        timer = setTimeout(function () { advance(duration, element, timer, progressId) }, 100);
    }
}

// end. handle audio
function saveAnswerButtonHandle(qType, quizId, quesId, answerId, questionIndex) {
    // delay a few second to prevent multiple click
    UTILS.debounce(() => saveAnswer(qType, quizId, quesId, answerId, questionIndex))
}

function saveAnswer(qType, quizId, quesId, answerId, questionIndex) {
    isSendingRequest = true;
    var examId = $("#examId").val();

    $("#question-answered-" + examId + "-" + quizId + "-" + quesId).addClass("complete")
    $("#sumAnsweredText").text($(".ans-check-item.complete").length + "/9")
    var answers = [];

    switch (qType) {
        case CONSTANTS.QUESTION_TYPE.radio:
            answers = [
                {
                    id: answerId,
                    timeAnswer: new Date().toLocaleString(),
                    yourAnswer: answerId
                }
            ]
            break;
        case CONSTANTS.QUESTION_TYPE.checkbox:
            $(`input[name="ans-${quizId}-${quesId}"]:checked`).each(function (index, el) {
                var answer = {
                    id: $(el).val(),
                    timeAnswer: new Date().toLocaleString(),
                    yourAnswer: $(el).val()
                }
                answers.push(answer)
            });

            if (answers.length == 0) {
                $("#question-answered-" + examId + "-" + quizId + "-" + quesId).removeClass("complete")
                $("#sumAnsweredText").text($(".ans-check-item.complete").length + "/9");
            }

            break;
        default:
            if (!$("#ans-" + quizId + "-" + quesId).val()) {
                toastr.error(TEXTS.COMMON.validate.required);
                $("#question-answered-" + questionIndex).removeClass("complete");
                $("#sumAnsweredText").text($(".ans-check-item.complete").length + "/9")
                isSendingRequest = false;
                return;
            }
            answers = [
                {
                    id: answerId,
                    timeAnswer: new Date().toLocaleString(),
                    yourAnswer: $("#ans-" + quizId + "-" + quesId).val()
                }
            ]
            break;
    }

    var data = {
        contestId: $("#exam-contestId").val(),
        id: examId,
        quizId: quizId,
        subjectId: $(".exam-subject-item.active").prop("id"),
        quesId: quesId,
        answers: answers,
        qType: qType
    }

    ajaxServices.post(CONSTANTS.ROUTES.exam.saveAnswer, data).then(function (response) {
        if (response != null && response.mutationResponse != null) {
            if (response.mutationResponse.statusCode == CONSTANTS.STATUS_CODE.ok) {
                var key = examId + "-" + quizId + "-" + quesId;
                // save to indexedDb local
                seameoDb.collection(CONSTANTS.INDEXEX_DB.seameoDb.collections.answer).add({
                    id: key,
                    value: JSON.stringify(data)
                }, key)

                // show popup when click save button for fill and write question type
                if (qType == CONSTANTS.QUESTION_TYPE.fill || qType == CONSTANTS.QUESTION_TYPE.write) {
                    toastr.success(TEXTS.PAGES.exam.alert.saveSuccess)
                }
            }
            else {
                toastr.error(response.mutationResponse.message);
            }
        }
        isSendingRequest = false;
    }).catch(function (error) {
        isSendingRequest = false;
    })
}

function renderAnsweredTable() {
    var answers = "";
    for (var i = 0; i < questionArray.length; i++) {
        var item = questionArray[i];

        var answer = `<div onclick="answerClick('${item.id}')" id="question-answered-${item.id}" class="ans-check-item">${i + 1}</div>`;
        answers += answer;
    }

    $("#listAnswered").html(answers);

    $("#sumAnsweredText").text("0/" + (questionArray.length));
}

function renderAnsweredList() {
    for (var i = 0; i < questionArray.length; i++) {
        var item = questionArray[i];

        seameoDb.collection(CONSTANTS.INDEXEX_DB.seameoDb.collections.answer).doc({ id: item.id }).get().then(document => {
            if (document) {
                var documentParseValue = JSON.parse(document.value);
                var answersOfQuestion = documentParseValue.answers;
                if (answersOfQuestion.length > 0)
                    $("#question-answered-" + documentParseValue.id + "-" + documentParseValue.quizId + "-" + documentParseValue.quesId).addClass("complete")

                switch (documentParseValue.qType) {
                    case CONSTANTS.QUESTION_TYPE.fill:
                        $(`#ans-${documentParseValue.quizId}-${documentParseValue.quesId}`).val(answersOfQuestion[0].yourAnswer)
                        break;

                    case CONSTANTS.QUESTION_TYPE.write:
                        $(`#ans-${documentParseValue.quizId}-${documentParseValue.quesId}`).val(answersOfQuestion[0].yourAnswer);
                        $(`#char-number-${documentParseValue.quizId}-${documentParseValue.quesId}`).text(calculateCurrentWordText(answersOfQuestion[0].yourAnswer));

                        break;

                    case CONSTANTS.QUESTION_TYPE.radio:
                        $(`#ans-${documentParseValue.quizId}-${documentParseValue.quesId}-${answersOfQuestion[0].id}`).prop("checked", true);
                        break;

                    case CONSTANTS.QUESTION_TYPE.checkbox:
                        for (var a of answersOfQuestion) {
                            $(`#ans-${documentParseValue.quizId}-${documentParseValue.quesId}-${a.id}`).prop("checked", true);
                        }
                        break;
                }

                $("#sumAnsweredText").text($(".ans-check-item.complete").length + "/9")

            }
        })
    }

}

function nextSubjectHandle() {
    var activeSubject = $(".exam-subject-item.active");
    var activeOrder = $(activeSubject).data("order");
    var nextOrder = activeOrder + 1;

    if (nextOrder > currentExam.subjects.length) {
        return;
    }

    var data = {
        childId: $("#exam-contestId").val(),
        id: $("#examId").val(),
        subjectId: $(".exam-subject-item.active").prop("id")
    }

    // remove active
    $(".exam-subject-item").removeClass("active");
    $(activeSubject).next().addClass("active");

    // update time end
    ajaxServices.post(CONSTANTS.ROUTES.exam.updateEndTimeSubject, data).then(function (response) {
        if (response != null && response.mutationResponse != null) {
            // clear previous subject countdown
            clearInterval(intervalList[activeOrder]);

            // get next subject questions
            getExam();
        }
        else {
            toastr.error(response.mutationResponse.message);
        }
    }).catch(function (error) {
        toastr.error(TEXTS.COMMON.alert.error.common);
    })
}

function nextSubject(order) {
    if (order) {
        var activeSubject = $(".exam-subject-item.active");
        var activeOrder = $(activeSubject).data("order");

        if (order <= activeOrder) return;
    }
    var answeredNumber = $(".ans-check-item.complete").length;
    Swal.fire({
        title: TEXTS.PAGES.exam.alert.nextSubject,
        text: "Bạn đã làm được " + answeredNumber + "/" + questionArray.length + " câu.",
        showCancelButton: true,
        confirmButtonText: TEXTS.COMMON.button.confirm,
        cancelButtonText: TEXTS.COMMON.button.cancel,
    }).then((result) => {
        if (result.isConfirmed) {
            nextSubjectHandle();
            // scroll top question list
            $(questionScrollElement).animate({
                scrollTop: 0
            }, 500);

        }
    })
}

function getExam() {
    var data = {
        childId: $("#exam-contestId").val(),
        subjectId: $(".exam-subject-item.active").prop("id")
    }

    ajaxServices.post(CONSTANTS.ROUTES.exam.getExam, data).then(function (response) {
        if (response != null && response.queryResponse != null) {
            currentExam = response.queryResponse;
            questionArray = [];
            // count down timer
            if (currentExam.subjects.length > 0) {
                var activeSubject = UTILS.findByProp("actived", true, currentExam.subjects);
                if (activeSubject) {
                    renderCountDown(activeSubject.timeEnd);

                    // countdown
                    intervalList[activeSubject.order] = setInterval(function () {
                        renderCountDown(activeSubject.timeEnd);
                    }, 1000);
                }
            }

            // render question list 
            if (currentExam.quizGroup.length > 0) {
                renderQuestionList(currentExam.quizGroup);

                // render table answered
                renderAnsweredTable();
                renderAnsweredList();
            }

        }
        else {
            toastr.error(TEXTS.COMMON.alert.error.common);
        }
    }).catch(function (error) {
        toastr.error(TEXTS.COMMON.alert.error.common);
    })
}

function submitExam() {
    Swal.fire({
        title: TEXTS.PAGES.exam.alert.submitExam,
        showCancelButton: true,
        confirmButtonText: TEXTS.COMMON.button.confirm,
        cancelButtonText: TEXTS.COMMON.button.cancel
    }).then((result) => {
        if (result.isConfirmed) {
            submitExamHandle();
        }
    })
}

function submitExamHandle() {
    var data = {
        childId: $("#exam-contestId").val(),
        id: $("#examId").val(),
        subjectId: $(".exam-subject-item.active").prop("id")
    }

    // update time end
    ajaxServices.post(CONSTANTS.ROUTES.exam.updateEndTimeSubject, data).then(function (response) {
        if (response != null && response.mutationResponse != null) {
            // go to result page
            window.location.href = CONSTANTS.ROUTES.exam.examResult + window.location.search + "&id=" + $("#examId").val();
        }
        else {
            toastr.error(response.mutationResponse.message);
        }
    }).catch(function (error) {
        toastr.error(TEXTS.COMMON.alert.error.common);
    })
}

function answerClick(id) {
    var idArray = id.split('-');
    var quizId = idArray[1];

    $(questionScrollElement).animate({
        scrollTop: $("#wrapper-question-" + quizId).offset().top - 100
    }, 500);

}

function takeScreenshot() {
    html2canvas(document.body).then(function (canvas) {
        var img = canvas.toDataURL().replace(/^data[:]image\/(png|jpg|jpeg)[;]base64,/i, "");
        var data = {
            imageData: img,
            examId: $("#examId").val()
        }

        // update time end
        ajaxServices.post(CONSTANTS.ROUTES.exam.uploadScreenshot, data).then(function (response) {
            console.log(response);
        }).catch(function (error) {
        })
    });

}

function updateScreenPath(examId) {
    var data = {
        childId: $("#exam-contestId").val(),
        subjectId: $(".exam-subject-item.active").prop("id"),
        screenPath: examId
    }

    ajaxServices.post(CONSTANTS.ROUTES.exam.getExam, data).then(function (response) {
        if (response != null && response.queryResponse != null) {

        }
        else {
            toastr.error(TEXTS.COMMON.alert.error.common);
        }
    }).catch(function (error) {
        toastr.error(TEXTS.COMMON.alert.error.common);
    })
}

$("body").on("click", ".bx-pause-circle", function () {
    toastr.warning(TEXTS.PAGES.exam.alert.playedAudio)
})

// progress audio
function initProgressBar(audio) {
    var player = document.getElementById(audio);
    var length = player.duration
    var current_time = player.currentTime;

    // calculate total length of value
    var totalLength = calculateTotalValue(length)
    document.getElementById("end-time-" + audio).innerHTML = totalLength;

    // calculate current value time
    var currentTime = calculateCurrentValue(current_time);
    document.getElementById("start-time-" + audio).innerHTML = currentTime;

    var progressbar = document.getElementById('progress-' + audio);
    progressbar.value = (player.currentTime / player.duration);
    //progressbar.addEventListener("click", seek);

    //if (player.currentTime == player.duration) {
    //    document.getElementById('play-btn').className = "";
    //}

    //function seek(event) {
    //    var percent = event.offsetX / this.offsetWidth;
    //    player.currentTime = percent * player.duration;
    //    progressbar.value = percent / 100;
    //}
};

function calculateTotalValue(length) {
    var minutes = Math.floor(length / 60),
        seconds_int = length - minutes * 60,
        seconds_str = seconds_int.toString(),
        seconds = seconds_str.substr(0, 2);
    seconds = Math.floor(seconds);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    var time = minutes + ':' + seconds
    return time;
}

function calculateCurrentValue(currentTime) {
    var current_hour = parseInt(currentTime / 3600) % 24,
        current_minute = parseInt(currentTime / 60) % 60,
        current_seconds_long = currentTime % 60,
        current_seconds = current_seconds_long.toFixed(),
        current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);
    return current_time;
}

// end. progress audio
function calculateCurrentWord(id, el) {
    var words = 0;

    if (($(el).val().match(/\S+/g)) != null) {
        words = $(el).val().match(/\S+/g).length;
    }

    $("#" + id).text(words);
}

function calculateCurrentWordText(texts) {
    var words = 0;

    if (texts) {
        words = texts.match(/\S+/g).length;
    }

    return words;
}












