var oId = localStorage.getItem("userId");
var theOwner;
var contentArr = [];
var wizard = {
    title: "",
    description: "",
    content: "",
    ownerId: parseInt(oId),
    answered: false,
    show: true
};
var page = { pageTitle: "", pageDescription: "", elements: [], pageRemove: "" };

var elementsNum = 0;
var checkBoxLabels = 1;
var radioButtonsLabels = 1;
var pagesNum = 0;
document.addEventListener('DOMContentLoaded', async function() {
    var addNewElement = false;
    var addNewPage = false;
    var wizardTitle = document.querySelector("#wizardTitle");
    var WizardDescription = document.querySelector("#WizardDescription");
    var addPage = document.querySelector("#addPage");
    var savePage = document.querySelector("#savePage");
    var element = document.querySelector("#element");
    var addElement = document.querySelector("#addElement");
    var saveElement = document.querySelector("#saveElement");
    var content = document.querySelector("#content");
    var createWizard = document.querySelector("#createWizard");

    addPage.addEventListener('click', function(e) {
        document.getElementById('elementDiv').style.display = 'block';
        document.getElementById('save').style.display = 'block';
        pagesNum++;
        addNewPage = true;
        content.insertAdjacentHTML("beforeend", `<div id="p${pagesNum}" class="wizardPage"><hr>
           <h2 style="color:black">page ${pagesNum}</h2>
           <button style="display:block" class="remove btn btn-danger" onclick="deletePage('p${pagesNum}');">remove page</button>
           <div style="text-align: center;">
             <label for="p${pagesNum}Title" class="form-label mt-4 ">Page Title</label>
             <input type="text" class="form-control " id="p${pagesNum}Title" placeholder="Enter page title" style="width: 426px;margin-left: 450px;height: 38px;"></div>
           <div style="text-align: center;">
             <label for="p${pagesNum}Description" class="form-label mt-4 ">Page description</label>
             <textarea class="form-control " id="p${pagesNum}Description" name="PageDescription" rows="4" cols="50" placeholder="Enter page description"></textarea>
           </div></div>`);
        addPage.style.display = 'none';
    });

    savePage.addEventListener('click', function(e) {
        if (pagesNum != 0) {
            var legalPage = true;
            var pageTitleId = `p${pagesNum}Title`;
            var pageTitle = document.getElementById(`${pageTitleId}`);
            var pageDescriptionId = `p${pagesNum}Description`;
            var pageDescription = document.getElementById(`${pageDescriptionId}`);
            if (pageTitle.value === '') {
                alert("page title is required");
                legalPage = false;
            }
            if (pageDescription.value === '') {
                alert("page description is required");
                legalPage = false;
            }
            if (page.elements.length === 0) {
                alert("page should contain at least one element");
                legalPage = false;
            }
            if (legalPage === true) {
                addNewPage = false;
                pageTitle.disabled = true;
                pageDescription.disabled = true;
                page.pageTitle = pageTitle.value;
                page.pageDescription = pageDescription.value;
                page.pageRemove = `p${pagesNum}`;
                let addTheNewPage = Object.assign({}, page);
                contentArr.push(addTheNewPage);
                page.pageTitle = '';
                page.pageDescription = '';
                page.elements = [];
                addPage.style.display = 'block';
                document.getElementById('elementDiv').style.display = 'none';
                document.getElementById('save').style.display = 'none';
                if (addNewElement === true) {
                    var currentElement = document.getElementById(`p${pagesNum}e${elementsNum}`);
                    currentElement.parentNode.removeChild(currentElement);
                    addNewElement = false;
                }
                elementsNum = 0;
            }
        }
    });

    addElement.addEventListener('click', function(e) {
        document.getElementById('elementDiv').style.display = 'none';
        addNewElement = true;
        elementsNum++;
        switch (element.value) {
            case "TextBox":
                textBoxBuild();
                break;
            case "CheckBox List":
                checkBoxBuild();
                break;
            case "MultiLine Free Text":
                freeTextBuild();
                break;
            case "RadioButtons List":
                radioButtonsBuild();
                break;
            default:
        }
    });

    saveElement.addEventListener('click', function(e) {
        var newElement = {};
        switch (element.value) {
            case "TextBox":
                var textBoxLabel = document.getElementById(`p${pagesNum}e${elementsNum}labelName`);
                var textBoxInputType = document.getElementById(`p${pagesNum}e${elementsNum}inputType`);
                var textBoxDefault = document.getElementById(`p${pagesNum}e${elementsNum}default`);
                if (textBoxLabel.value === '') {
                    alert("text box label name is required");
                } else {
                    addNewElement = false;
                    textBoxLabel.disabled = true;
                    textBoxInputType.disabled = true;
                    textBoxDefault.disabled = true;
                    newElement.type = element.value;
                    newElement.title = textBoxLabel.value;
                    newElement.inputType = textBoxInputType.value;
                    newElement.defaultValue = textBoxDefault.value;
                    newElement.elementRemove = `p${pagesNum}e${elementsNum}`;
                    page.elements.push(newElement);
                    document.getElementById('elementDiv').style.display = 'block';
                }
                break;
            case "CheckBox List":
                var legalCheckBox = true;
                var checkLabel = document.getElementById(`p${pagesNum}e${elementsNum}labelName`);
                if (checkLabel.value === '') {
                    alert("checkBox List title is required");
                    legalCheckBox = false
                }
                for (let i = 0; i < checkBoxLabels; i++) {
                    var checkBoxLabel = document.getElementById(`p${pagesNum}e${elementsNum}checkBoxLabel${i+1}`);
                    if (checkBoxLabel.value === '') {
                        alert("check box label name is required");
                        legalCheckBox = false;
                    }
                }
                if (legalCheckBox === true) {
                    checkLabel.disabled = true;
                    addNewElement = false;
                    newElement.type = element.value;
                    newElement.title = checkLabel.value;
                    newElement.labels = [];
                    for (let i = 0; i < checkBoxLabels; i++) {
                        var oneLabel = {};
                        var checkBoxLabel = document.getElementById(`p${pagesNum}e${elementsNum}checkBoxLabel${i+1}`);
                        oneLabel.labelValue = checkBoxLabel.value;
                        newElement.labels.push(oneLabel);
                        checkBoxLabel.disabled = true;
                    }
                    checkBoxLabels = 1;
                    newElement.elementRemove = `p${pagesNum}e${elementsNum}`;
                    page.elements.push(newElement);
                    document.getElementById('elementDiv').style.display = 'block';
                    document.getElementById(`p${pagesNum}e${elementsNum}`).children[5].style.display = 'none';
                    var removeBoxesButtons = document.getElementsByClassName(`p${pagesNum}e${elementsNum}class`);
                    for (let i = 0; i < removeBoxesButtons.length; i++) {
                        var bu = removeBoxesButtons[i];
                        bu.style.display = 'none';
                    }
                }
                break;
            case "MultiLine Free Text":
                var freeTextLabel = document.getElementById(`p${pagesNum}e${elementsNum}labelName`);
                var freeTextDefault = document.getElementById(`p${pagesNum}e${elementsNum}default`);
                if (freeTextLabel.value === '') {
                    alert("multiLine free text label name is required");
                } else {
                    addNewElement = false;
                    freeTextLabel.disabled = true;
                    freeTextDefault.disabled = true;
                    newElement.type = element.value;
                    newElement.title = freeTextLabel.value;
                    newElement.defaultValue = freeTextDefault.value;
                    newElement.elementRemove = `p${pagesNum}e${elementsNum}`;
                    page.elements.push(newElement);
                    document.getElementById('elementDiv').style.display = 'block';
                }
                break;
            case "RadioButtons List":
                var legalRadioButtons = true;
                var radioLabel = document.getElementById(`p${pagesNum}e${elementsNum}labelName`);
                if (radioLabel.value === '') {
                    alert("RadioButtons title is required");
                    legalRadioButtons = false
                }
                for (let i = 0; i < radioButtonsLabels; i++) {
                    var radioButtonsLabel = document.getElementById(`p${pagesNum}e${elementsNum}radioButtonsLabel${i+1}`);
                    if (radioButtonsLabel.value === '') {
                        alert("RadioButtons label name is required");
                        legalRadioButtons = false;
                    }
                }
                if (legalRadioButtons === true) {
                    radioLabel.disabled = true;
                    addNewElement = false;
                    newElement.type = element.value;
                    newElement.title = radioLabel.value;
                    newElement.labels = [];
                    for (let i = 0; i < radioButtonsLabels; i++) {
                        var oneLabel = {};
                        var radioButtonsLabel = document.getElementById(`p${pagesNum}e${elementsNum}radioButtonsLabel${i+1}`);
                        oneLabel.labelValue = radioButtonsLabel.value;
                        newElement.labels.push(oneLabel);
                        radioButtonsLabel.disabled = true;
                    }
                    radioButtonsLabels = 1;
                    newElement.elementRemove = `p${pagesNum}e${elementsNum}`;
                    page.elements.push(newElement);
                    document.getElementById('elementDiv').style.display = 'block';
                    document.getElementById(`p${pagesNum}e${elementsNum}`).children[5].style.display = 'none';
                    var removeBoxesButtons = document.getElementsByClassName(`p${pagesNum}e${elementsNum}class`);
                    for (let i = 0; i < removeBoxesButtons.length; i++) {
                        var bu = removeBoxesButtons[i];
                        bu.style.display = 'none';
                    }
                }
                break;
            default:
        }
    });

    createWizard.addEventListener('click', async function(e) {
        var legalWizard = true;
        if (wizardTitle.value === "") {
            alert("wizard title is required");
            legalWizard = false;
        }
        if (WizardDescription.value == "") {
            alert("wizard description is required");
            legalWizard = false;
        }
        if (pagesNum === 0) {
            alert("wizard must have at least one page");
            legalWizard = false;
        }
        if (legalWizard === true) {
            var createWizardButtons = document.getElementById('createWizardButtons');
            createWizardButtons.style.display = 'none';
            var removeButtons = document.getElementsByClassName('remove');
            for (let i = 0; i < removeButtons.length; i++) {
                var bu = removeButtons[i];
                bu.style.display = 'none';
            }
            wizardTitle.disabled = true;
            WizardDescription.disabled = true;
            if (addNewPage === true) {
                var currentPage = document.getElementById(`p${pagesNum}`);
                currentPage.parentNode.removeChild(currentPage);
                addNewPage = false;
            }
            wizard.title = wizardTitle.value;
            wizard.description = WizardDescription.value;
            for (let i = 0; i < contentArr.length; i++) {
                delete contentArr[i]['pageRemove'];
                for (let j = 0; j < contentArr[i].elements.length; j++) {
                    delete contentArr[i].elements[j]['elementRemove'];
                }
            }
            wizard.content = JSON.stringify(contentArr);
            await fetch('https://localhost:7211/api/Wizards', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(wizard)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => console.error('Unable to add wizard.', error));
            alert("Your wizard has been successfully created");
        }
    });

    function textBoxBuild() {
        var currentPage = document.getElementById(`p${pagesNum}`);
        currentPage.insertAdjacentHTML("beforeend", `<hr><div id="p${pagesNum}e${elementsNum}" class="p${pagesNum}element">
           <h3 style="color:black">element ${elementsNum}</h3>
           <h4 style="color:yellow">TextBox</h4>
           <div><button style="display:block" class="remove btn btn-danger" onclick="deleteElement('p${pagesNum}e${elementsNum}');">remove element</button></div>
           <label for="p${pagesNum}e${elementsNum}labelName" class="form-label mt-4 ">what the name of the label?</label>
           <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}labelName" placeholder="Enter label name">
           <label for="p${pagesNum}e${elementsNum}inputType" class="form-label mt-4">Choose input type</label>
           <select class="form-select" id="p${pagesNum}e${elementsNum}inputType">
             <option>email</option>
             <option>password</option>
             <option>text</option>
           </select>
           <label for="p${pagesNum}e${elementsNum}default" class="form-label mt-4 ">What the user needs to enter?</label>
           <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}default" placeholder="default value">              
         </div>`);
    }

    function checkBoxBuild() {
        var currentPage = document.getElementById(`p${pagesNum}`);
        currentPage.insertAdjacentHTML("beforeend", `<hr><div id="p${pagesNum}e${elementsNum}" class="p${pagesNum}element">
           <h3 style="color:black">element ${elementsNum}</h3>
           <h4 style="color:yellow">CheckBox</h4>
           <div><button style="display:block" class="remove btn btn-danger" onclick="deleteElement('p${pagesNum}e${elementsNum}');">remove element</button></div>
           <div><label for="p${pagesNum}e${elementsNum}labelName" class="form-label mt-4 ">what the title of the checkBox List?</label>
           <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}labelName" placeholder="Enter checkBox List title"></div>
           <div id="p${pagesNum}e${elementsNum}checkBox">
           <div class="p${pagesNum}e${elementsNum}labels">
           <label for="p${pagesNum}e${elementsNum}checkBoxLabel${checkBoxLabels}" class="form-label mt-4 ">what the name of the box label?</label>
           <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}checkBoxLabel${checkBoxLabels}" placeholder="Enter box label name">
           </div>
           </div>
           <div class="mt-4" style="display:block"><button id="p${pagesNum}e${elementsNum}button" onclick="addAnotherBox('p${pagesNum}e${elementsNum}checkBox');">Add another box</button></div>              
         </div>`);
    }

    function freeTextBuild() {

        var currentPage = document.getElementById(`p${pagesNum}`);
        currentPage.insertAdjacentHTML("beforeend", `<hr><div id="p${pagesNum}e${elementsNum}" class="p${pagesNum}element">
           <h3 style="color:black">element ${elementsNum}</h3>
           <h4 style="color:yellow">MultiLine Free Text</h4>
           <div><button style="display:block" class="remove btn btn-danger" onclick="deleteElement('p${pagesNum}e${elementsNum}');">remove element</button></div>
           <label for="p${pagesNum}e${elementsNum}labelName" class="form-label mt-4 ">what the name of the multiLine free text label?</label>
           <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}labelName" placeholder="Enter label name">
           <label for="p${pagesNum}e${elementsNum}default" class="form-label mt-4 ">What the user needs to enter?</label>
           <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}default" placeholder="default value">              
         </div>`);
    }

    function radioButtonsBuild() {
        var currentPage = document.getElementById(`p${pagesNum}`);
        currentPage.insertAdjacentHTML("beforeend", `<hr><div id="p${pagesNum}e${elementsNum}" class="p${pagesNum}element">
           <h3 style="color:black">element ${elementsNum}</h3>
           <h4 style="color:yellow">RadioButtons List</h4>
           <div><button style="display:block" class="remove btn btn-danger" onclick="deleteElement('p${pagesNum}e${elementsNum}');">remove element</button></div>
           <div><label for="p${pagesNum}e${elementsNum}labelName" class="form-label mt-4 ">what the title of the radioButtons?</label>
           <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}labelName" placeholder="Enter radioButtons title"></div>
           <div id="p${pagesNum}e${elementsNum}radioButtons">
           <div class="p${pagesNum}e${elementsNum}labels">
           <label for="p${pagesNum}e${elementsNum}radioButtonsLabel${radioButtonsLabels}" class="form-label mt-4 ">what the name of the RadioButton label?</label>
           <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}radioButtonsLabel${radioButtonsLabels}" placeholder="Enter RadioButton label name">
           </div>
           </div>
           <div class="mt-4" style="display:block"><button id="p${pagesNum}e${elementsNum}button" onclick="addAnotherRadioButton('p${pagesNum}e${elementsNum}radioButtons');">Add another RadioButton</button></div>              
         </div>`);
    }
});

function deletePage(pId) {
    var removedPageNumber = pId.charAt(1);
    var removedPageNumberInteger = parseInt(removedPageNumber);
    var pageToRemove = document.getElementById(pId);
    pageToRemove.parentNode.removeChild(pageToRemove);

    if (pId === `p${pagesNum}`) {
        addPage.style.display = 'block';
        document.getElementById('elementDiv').style.display = 'none';
        document.getElementById('save').style.display = 'none';
    }
    for (let i = 0; i < contentArr.length; i++) {
        const wizardPage = contentArr[i];
        if (wizardPage.pageRemove === pId) {
            contentArr.splice(i, 1);
        }
    }
    var pages = document.getElementsByClassName("wizardPage");
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        var pageNumberInteger = parseInt(page.id.charAt(1));
        if (pageNumberInteger > removedPageNumberInteger) {
            pageNumberInteger--;
            page.id = `p${pageNumberInteger}`;
            page.children[1].innerHTML = `page ${pageNumberInteger}`;
            page.children[2].setAttribute("onclick", `deletePage('p${pageNumberInteger}');`);
            page.children[3].children[0].setAttribute("for", `p${pageNumberInteger}Title`);
            page.children[3].children[1].setAttribute("id", `p${pageNumberInteger}Title`);
            page.children[4].children[0].setAttribute("for", `p${pageNumberInteger}Description`);
            page.children[4].children[1].setAttribute("id", `p${pageNumberInteger}Description`);
            var pageElements = document.getElementsByClassName(`p${pageNumberInteger+1}element`);
            for (var i = 0; i < pageElements.length; i++) {
                var pageElement = pageElements[i];
                var elementNumber = parseInt(pageElement.id.charAt(3));
                switch (pageElement.children[1].innerHTML) {
                    case "TextBox":
                        textBoxUbdate(pageElement, `p${pageNumberInteger}`, elementNumber, true);
                        break;
                    case "CheckBox":
                        checkBoxUbdate(pageElement, `p${pageNumberInteger}`, elementNumber, true);
                        break;
                    case "MultiLine Free Text":
                        freeTextUbdate(pageElement, `p${pageNumberInteger}`, elementNumber, true);
                        break;
                    case "RadioButtons List":
                        radioButtonsUbdate(pageElement, `p${pageNumberInteger}`, elementNumber, true);
                        break;
                    default:
                }
            }
        }
    }
    pagesNum--;
}

function deleteElement(eId) {
    var elementPageNumber = eId.charAt(0);
    elementPageNumber += eId.charAt(1);
    var removedElementNumber = parseInt(eId.charAt(3));
    var currentElement = document.getElementById(eId);
    currentElement.parentNode.removeChild(currentElement);


    if (eId === `p${pagesNum}e${elementsNum}`) {
        document.getElementById('elementDiv').style.display = 'block';
    }
    if (elementPageNumber === `p${pagesNum}`) {
        for (let i = 0; i < page.elements.length; i++) {
            const thePageElement = page.elements[i];
            if (thePageElement.elementRemove === eId) {
                page.elements.splice(i, 1);
            }

        }
    }
    for (let i = 0; i < contentArr.length; i++) {
        const wizardPage = contentArr[i];
        for (let j = 0; j < wizardPage.elements.length; j++) {
            const pageElement = wizardPage.elements[j];
            if (pageElement.elementRemove === eId) {
                wizardPage.elements.splice(j, 1);
            }
        }
    }
    var pageElements = document.getElementsByClassName(`${elementPageNumber}element`);
    for (var i = 0; i < pageElements.length; i++) {
        var pageElement = pageElements[i];
        var elementNumber = parseInt(pageElement.id.charAt(3));
        if (elementNumber > removedElementNumber) {
            elementNumber--;
            switch (pageElement.children[1].innerHTML) {
                case "TextBox":
                    textBoxUbdate(pageElement, elementPageNumber, elementNumber, false);
                    break;
                case "CheckBox":
                    checkBoxUbdate(pageElement, elementPageNumber, elementNumber, false);
                    break;
                case "MultiLine Free Text":
                    freeTextUbdate(pageElement, elementPageNumber, elementNumber, false);
                    break;
                case "RadioButtons List":
                    radioButtonsUbdate(pageElement, elementPageNumber, elementNumber, false);
                    break;
                default:
            }
        }
    }
    elementsNum--;
}

function textBoxUbdate(pageElement, elementPageNumber, elementNumber, pageRemoved) {
    if (pageRemoved) {
        pageElement.className = `${elementPageNumber}element`;
    }
    pageElement.id = `${elementPageNumber}e${elementNumber}`;
    pageElement.children[0].innerHTML = `element ${elementNumber}`;
    pageElement.children[2].children[0].setAttribute("onclick", `deleteElement('${elementPageNumber}e${elementNumber}');`);
    pageElement.children[3].setAttribute("for", `${elementPageNumber}e${elementNumber}labelName`);
    pageElement.children[4].setAttribute("id", `${elementPageNumber}e${elementNumber}labelName`);
    pageElement.children[5].setAttribute("for", `${elementPageNumber}e${elementNumber}inputType`);
    pageElement.children[6].setAttribute("id", `${elementPageNumber}e${elementNumber}inputType`);
    pageElement.children[7].setAttribute("for", `${elementPageNumber}e${elementNumber}default`);
    pageElement.children[8].setAttribute("id", `${elementPageNumber}e${elementNumber}default`);
}

function checkBoxUbdate(pageElement, elementPageNumber, elementNumber, pageRemoved) {
    pageElement.id = `${elementPageNumber}e${elementNumber}`;
    pageElement.children[0].innerHTML = `element ${elementNumber}`;
    pageElement.children[2].children[0].setAttribute("onclick", `deleteElement('${elementPageNumber}e${elementNumber}');`);
    pageElement.children[3].children[0].setAttribute("for", `${elementPageNumber}e${elementNumber}labelName`);
    pageElement.children[3].children[1].setAttribute("id", `${elementPageNumber}e${elementNumber}labelName`);
    pageElement.children[4].id = `${elementPageNumber}e${elementNumber}checkBox`;
    var labels;
    if (pageRemoved) {
        pageElement.className = `${elementPageNumber}element`;
        var theElementPageNumber = parseInt(elementPageNumber.charAt(1));
        theElementPageNumber++;
        labels = document.getElementsByClassName(`p${theElementPageNumber}e${elementNumber}labels`);
    } else {
        labels = document.getElementsByClassName(`${elementPageNumber}e${elementNumber+1}labels`);
    }
    for (let i = 0; i < labels.length; i++) {
        var labelDiv = labels[i];
        var BoxNum = parseInt(labelDiv.children[1].id.charAt(17));
        labelDiv.className = `${elementPageNumber}e${elementNumber}labels`;
        i--;
        if (BoxNum != 1) {
            labelDiv.id = `${elementPageNumber}e${elementNumber}checkBoxLabel${BoxNum}div`;
            labelDiv.children[2].setAttribute("onclick", `deleteBox('${elementPageNumber}e${elementNumber}checkBoxLabel${BoxNum}div', '${elementPageNumber}e${elementNumber}labels', '${elementPageNumber}', 'e${elementNumber}');`);
        }
        labelDiv.children[0].setAttribute("for", `${elementPageNumber}e${elementNumber}checkBoxLabel${BoxNum}`);
        labelDiv.children[1].setAttribute("id", `${elementPageNumber}e${elementNumber}checkBoxLabel${BoxNum}`);
    }
    pageElement.children[5].children[0].setAttribute("id", `${elementPageNumber}e${elementNumber}button`);
    pageElement.children[5].children[0].setAttribute("onclick", `addAnotherBox('${elementPageNumber}e${elementNumber}checkBox');`);
}

function freeTextUbdate(pageElement, elementPageNumber, elementNumber, pageRemoved) {
    if (pageRemoved) {
        pageElement.className = `${elementPageNumber}element`;
    }
    pageElement.id = `${elementPageNumber}e${elementNumber}`;
    pageElement.children[0].innerHTML = `element ${elementNumber}`;
    pageElement.children[2].children[0].setAttribute("onclick", `deleteElement('${elementPageNumber}e${elementNumber}');`);
    pageElement.children[3].setAttribute("for", `${elementPageNumber}e${elementNumber}labelName`);
    pageElement.children[4].setAttribute("id", `${elementPageNumber}e${elementNumber}labelName`);
    pageElement.children[5].setAttribute("for", `${elementPageNumber}e${elementNumber}default`);
    pageElement.children[6].setAttribute("id", `${elementPageNumber}e${elementNumber}default`);
}

function radioButtonsUbdate(pageElement, elementPageNumber, elementNumber, pageRemoved) {
    pageElement.id = `${elementPageNumber}e${elementNumber}`;
    pageElement.children[0].innerHTML = `element ${elementNumber}`;
    pageElement.children[2].children[0].setAttribute("onclick", `deleteElement('${elementPageNumber}e${elementNumber}');`);
    pageElement.children[3].children[0].setAttribute("for", `${elementPageNumber}e${elementNumber}labelName`);
    pageElement.children[3].children[1].setAttribute("id", `${elementPageNumber}e${elementNumber}labelName`);
    pageElement.children[4].id = `${elementPageNumber}e${elementNumber}radioButtons`;
    var labels;
    if (pageRemoved) {
        pageElement.className = `${elementPageNumber}element`;
        var theElementPageNumber = parseInt(elementPageNumber.charAt(1));
        theElementPageNumber++;
        labels = document.getElementsByClassName(`p${theElementPageNumber}e${elementNumber}labels`);
    } else {
        labels = document.getElementsByClassName(`${elementPageNumber}e${elementNumber+1}labels`);
    }
    for (let i = 0; i < labels.length; i++) {
        var labelDiv = labels[i];
        var radioButtonNum = parseInt(labelDiv.children[1].id.charAt(21));
        labelDiv.className = `${elementPageNumber}e${elementNumber}labels`;
        i--;
        if (radioButtonNum != 1) {
            labelDiv.id = `${elementPageNumber}e${elementNumber}radioButtonsLabel${radioButtonNum}div`;
            labelDiv.children[2].setAttribute("onclick", `deleteRadioButton('${elementPageNumber}e${elementNumber}radioButtonsLabel${radioButtonNum}div', '${elementPageNumber}e${elementNumber}labels', '${elementPageNumber}', 'e${elementNumber}');`);
        }
        labelDiv.children[0].setAttribute("for", `${elementPageNumber}e${elementNumber}radioButtonsLabel${radioButtonNum}`);
        labelDiv.children[1].setAttribute("id", `${elementPageNumber}e${elementNumber}radioButtonsLabel${radioButtonNum}`);
    }
    pageElement.children[5].children[0].setAttribute("id", `${elementPageNumber}e${elementNumber}button`);
    pageElement.children[5].children[0].setAttribute("onclick", `addAnotherRadioButton('${elementPageNumber}e${elementNumber}radioButtons');`);
}

function addAnotherBox(checkBoxId) {
    checkBoxLabels++;
    var check = document.getElementById(checkBoxId);
    check.insertAdjacentHTML("beforeend", `<div class="p${pagesNum}e${elementsNum}labels" id="p${pagesNum}e${elementsNum}checkBoxLabel${checkBoxLabels}div"><label for="p${pagesNum}e${elementsNum}checkBoxLabel${checkBoxLabels}" class="form-label mt-4 ">what the name of the box label?</label>
    <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}checkBoxLabel${checkBoxLabels}" placeholder="Enter box label name"><button style="display:block" class="p${pagesNum}e${elementsNum}class btn btn-danger mt-4" onclick="deleteBox('p${pagesNum}e${elementsNum}checkBoxLabel${checkBoxLabels}div','p${pagesNum}e${elementsNum}labels','p${pagesNum}','e${elementsNum}');">X</button></div>`);
}

function deleteBox(labelDivId, boxesClassName, elementPageNum, elementNum) {
    var boxDiv = document.getElementById(labelDivId);
    boxDiv.parentNode.removeChild(boxDiv);
    checkBoxLabels--;
    var removedBoxNum = parseInt(labelDivId.charAt(17));
    var boxes = document.getElementsByClassName(boxesClassName);
    for (let i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        var BoxNum = parseInt(box.id.charAt(17));
        if (BoxNum > removedBoxNum) {
            BoxNum--;
            box.id = `${elementPageNum}${elementNum}checkBoxLabel${BoxNum}div`;
            box.children[0].setAttribute("for", `${elementPageNum}${elementNum}checkBoxLabel${BoxNum}`);
            box.children[1].setAttribute("id", `${elementPageNum}${elementNum}checkBoxLabel${BoxNum}`);
            box.children[2].setAttribute("onclick", `deleteBox('${box.id}', '${boxesClassName}', '${elementPageNum}', '${elementNum}');`);
        }
    }
}

function addAnotherRadioButton(radioButtonsId) {
    radioButtonsLabels++;
    var radio = document.getElementById(radioButtonsId);
    radio.insertAdjacentHTML("beforeend", `<div class="p${pagesNum}e${elementsNum}labels" id="p${pagesNum}e${elementsNum}radioButtonsLabel${radioButtonsLabels}div"><label for="p${pagesNum}e${elementsNum}radioButtonsLabel${radioButtonsLabels}" class="form-label mt-4 ">what the name of the RadioButton label?</label>
    <input type="text" class="form-control " id="p${pagesNum}e${elementsNum}radioButtonsLabel${radioButtonsLabels}" placeholder="Enter RadioButton label name"><button style="display:block" class="p${pagesNum}e${elementsNum}class btn btn-danger mt-4" onclick="deleteRadioButton('p${pagesNum}e${elementsNum}radioButtonsLabel${radioButtonsLabels}div','p${pagesNum}e${elementsNum}labels','p${pagesNum}','e${elementsNum}');">X</button></div>`);
}

function deleteRadioButton(labelDivId, radioButtonsClassName, elementPageNum, elementNum) {
    var radioButtonsDiv = document.getElementById(labelDivId);
    radioButtonsDiv.parentNode.removeChild(radioButtonsDiv);
    radioButtonsLabels--;
    var removedRadioButtonNum = parseInt(labelDivId.charAt(21));
    var radioButtons = document.getElementsByClassName(radioButtonsClassName);
    for (let i = 0; i < radioButtons.length; i++) {
        var radioButton = radioButtons[i];
        var radioButtonNum = parseInt(radioButton.id.charAt(21));
        if (radioButtonNum > removedRadioButtonNum) {
            radioButtonNum--;
            radioButton.id = `${elementPageNum}${elementNum}radioButtonsLabel${radioButtonNum}div`;
            radioButton.children[0].setAttribute("for", `${elementPageNum}${elementNum}radioButtonsLabel${radioButtonNum}`);
            radioButton.children[1].setAttribute("id", `${elementPageNum}${elementNum}radioButtonsLabel${radioButtonNum}`);
            radioButton.children[2].setAttribute("onclick", `deleteRadioButton('${radioButton.id}', '${radioButtonsClassName}', '${elementPageNum}', '${elementNum}');`);
        }
    }
}