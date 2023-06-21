(function ($) {
    "use strict"; // Start of use strict

    $(document).ready(function () {
        if ($("#isShowAdsModal").val().toLowerCase() == CONSTANTS.BOOLEAN_TEXTS.true) {
            $("#adsModal").modal("show")
        }

        renderContest();
        // Event
        $('#event-grid').isotope({
            itemSelector: '.event-item',
        });

        // filter items on button click
        $('.event-filter-button').on('click', 'li.filter-button', function () {
            var filterValue = $(this).attr('data-filter');
            $('#event-grid').isotope({
                filter: filterValue
            });
            $('.event-filter-button li.filter-button').removeClass('active');
            $(this).addClass('active');
        });

        // Document
        $('#document-grid').isotope({
            itemSelector: '.document-item',
            filter: '.' + $("#first-libs").val()
        });

        // filter items on button click
        $('.document-filter-button').on('click', 'li.filter-button', function () {
            var filterValue = $(this).attr('data-filter');
            $('#document-grid').isotope({
                filter: filterValue
            });
            $('.document-filter-button li.filter-button').removeClass('active');
            $(this).addClass('active');
        });

        // Document
        $('#document-filter').slick({
            slidesToShow: 5,
            slidesToScroll: 5,
            autoplay: false,
            dots: false,
            mobileFirst: true,
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                },
            },
            {
                breakpoint: 1008,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 300,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            }

            ]
        });

        // Rating
        $('#rating-slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            dots: false,
            pauseOnHover: true,
        });

    });

    function renderContest() {
        if (contestArray.length > 0) {
            console.log(contestArray)
            var contests = "";
            var count = 1;
            for (var item of contestArray) {
                var contestItem = "";
                // exam mode
                var isShow = count <= 6 ? "" : "d-none";
                if (item.mode == CONSTANTS.CONTEST_MODE.exam) {
                    var btnClass = item.isRegisted ? "btn-join" : "btn-register";
                    var btnName = item.isRegisted ? "Tham gia" : "Đăng ký";
                    contestItem = `<div class="col-sm-6 col-xxl-4 px-i-15 mt-abs-30 event-item ${item.mode} ${isShow}" id="contest-${item.id}">
                        <div class="box-item-home box-event">
                            <div class="box-block">
                                <div class="box-inside">
                                    <img src="/images/event-img.png" alt="${item.name}" class="img-fluid" />
                                </div>
                            </div>
                            <div class="event-content">
                                <div class="d-flex align-items-center">
                                    <div class="event-count-people">
                                        <i class="fa fa-users" aria-hidden="true"></i> ${item.registered} người
                                    </div>
                                    <div id="count-down-time-contest-${item.id}" class="count-down-time ms-auto">
                                    </div>
                                </div>
                                <div class="py-abs-20 d-flex align-items-start">
                                    <div id="contest-calender-${item.id}" class="event-calendar">
                                    </div>
                                    <div class="fs-16 flex-fill">
                                        <div class="event-title">${item.name}</div>
                                        <div class="event-description">
                                            ${item.description}
                                        </div>
                                    </div>
                                </div>
                                <button onclick="handleContestEvent(this,'${item.id}','${item.name}','${item.mode}','${item.slug}','${item.timeStart}','${item.isRegisted}','${item.finished}')" id="contest-btn-${item.id}" class="btn w-100 ${btnClass}">
                                    ${btnName}
                                </button>
                            </div>
                        </div>
                    </div>`;
                }// test mode
                else {
                    contestItem = `<div class="col-sm-6  col-xxl-4 px-i-15 mt-abs-30 event-item  ${item.mode} ${isShow}" id="contest-${item.id}">
						<div class="box-item-home box-event">
							<div class="box-block">
								<div class="box-inside">
									<img src="/images/event-img.png" alt="${item.name}" class="img-fluid">
								</div>
							</div>
							<div class="event-content">
								<div class="d-flex align-items-center">
									<div class="event-count-people">
										<i class="fa fa-users" aria-hidden="true"></i> ${item.registered} người
									</div>
								</div>
								<div class="py-abs-20 d-flex align-items-start">
									<div class="fs-16 flex-fill">
										<div class="event-title">${item.name}</div>
										<div class="event-description">
                                            ${item.description}
										</div>
									</div>
								</div>
								<button onclick="handleContestEvent(this,'${item.id}','${item.name}','${item.mode}','${item.slug}','${item.timeStart}','${item.isRegisted}','${item.finished}')" class="btn w-100 btn-join">
									Tham gia
								</button>
							</div>
						</div>
					</div>`
                }
                contests += contestItem;
                count++;

            }
            $("#event-grid").html(contests);

            // countdown
            setInterval(function () {
                for (var contest of contestArray) {
                    if (contest.mode == CONSTANTS.CONTEST_MODE.exam) {
                        if (!contest.isRegisted) {
                            // engRegister not time up
                            if (moment(contest.endRegister) > moment()) {
                                renderCalendar(contest.endRegister, contest.id)
                                renderCountDown(contest.endRegister, contest.id);
                            } // engRegister  time up -> check timeStart
                            else {
                                $(`#contest-btn-${contest.id}`).removeClass("btn-register")
                                $(`#contest-btn-${contest.id}`).addClass("btn-join")

                                // timeStart not time up before 30 minute
                                if (moment(contest.timeStart).subtract(30, 'minutes') > moment()) {
                                    $(`#contest-btn-${contest.id}`).text("Chuẩn bị vào thi")
                                }
                                else {
                                    $(`#contest-btn-${contest.id}`).text("Tham gia")
                                }

                                renderCalendar(contest.timeStart, contest.id)
                                renderCountDown(contest.timeStart, contest.id);
                            }
                        }
                        // registered
                        else {
                            $(`#contest-btn-${contest.id}`).removeClass("btn-register")
                            $(`#contest-btn-${contest.id}`).addClass("btn-join");

                            // timeStart not time up before 30 minute
                            if (moment(contest.timeStart).subtract(30, 'minutes') > moment()) {
                                $(`#contest-btn-${contest.id}`).text("Chuẩn bị vào thi")
                            }
                            else {
                                $(`#contest-btn-${contest.id}`).text("Tham gia")
                            }

                            renderCalendar(contest.timeStart, contest.id)
                            renderCountDown(contest.timeStart, contest.id);
                        }
                    }
                }
            }, 1000);

        }

    }

    function renderCountDown(date, id) {
        var timeObj = UTILS.makeTimer(moment(date));
        if (timeObj) {
            if (timeObj.days >= 0) {
                var timeCheck = timeObj.days + ":" + timeObj.hours + ":" + timeObj.minutes + ":" + timeObj.seconds
                var timerHtml = `<span class="count-down-item">${timeObj.days}</span>
                                            <span class="count-down-item">${timeObj.hours}</span>
                                            <span class="count-down-item">${timeObj.minutes}</span>
                                            <span class="count-down-item">${timeObj.seconds}</span>`;

                $(`#count-down-time-contest-${id}`).html(timerHtml);

                if (timeCheck == "00:00:00:00") {
                    $(`#count-down-time-contest-${id}`).empty();
                }
            }
        }
    }

    function renderCalendar(date, id) {
        var month = moment(date).month() + 1;
        var date = moment(date).date();
        var day = UTILS.getWeekDayName(date);

        var calendar = ` <p class="event-month">Tháng ${month} </p>
                                        <p class="event-date">${date}</p>
                                        <p class="event-day">${day}</p>`

        $(`#contest-calender-${id}`).html(calendar);

    }

    // show all contest
    $("#btn-view-all-contest").click(function () {
        $(".event-item").removeClass("d-none");
        $('#event-grid').isotope('reloadItems').isotope();
        $(this).hide();
    })



}(jQuery, this));

function handleContestEvent(el, id, name, mode, slug, timeStart, isRegisted, finished) {
    var text = $(el).text().trim().toLowerCase();
    // check user login
    var nameOfUser = $("#nameOfUser").val();
    if (nameOfUser) {
        // register button handle
        if (text == TEXTS.PAGES.home.buttons.contest.register.toLowerCase()) {
            window.location.href = CONSTANTS.ROUTES.examProfile.examRegister + "?id=" + id + "&mode=" + mode + "&slug=" + slug;
        }
        else {
            // join button handle
            if (isRegisted == CONSTANTS.BOOLEAN_TEXTS.false) {
                sweetAlertService.error(TEXTS.PAGES.home.alert.notRegisterExam);
                return;
            }

            if (finished == CONSTANTS.BOOLEAN_TEXTS.true) {
                sweetAlertService.error(TEXTS.PAGES.home.alert.examDone);
                return;
            }

            if (text == TEXTS.PAGES.home.buttons.contest.join.toLowerCase()) {
                window.location.href = CONSTANTS.ROUTES.examProfile.examReady + "?id=" + id + "&mode=" + mode + "&slug=" + slug;
            }
        }
    }
    else {
        window.location.href = CONSTANTS.ROUTES.auth.login
    }
}

$(window).scroll(function () {
    var height = $(window).scrollTop();

    if (height > 100) {
        $(".auth-btn .btn").removeClass("btn-light")
        $(".auth-btn .btn").addClass("btn-primary")
        $(".header").addClass("white-nav")
    }
    else {
        $(".auth-btn .btn").addClass("btn-light")
        $(".auth-btn .btn").removeClass("btn-primary")
        $(".header").removeClass("white-nav")
    }
});
