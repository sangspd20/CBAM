$(document).ready(function () {
    var paging = {
        skip: 1,
        take: CONSTANTS.PAGING.pageSize
    }
    getContestWithPaging(paging);
    UTILS.addLoading("score-board-skeleton", "scoreBoard");
    $("#score-board-pagination").hide();
});

var isRenderScoreBoard = false;
function getContestWithPaging(paging) {
    ajaxServices.post(CONSTANTS.ROUTES.contest.getContestWithPaging, paging).then(function (response) {
        console.log(response)
        if (response && response.queryResponse) {
            renderScoreBoard(response.queryResponse.items);

            var metaData = response.queryResponse.metaData;

            if (metaData.TotalPages > 1 && !isRenderScoreBoard) {
                $('#score-board-pagination').twbsPagination({
                    totalPages: metaData.TotalPages,
                    visiblePages: CONSTANTS.PAGING.visiblePages,
                    prevClass: "page-item page-previous",
                    nextClass: "page-item page-next"
                }).on('page', function (evt, page) {
                    UTILS.addLoading("score-board-skeleton", "scoreBoard");
                    UTILS.disablePaginationClick("score-board-pagination")
                    var paging = {
                        skip: page,
                        take: CONSTANTS.PAGING.pageSize

                    }
                    getContestWithPaging(paging)
                });
            }

            isRenderScoreBoard = true;
            UTILS.removeLoading("score-board-skeleton", "scoreBoard");
            $("#score-board-pagination").show();
            UTILS.enablePaginationClick("score-board-pagination");


        }
    }).catch(function (error) {
        UTILS.removeLoading("score-board-skeleton", "scoreBoard");
    })
}

function renderScoreBoard(list) {
    var items = "";
    for (var score of list) {
        var timeStart = moment(score.timeStart);
        var date = timeStart.date() < 10 ? "0" + timeStart.date() : timeStart.date();
        var month = timeStart.month() + 1;
        var item = ` <div class="col-12 col-lg-6 mt-4  d-flex flex-column">
                <div class="px-abs-20 py-abs-15 box-shadow-2 br-radius-8 bg-white d-flex align-items-center flex-shrink-1 flex-grow-1">
                    <div class="time-block">
                        <p class="text-purple-01 fs-28">${date}</p>
                        <p class="mt-2">Tháng ${month}</p>
                    </div>
                    <div class="me-2 w-min-0 flex-shrink-1 flex-grow-1">
                        <p class="fs-20 text-purple-01">${score.name}</p>
                        <p class="mt-2 text-truncate">Listening, Reading, Writing</p>
                        <div class="d-flex align-items-center mt-2 text-truncate">
                            <img alt="icon-rate-scoreboard" src="/images/icon-rate-scoreboard.png" />
                            <p class="ms-2 text-truncate">Nguyễn văn A</p>
                        </div>
                    </div>
                    <button onclick="scoreBoardDetail('${score.slug}','${score.name}')" class="btn scoreboard-detail-btn">
                        Chi tiết
                        <i class="fa fa-long-arrow-right ms-2" aria-hidden="true"></i>
                    </button>
                </div>
            </div>`;
        items += item;
    }

    $("#scoreBoard").html(items)
}

function scoreBoardDetail(slug, name) {
    window.location.href = CONSTANTS.ROUTES.contest.scoreBoardDetail + "?slug=" + slug
}

