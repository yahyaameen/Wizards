var userId = localStorage.getItem('userId');
var myWizards = [];
document.addEventListener('DOMContentLoaded', async function () {
    await fetch(`https://localhost:7211/api/Wizards`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            currentCreatorWizards(json);
            showMyWizards();
        });

    function showMyWizards() {
        var all = '';
        for (let i = 0; i < myWizards.length; i++) {
            var title = myWizards[i].title;
            var description = myWizards[i].description;
            var id = myWizards[i].id;
            var isRemoved = myWizards[i].show;
            if (isRemoved === false) {
                all +=`<div class="card text-white bg-primary mb-3 mt-4" style="width: 500px;text-align: center;">
                    <div class="card-header"><h2>${title}</h2></div>
                    <div class="card-body">
                       <p style="color:black">${description}</p>
                       <div><button class="btn btn-warning" onclick="wizardResults(${id})">Results</button></div>
                    </div>
                    </div>`;
                /*all += `<div><h2>${title}</h2>
                  <button onclick="wizardResults(${id})">Results</button></div>`;*/
            } else {
                all +=`<div class="card text-white bg-primary mb-3 mt-4" style="width: 500px;text-align: center;">
                    <div class="card-header"><h2>${title}</h2></div>
                    <div class="card-body">
                       <p style="color:black">${description}</p>
                       <div>
                            <button class="btn btn-warning" onclick="deleteWizard(${id})">Delete</button>
                            <button class="btn btn-warning" onclick="wizardResults(${id})">Results</button>
                       </div>
                    </div>
                    </div>`;
                
            }
        }
        var creatorWizards = document.querySelector("#myWizards");
        creatorWizards.innerHTML = all;
    }
});

function currentCreatorWizards(json) {
    for (let i = 0; i < json.length; i++) {
        if (json[i].ownerId === parseInt(userId)) {
            myWizards.push(json[i]);
        } 
    }
}


async function deleteWizard(WizardId) {
    var wiz = {};
    await fetch(`https://localhost:7211/api/Wizards/${WizardId}`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            wiz = JSON.parse(JSON.stringify(json));
        });
    if (wiz.answered === false) {
        await fetch(`https://localhost:7211/api/Wizards/${WizardId}`, { method: 'DELETE' });
    } else {
        wiz.show = false;
        await fetch(`https://localhost:7211/api/Wizards/${WizardId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wiz)
        }).then(response => response.json())
            .then(result => {
                console.log('Success:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    location.reload();
}

async function wizardResults(WizardId) {
    var wizResults = [];
    var results = [];
    await fetch(`https://localhost:7211/api/WizardResults/${WizardId}`)
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
    window.location = 'displayWizardResults.html';
}