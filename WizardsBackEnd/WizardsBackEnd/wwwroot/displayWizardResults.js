document.addEventListener('DOMContentLoaded', async function() {
    var results = document.querySelector("#results");
    var wizardResults = JSON.parse(sessionStorage.getItem('wizardResults'));
    for (let i = 0; i < wizardResults.length; i++) {
        results.insertAdjacentHTML("beforeend", `<hr>`);
        var answer = JSON.parse(wizardResults[i]);
        for (let k = 0; k < answer.length; k++) {
            var answerPage = answer[k];
            for (let j = 1; j <= Object.keys(answerPage).length; j++) {
                var elementTitle = Object.keys(answerPage)[j - 1];
                var elementAnswer = Object.values(answerPage)[j - 1];
                results.insertAdjacentHTML("beforeend", `<br><div style="text-align: center;">
            <p style="font-size: 20px;color:blue">${elementTitle}
              <p style="font-size: 18px;color:black">${elementAnswer}</p>
            </p></div>`);
            }
        }
    }
});