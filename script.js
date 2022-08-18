let form = document.querySelector("form");

// Listeners
form.addEventListener("keyup", e => {
    if (e.target.matches("input[type='text']")) {
        updateValue(e.target);
    }
});

form.addEventListener("click", e => {
    if (e.target.matches("input[type='submit'")) {
        checkFormCorrectness();
    }
});

// If page reloaded, put the current form text on the card
for (let elem of form) {
    if (elem.matches("input[type='text']")) {
        updateValue(elem);
    }
}

// Functions
function updateValue(elem) {
    let creditCardItem;
    let defaultValue;

    switch (elem.id) {
        case "card-number":
            creditCardItem = document.getElementById("card-number-in-card");
            if (elem.value == "") defaultValue = "0000 0000 0000 000"
            break;

        case "holder-name":
            creditCardItem = document.getElementById("holder-name-in-card");
            if (elem.value == "") defaultValue = "Jane Appleseed"
            break;

        case "exp-date-mm":
            creditCardItem = document.getElementById("mm-in-card");
            if (elem.value == "") defaultValue = "00"
            break;

        case "exp-date-yy":
            creditCardItem = document.getElementById("yy-in-card");
            if (elem.value == "") defaultValue = "00"
            break;

        case "cvc":
            creditCardItem = document.getElementById("cvc-in-card");
            if (elem.value == "") defaultValue = "123"
            break;
    }

    if (defaultValue) {
        creditCardItem.textContent = defaultValue;
    } else {
        creditCardItem.textContent = elem.value;
    }
}

function createWarning(elem, message) {
    let warning = document.createElement("span");
    warning.textContent = message;
    warning.classList.add("warning-message");

    if      (elem.matches("#holder-name-warning")) {
        warning.style.gridArea = "holder-name-warning";
    }
    else if (elem.matches("#card-number")) {
        warning.style.gridArea = "card-number-warning";
    }
    else if (elem.matches("#exp-date")) {
        warning.style.gridArea = "exp-date-warning";
    }
    else if (elem.matches("#cvc")) {
        warning.style.gridArea = "cvc-warning";
    }
    elem.after(warning);
}

function cleanWarnings() {
    let warningMessages = document.body.querySelectorAll(".warning-message");
    if (warningMessages.length == 0) return;
    for (let i = warningMessages.length-1; i >= 0; i--) {
        warningMessages[i].remove();
    }

    let redBorderFields = document.body.querySelectorAll(".warning-border");
    for (let field of redBorderFields) {
        field.classList.remove("warning-border")
    }
}

function checkFormCorrectness() {
    cleanWarnings();
    let formIsCorrect = true;

    for (let elem of form) {
        let warningMessage;
        switch (elem.id) {
            case "holder-name":
                if (elem.value.length == 0) {
                    createWarning(elem.parentElement, "Can't be blank");
                    elem.classList.add("warning-border");
                    formIsCorrect = false;
                }
                break;

            case "card-number":
                if (elem.value.length == 0) {
                    warningMessage = "Can't be blank"
                }
                else if (isNaN(elem.value.replace(/ /g, ""))) {
                    warningMessage = "Wrong format, numbers only"
                } 

                if (warningMessage) {
                    createWarning(elem.parentElement, warningMessage);
                    elem.classList.add("warning-border");
                    formIsCorrect = false;
                }
                break;
    
            case "exp-date-mm": case "exp-date-yy":
                if (elem.value.length == 0) {
                    warningMessage = "Can't be blank";
                } else if (isNaN(elem.value.replace(/ /g, ""))) {
                    warningMessage = "Wrong format, numbers only"
                } else if (elem.value.length != 2) {
                    warningMessage = "Field must have two digits";
                }
                
                if (warningMessage) {
                    // Create only if theres no other warning
                    if (! elem.parentElement.nextElementSibling.matches("span")) {
                        createWarning(elem.parentElement, warningMessage);
                    }
                    elem.classList.add("warning-border");
                    formIsCorrect = false;
                }
                break;
    
            case "cvc":
                if (elem.value.length == 0) {
                    warningMessage = "Can't be blank";
                } else if (isNaN(elem.value.replace(" ", ""))) {
                    warningMessage = "Wrong format, numbers only";
                } else if (elem.value.length != 3) {
                    warningMessage = "Field must have three digits";
                }

                if (warningMessage) {
                    createWarning(elem.parentElement, warningMessage);
                    elem.classList.add("warning-border");
                    formIsCorrect = false;
                }
                break;
        }
    }

    if (formIsCorrect) {
        let rightSideArea = form.parentElement;
        rightSideArea.innerHTML = `\
                          <img src="images/icon-complete.svg" style="justify-self:center; margin-bottom:30px" alt="card added">\
                          <h1 style="margin-bottom:20px; font-weight:lighter; letter-spacing:3px">THANK YOU!</h1>\
                          <p style="font-size:large; color:var(--dark-violet)">We've added your card details</p>`;
                          rightSideArea.style.textAlign = "center";
                        //   rightSideArea.querySelector("img").style.justifySelf = "center";
    }
}
