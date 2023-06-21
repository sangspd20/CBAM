var roundList = [];
$(document).ready(function () {
    var paging = {
        skip: 1,
        take: CONSTANTS.PAGING.pageSize,
        slug: $("#slug").val(),
        name: "",
        roundId: ""
    }
    getContestScoresDetailPaging(paging);
    UTILS.addLoading("score-board-detail-skeleton", "score-board-detail-table");
    $("#score-board-detail-pagination").hide();
});

function renderRoundList(roundList) {
    var list = "";
    var count = 1;
    for (var round of roundList) {
        var item
        if (count == 1) {
            item = ` <button id="${round.id}" onclick="changeRound('${round.id}')" class="btn btn-primary">${round.name}</button>`;
        }
        else
            item = ` <button id="${round.id}" onclick="changeRound('${round.id}')" class="btn btn-light">${round.name}</button>`;

        list += item;
        count++;
    }
    $("#round-list").html(list)
}

var isRenderScoreBoard = false;
function getContestScoresDetailPaging(paging) {
    ajaxServices.post(CONSTANTS.ROUTES.contest.getContestScoresDetailPaging, paging).then(function (response) {
        console.log(response)
        if (response && response.queryResponse) {
            roundList = response.queryResponse.children;
            renderRoundList(roundList);
            $(".name").text(response.queryResponse.name)
            renderScoreBoard(response.queryResponse.registered.items);

            var metaData = response.queryResponse.registered.metaData;

            if (metaData.TotalPages > 1 && !isRenderScoreBoard) {
                $('#score-board-detail-pagination').twbsPagination({
                    totalPages: metaData.TotalPages,
                    visiblePages: CONSTANTS.PAGING.visiblePages,
                    prevClass: "page-item page-previous",
                    nextClass: "page-item page-next"
                }).on('page', function (evt, page) {
                    UTILS.addLoading("score-board-detail-skeleton", "score-board-detail-table");
                    UTILS.disablePaginationClick("score-board-detail-pagination")
                    var paging = {
                        skip: page,
                        take: CONSTANTS.PAGING.pageSize
                    }
                    getContestScoresDetailPaging(paging)
                });
            }

            isRenderScoreBoard = true;
            UTILS.removeLoading("score-board-detail-skeleton", "score-board-detail-table");
            $("#score-board-detail-pagination").show();
            UTILS.enablePaginationClick("score-board-detail-pagination");


        }
    }).catch(function (error) {
        UTILS.removeLoading("score-board-detail-skeleton", "score-board-detail-table");
    })
}

function renderScoreBoard(list) {
    var items = "";
    for (var i = 0; i < list.length; i++) {
        var scoreDetail = list[i];
        var scoreList = "";
        var totalOntime = 0;
        for (var j = 0; j < scoreDetail.scores.length; j++) {
            var score = scoreDetail.scores[j];
            var scoreItem = j != scoreDetail.scores.length - 1 ? `${score.subjectName}: ${score.total}, ` : `${score.subjectName}: ${score.total}`;
            scoreList += scoreItem;

            totalOntime += score.onTime;
        }

        totalOntime = toHoursAndMinutes(totalOntime);

        scoreList = `<span class="fs-12">${scoreList}</span>`;

        var currentRoundId = $("#round-list .btn.btn-primary").prop("id");
        var currentRound = UTILS.findById(currentRoundId, roundList)

        var startTime = UTILS.formatDateMomentJSDefault(currentRound?.start);

        var item = `   <tr class="d-flex">
                        <td class="col-auto w-abs-70 text-purple-01 text-center">${i + 1}</td>
                        <td class="col">
                            <div class="d-flex align-items-center">
                                <i class='bx bxs-user-circle me-2 fs-22'></i>${scoreDetail.fullName}
                            </div>
                        </td>
                        <td class="col-5">
                            Tổng: ${scoreDetail.mark} - ${scoreList}
                        </td>
                        <td class="col-2">${totalOntime}</td>
                        <td class="col-2 text-end">${startTime}</td>
                    </tr>`;
        items += item;
    }

    $("#score-board-detail-body").html(items)
}

function changeRound(roundId) {
    // remove all class active
    $("#round-list .btn").removeClass("btn-primary");
    $("#" + roundId).addClass("btn-primary")
    if ($("#" + roundId).hasClass("btn-light")) {
        $("#" + roundId).removeClass("btn-light")
    }

    var paging = {
        skip: 1,
        take: CONSTANTS.PAGING.pageSize,
        slug: $("#slug").val(),
        name: "",
        roundId: roundId
    }
    getContestScoresDetailPaging(paging);
    UTILS.addLoading("score-board-detail-skeleton", "score-board-detail-table");
    $("#score-board-detail-pagination").hide();
}

function toHoursAndMinutes(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    var s = minutes * 60 % 60;

    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return h + ':' + m + ":" + s;
}

