var allWizards = [];
var wizardAnsweres = [];
document.addEventListener('DOMContentLoaded', async function () {
    var displayWizards = document.querySelector("#wizards");
    var userId = JSON.parse(localStorage.getItem('userId'));
    var WizardsNumToDisplay = 0;

    await fetch('https://localhost:7211/api/Wizards')
        .then(data => {
            return data.json();
        })
        .then(json => {
            allWizards = json;
        });

    for (let i = 0; i < allWizards.length; i++) {
        const wizard = allWizards[i];
        await fetch(`https://localhost:7211/api/WizardResults/${wizard.id}`)
            .then(data => {
                return data.json();
            })
            .then(json => {
                wizardAnsweres = json;
            });
        var answered = false;
        for (let j = 0; j < wizardAnsweres.length; j++) {
            const wiz = wizardAnsweres[j];
            if (userId === wiz.userId) {
                answered = true;
            }
        }
        if (answered === false && wizard.show === true) {
            WizardsNumToDisplay++;
            displayWizards.insertAdjacentHTML("beforeend", `<hr><div id="wizard${WizardsNumToDisplay}" class="card text-white bg-primary mb-3 mt-4" style="max-width: 20rem; margin-left: 600px; text-align: center;">
                <div class="card-header">Wizard</div>
                <div class="card-body">
                   <h3 style="color:black">${wizard.title}</h3>
                   <h4 style="color:yellow">${wizard.description}</h4>
                   <div><button class="btn btn-warning" onclick="displayWizard('${wizard.id}');">Start</button></div>
                </div>
                </div>`);
        }

    }
});

function displayWizard(wizId) {
    sessionStorage.setItem('wizardId', wizId);
    window.location = 'displayWizard.html';
}


