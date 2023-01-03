document.addEventListener('DOMContentLoaded', async function() {
    var allWizards = [];
    var displayWizards = document.querySelector("#all");

    await fetch('https://localhost:7211/api/Wizards')
        .then(data => {
            return data.json();
        })
        .then(json => {
            allWizards = json;
        });

    for (let i = 0; i < allWizards.length; i++) {
        const wizard = allWizards[i];
        displayWizards.insertAdjacentHTML("beforeend", `<div class="card text-white bg-primary mb-3 mt-4" style="width: 500px;text-align: center;">
                    <div class="card-header"><h2>${wizard.title}</h2></div>
                    <div class="card-body">
                       <p style="color:black">${wizard.description}</p>
                       <div><button class="btn btn-warning" onclick="displayWizard('${wizard.id}');">Show Results</button></div>
                    </div>
                    </div>`);
    }
});

async function displayWizard(wizId) {
    var wizResults = [];
    var results = [];
    await fetch(`https://localhost:7211/api/WizardResults/${wizId}`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            wizResults = json;
        });
    for (let i = 0; i < wizResults.length; i++) {
        results.push(wizResults[i].userAnswer);
    }
    sessionStorage.setItem('wizardResults', JSON.stringify(results));
    window.location = 'displayResults.html';
}