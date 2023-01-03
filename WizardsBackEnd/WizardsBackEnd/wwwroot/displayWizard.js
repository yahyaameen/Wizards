var wizardContent = document.querySelector("#wiz");
var pageNum = document.querySelector("#PageNum");
var disp = document.querySelector("#display");
var ans = document.querySelector("#answers");
var cardHeader = document.querySelector("#cardHeader");
var cardBody = document.querySelector("#cardBody");
var savedAnswers;
var wizardId = sessionStorage.getItem('wizardId');
var wizard = {};
var pagesNum = 0;
var elementsNum = 0;
var pageAnsweres = {};
var arr = [];
let content = [];

document.addEventListener('DOMContentLoaded', async function() {

    if (localStorage.getItem(wizardId) === null) {
        localStorage.setItem(wizardId, JSON.stringify(arr));
    }

    await fetch(`https://localhost:7211/api/Wizards/${wizardId}`)
        .then(data => {
            return data.json();
        })
        .then(json => {
            wizard = JSON.parse(JSON.stringify(json));
            display();
        });
});

function display() {
    wizardContent.innerHTML = "";
    content = JSON.parse(wizard.content);
    var page = content[pagesNum];
    wizardContent.insertAdjacentHTML("beforeend", `<div class="mt-4" style="text-align: center;">
       <h2 style="color:blue"> ${page.pageTitle}</h2></div>
       <div class="mt-4" style="text-align: center;">
       <h5 style="color:black"> ${page.pageDescription}</h5></div>`);
    for (let i = 0; i < page.elements.length; i++) {
        elementsNum++;
        var element = page.elements[i];
        switch (element.type) {
            case "TextBox":
                textBox(element);
                break;
            case "CheckBox List":
                checkBox(element);
                break;
            case "MultiLine Free Text":
                freeText(element);
                break;
            case "RadioButtons List":
                radioButtons(element);
                break;
            default:
        }

    }
    elementsNum = 0;
    if (content.length === (pagesNum + 1)) {
        if (pagesNum != 0) {
            wizardContent.insertAdjacentHTML("beforeend", `<div id="outer" class="mt-4">
              <div class="inner"><button class="btn btn-primary" onclick="prev();">Prev</button></div>
              <div class="inner"><button class="btn btn-primary" onclick="finish();">Finish</button></div>
              </div>`);
        } else {
            wizardContent.insertAdjacentHTML("beforeend", `<div class="mt-4" style="text-align: center;">
              <button class="btn btn-primary" onclick="finish();">Finish</button>
              </div>`);
        }

    } else {
        if (pagesNum != 0) {
            wizardContent.insertAdjacentHTML("beforeend", `<div id="buttons" class="mt-4">
                <div class="inner"><button class="btn btn-primary" onclick="prev();">Prev</button></div>
                <div class="inner"><button class="btn btn-primary" onclick="next();">Next</button></div>
            </div>`);
        } else {
            wizardContent.insertAdjacentHTML("beforeend", `<div class="mt-4" style="text-align: center;">
              <button class="btn btn-primary" onclick="next();">Next</button></div>`);
        }
    }
    pageNum.innerHTML = `Page ${pagesNum + 1} of ${content.length}`;
}

function textBox(element) {
    var labelName = element.title;
    var inputType = element.inputType;
    var placeholder = element.defaultValue;
    wizardContent.insertAdjacentHTML("beforeend", `<div class="mt-4" style="margin-left: 10px;margin-right: 10px;text-align: center;">
    <label for="e${elementsNum}" class="form-label mt-4 ">${labelName}</label>
    <input type="${inputType}" class="form-control " id="e${elementsNum}" placeholder="${placeholder}"></div>`);
    savedAnswers = JSON.parse(localStorage.getItem(wizardId));
    if (savedAnswers.length >= (pagesNum + 1)) {
        var e = document.getElementById(`e${elementsNum}`);
        e.value = savedAnswers[pagesNum][`${element.title}`];
    }
}

function checkBox(element) {
    wizardContent.insertAdjacentHTML("beforeend", `<div class="mt-4" style="text-align: center;">
    <p style="color:black">${element.title}</p></div>`);
    for (let i = 0; i < element.labels.length; i++) {
        var labelName = element.labels[i].labelValue;
        wizardContent.insertAdjacentHTML("beforeend", `<div style="text-align: center;"><input type="checkbox" id="e${elementsNum}box${i+1}" name="e${elementsNum}box${i+1}" class="e${elementsNum}" value="${labelName}">
        <label for="e${elementsNum}box${i+1}">${labelName}</label><br></div>`);

    }
    savedAnswers = JSON.parse(localStorage.getItem(wizardId));
    if (savedAnswers.length >= (pagesNum + 1)) {
        var checkedLabels = savedAnswers[pagesNum][`${element.title}`];
        var words = checkedLabels.split(',');
        for (let j = 0; j < element.labels.length; j++) {
            var box = document.getElementById(`e${elementsNum}box${j+1}`);
            for (let k = 0; k < words.length; k++) {
                if (box.value === words[k]) {
                    box.checked = true;
                }
            }
        }
    }
}

function freeText(element) {
    var labelName = element.title;
    var placeholder = element.defaultValue;
    wizardContent.insertAdjacentHTML("beforeend", `<div class="mt-4" style="text-align: center;">
    <label for="e${elementsNum}">${labelName}</label>
    <textarea placeholder="${placeholder}" id="e${elementsNum}" name="e${elementsNum}" rows="4" cols="50"></textarea></div>`);
    savedAnswers = JSON.parse(localStorage.getItem(wizardId));
    if (savedAnswers.length >= (pagesNum + 1)) {
        var e = document.getElementById(`e${elementsNum}`);
        e.value = savedAnswers[pagesNum][`${element.title}`];
    }
}

function radioButtons(element) {
    wizardContent.insertAdjacentHTML("beforeend", `<div class="mt-4" style="text-align: center;">
    <p style="color:black">${element.title}</p></div>`);
    for (let i = 0; i < element.labels.length; i++) {
        var labelName = element.labels[i].labelValue;
        wizardContent.insertAdjacentHTML("beforeend", `<div style="text-align: center;"><input type="radio" id="e${elementsNum}radio${i+1}" name="e${elementsNum}radio" class="e${elementsNum}" value="${labelName}">
        <label for="e${elementsNum}radio${i+1}">${labelName}</label><br></div>`);

    }
    savedAnswers = JSON.parse(localStorage.getItem(wizardId));
    if (savedAnswers.length >= (pagesNum + 1)) {
        var checkedRadio = savedAnswers[pagesNum][`${element.title}`];
        for (let j = 0; j < element.labels.length; j++) {
            var radio = document.getElementById(`e${elementsNum}radio${j+1}`);
            if (radio.value === checkedRadio) {
                radio.checked = true;
            }
        }
    }
}

async function finish() {
    var result = {};
    var uId = localStorage.getItem("userId");
    var legalPage;

    legalPage = isLegalPage();
    if (legalPage === true) {
        wizard.answered = true;
        await fetch(`https://localhost:7211/api/Wizards/${wizardId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(wizard)
            }).then(response => response.json())
            .then(result => {
                console.log('Success:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        disp.innerHTML = `<div class="mt-4" style="text-align: center;">
           <h1 style="color:red"> Thank You!</h1></div>`;
        savedAnswers = JSON.parse(localStorage.getItem(wizardId));
        savedAnswers[pagesNum] = pageAnsweres;
        result = {
            wizardId: `${wizardId}`,
            userId: `${uId}`,
            userAnswer: JSON.stringify(savedAnswers)
        };
        await fetch('https://localhost:7211/api/WizardResults', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(result),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        ans.style.display = 'block';
        cardHeader.innerHTML = `${wizard.title}`;
        cardBody.insertAdjacentHTML("beforeend", `<div style="font-size: 40px;">
            <p style="color:black">${wizard.description}</p></div>
            <div class="mt-4">
            <h5 style="color:yellow"> Your answers:</h5></div>`);

        for (let i = 0; i < content.length; i++) {
            var wizardPage = content[i];
            cardBody.insertAdjacentHTML("beforeend", ` <hr><div style="font-size: 35px;">
            <p style="color:black" >${ wizardPage.pageTitle }</p></div >
            <div><p style="font-size: 25px;color:black">${ wizardPage.pageDescription}</p></div>`);
            for (let j = 0; j < wizardPage.elements.length; j++) {
                var element = wizardPage.elements[j];
                var answer = savedAnswers[i][`${element.title}`];
                cardBody.insertAdjacentHTML("beforeend", `<br><div>
                   <p style="font-size: 20px;color:white">${element.title}<p style="font-size: 18px;color:black">${answer}</p></p></div>`);
            }
        }
        localStorage.removeItem(wizardId);
    } else {
        alert("All fields are required");
    }
}

function next() {
    var legalPage = isLegalPage();
    if (legalPage === true) {
        savedAnswers = JSON.parse(localStorage.getItem(wizardId));
        savedAnswers[pagesNum] = pageAnsweres;
        var savedAnswersjsonTxt = JSON.stringify(savedAnswers);
        localStorage.setItem(wizardId, savedAnswersjsonTxt);
        pageAnsweres = {};
        pagesNum++;
        display();
    } else {
        alert("All fields are required");
    }
}

function isLegalPage() {
    var pageElements = content[pagesNum].elements;
    for (let i = 0; i < pageElements.length; i++) {
        var pageElement = pageElements[i];
        switch (pageElement.type) {
            case "TextBox":
                var element = document.getElementById(`e${i+1}`);
                if (element.value === '') {
                    return false;
                } 
                else {
                    if (pageElement.inputType === "email"){
                        if(!ValidateEmail(element.value)){
                            alert("please enter a valid email");
                            return false;
                        }  
                    }
                    pageAnsweres[`${pageElement.title}`] = element.value;
                }
                break;
            case "CheckBox List":
                var boxes = document.getElementsByClassName(`e${i+1}`);
                var checked = "";
                for (let j = 0; j < boxes.length; j++) {
                    var box = boxes[j];
                    if (box.checked == true) {
                        checked += `${box.value},`;
                    }
                }
                if (checked.length === 0) {
                    return false;
                } else {
                    var checkedSlice = checked.slice(0, -1);
                    pageAnsweres[`${pageElement.title}`] = checkedSlice;
                }
                break;
            case "MultiLine Free Text":
                var element = document.getElementById(`e${i+1}`);
                if (element.value === '') {
                    return false;
                } else {
                    pageAnsweres[`${pageElement.title}`] = element.value;
                }
                break;
            case "RadioButtons List":
                var radioButtons = document.getElementsByClassName(`e${i+1}`);
                var checked = "";
                for (let j = 0; j < radioButtons.length; j++) {
                    var radioButton = radioButtons[j];
                    if (radioButton.checked == true) {
                        checked += `${radioButton.value},`;
                    }
                }
                if (checked.length === 0) {
                    return false;
                } else {
                    var checkedSlice = checked.slice(0, -1);
                    pageAnsweres[`${pageElement.title}`] = checkedSlice;
                }
                break;
            default:
        }
    }
    return true;
}

function prev() {
    pagesNum--;
    display();
}

function ValidateEmail(value) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (value.match(validRegex)) {
    return true;
  } else {
    return false;
   }
}
