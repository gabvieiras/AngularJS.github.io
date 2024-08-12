const operationsDone = [];
let firstNum = 0;
let secondNum = 0;
let opSelected = '';
let countSelectedValues = 0;
const containerHistoric = document.querySelector("#historic");
let wasMemoryFunctionUsed = false;

const calculator = (function () {

    const add = (a, b) => parseFloat(a) + parseFloat(b);
    const sub = (a, b) => parseFloat(a) - parseFloat(b);
    const mul = (a, b) => parseFloat(a) * parseFloat(b);
    const div = (a, b) => parseFloat(a) / parseFloat(b);

    return { add, sub, mul, div }
})();

function createOperation(calculusBarValue, displayBarValue) {

    return { calculusBarValue, displayBarValue }
}

const container = document.querySelector('#container');
const displayBar = document.querySelector('#displayBar');
const calculusBar = document.querySelector('#calculusBar');
const numButtons = document.querySelectorAll('.numButton');
const opButtons = document.querySelectorAll('.opButton');
const equalButton = document.querySelector('#equalButton');
const changeButtons = document.querySelectorAll('.changeButton');
const valButtons = document.querySelectorAll('.valButton');

changeButtons.forEach(item => {
    item.addEventListener('click', () => {
        enableBtns();

        let possibleOp = ["ce", "c", "backSpace"];
        for (let op of possibleOp) {
            if (op == item.value) {
                if (op == "c") {
                    opSelected = "";
                    clearAll = true;
                    clearDisplays(clearAll);
                } else if (op == "ce") {
                    clearAll = false;
                    opSelected = "";
                    clearDisplays(clearAll);
                }
                else if (op == "backSpace") {
                    delOneValue();
                }
            }
        }
        countSelectedValues = 0;
    });
});

opButtons.forEach(item => {
    item.addEventListener('click', () => {
        countSelectedValues = 0;
        firstNum = displayBar.value;
        opSelected = item.value;

        if (item.value == "*") {
            opSelected = "x";
        }
        showCalculus(firstNum, opSelected);
    });
});

numButtons.forEach(item => {
    item.addEventListener('click', () => {
        enableBtns();
        insertValue(item.innerText);
        wasMemoryFunctionUsed = false;
    });
});

valButtons.forEach(item => {
    item.addEventListener('click', () => {
        displayBar.value = displayBar.value.replace(".", "").replace(",", ".");
        if (item.value != "," && item.value != "%") {
            opSelected = item.value;
            countSelectedValues = 0;
        }

        switch (item.value) {
            case '1/x':
                if (displayBar.value == 0) {
                    displayBar.value = 'Não é possível dividir por 0';
                    displayBar.style.fontSize = "300%";
                    disableBtns();
                    return;
                } else {
                    calculusBar.value = `1/${displayBar.value}`;
                    displayBar.value = 1 / displayBar.value;
                    displayBar.value = displayBar.value.replace(".", ",");
                    break;
                }

            case '²':
                calculusBar.value = `(${displayBar.value})²`;
                displayBar.value = Math.pow(displayBar.value, 2);
                displayBar.value = displayBar.value.replace(".", ",");
                break;
            case '√':
                calculusBar.value = `√${displayBar.value}`;
                displayBar.value = Math.sqrt(displayBar.value);
                displayBar.value = displayBar.value.replace(".", ",");
                break;
            case '+-':
                displayBar.value = negate(displayBar.value);
                break;
            case ',':
                if (!displayBar.value.includes(',')) {
                    displayBar.value = displayBar.value + ',';
                }
                break;
            case '%':
                let percentage = displayBar.value / 100 * firstNum
                displayBar.value = percentage.toString().replace(".", ",");
                break;
        }


    })
})

let isBasicOperation = false;
function getDisplayBarValues() {
    let displayBarArr = []
    let possibleOp = ["+", "-", "x", "÷"];
    for (let op of possibleOp) {
        if (firstNum < 0) {
            displayBarArr.push(firstNum.replace(',', '.'));
            displayBarArr.push(opSelected);
            displayBarArr.push(displayBar.value.replace(',', '.'));
            return displayBarArr;
        } else if (opSelected == op) {
            isBasicOperation = true;
            if (calculusBar.value[0] == "-" || calculusBar.value[0] == "+") {
                displayBarArr.push(calculusBar.value.split(opSelected)[1].trim());
            } else {
                displayBarArr.push(calculusBar.value.split(opSelected)[0].trim());
               
            }
            displayBarArr.push(opSelected);
        }
    }
    if (isBasicOperation == false) {
        
        isBasicOperation = false;
        secondNum = undefined;
        displayBarArr.push(calculusBar.value.replaceAll('.', ''));
        displayBarArr.push(displayBar.value);

        return displayBarArr;
    }
    displayBarArr.push(displayBar.value);

    return displayBarArr;
}

equalButton.addEventListener('click', onEqualButton);

function startProgram() {
    setMyKeyDownListener();
    displayBar.value = "0";
}

function insertValue(value) {
    if (isDisplayBarEmpty()) {
        displayBar.value = "";
    }
    if (isFirstNumSelected() && countSelectedValues == 0) {
        countSelectedValues++;
        displayBar.value = "";
    }
    if (wasMemoryFunctionUsed) {
        displayBar.value = "";
    }
    if (displayBar.value.length < 21) {
        displayBar.value += value;
        let valueWithoutPoints = displayBar.value.replaceAll('.', '');

        if (displayBar.value.includes(',')) {
            if (value != 0) {
                let parts = valueWithoutPoints.split(',');
                if (parts[1] != "") {
                    displayBar.value = Intl.NumberFormat().format(parts[0].replaceAll('.', '')) + ',' + parts[1];
                } else {
                    displayBar.value = Intl.NumberFormat().format(parts[0].replaceAll('.', ''))
                }

            }
        } else {
            if (Number.isInteger(parseFloat(valueWithoutPoints))) {
                displayBar.value = Intl.NumberFormat().format(valueWithoutPoints);
            }
        }
    }
}

/*Lógica para aceitar as letras do teclado */
function setMyKeyDownListener() {
    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                enableBtns();
                insertValue(event.key);
                break;
            case "+":
            case "-":
                firstNum = displayBar.value;
                opSelected = event.key;
                showCalculus(firstNum, opSelected);
                break;
            case "*":
            case "x":
                firstNum = displayBar.value;
                opSelected = "x";
                showCalculus(firstNum, opSelected)
                break;
            case "/":
                firstNum = displayBar.value;
                opSelected = "÷";
                showCalculus(firstNum, opSelected)
                break;
            case "numPadEnter":
            case "Enter":
            case "=":
                onEqualButton();
                break;
            case ',':
                displayBar.value = displayBar.value + ',';
                break;
        }
    });
}

function onEqualButton() {
    if(opSelected == "") {
        countSelectedValues = 0;
        valuesAndOpArr = getDisplayBarValues();
        clearDisplays(true);
        calculusBar.value = valuesAndOpArr[1];
        displayBar.value = valuesAndOpArr[1];
        addEqualOnCalculusBar();
        operationsDone.unshift(createOperation(calculusBar.value, displayBar.value));
        updateHistoric();
        return;
    }
    else if (displayBar.value == "Não é possível dividir por 0") {
        countSelectedValues = 0;
        clearDisplays(true);
        enableBtns();
    } else if(calculusBar.value.includes("√") || calculusBar.value.includes("²") || calculusBar.value.includes("1/")) {
        valuesAndOpArr = getDisplayBarValues();
        countSelectedValues = 0;
        calculusBar.value = valuesAndOpArr[0];
        displayBar.value = valuesAndOpArr[1];
        addEqualOnCalculusBar();
        operationsDone.unshift(createOperation(calculusBar.value, displayBar.value));
        updateHistoric();
        return;
    }  else {
        countSelectedValues = 0;
        valuesAndOpArr = getDisplayBarValues();
        if (calculusBar.value.includes("=")) {
            firstNum = displayBar.value;

            calculusBar.value = firstNum + " " + opSelected + " " + secondNum + " = "
            isRecalc = true;
            makeOperation()
        } else {
            clearDisplays(true);
            firstNum = valuesAndOpArr[0]
            firstNum = firstNum.replaceAll('.', '');
            if (firstNum.includes(',')) {
                firstNum = firstNum.replace(',', ".");
            }
            secondNum = valuesAndOpArr[2];
            if (secondNum != undefined) { /*Valida se é uma das funções que só precisam de um valor para funcionar */
                secondNum = secondNum.replaceAll('.', '');
                if (secondNum.includes(',')) {
                    secondNum = secondNum.replace(',', ".");
                }
                switch (opSelected) {
                    case '+':
                        displayBar.value = calculator.add(firstNum, secondNum);
                        break;
                    case '-':
                        displayBar.value = calculator.sub(firstNum, secondNum);
                        break;
                    case 'x':
                        displayBar.value = calculator.mul(firstNum, secondNum);
                        break;
                    case '÷':
                        if (secondNum == 0) {
                            displayBar.value = 'Não é possível dividir por 0';
                            disableBtns();
                            return;
                        } else {
                            displayBar.value = calculator.div(firstNum, secondNum);
                            break;
                        }
                }
                if (Number.isInteger(parseFloat(displayBar.value))) {
                    displayBar.value = Intl.NumberFormat().format(displayBar.value);
                } else {
                    displayBar.value = Intl.NumberFormat().format(displayBar.value);
                }
                if (displayBar.value.length > 19) {
                    displayBar.value = parseFloat(displayBar.value.replaceAll('.', '')).toPrecision(15).replace('.', ',');
                }
            } else {
                secondNum = valuesAndOpArr[1];
                displayBar.value = secondNum;
                valuesAndOpArr.pop(secondNum);

            }
            calculusBar.value = ""
            valuesAndOpArr.forEach(element => {
                calculusBar.value += element + " ";
            });
            
            addEqualOnCalculusBar();
            operationsDone.unshift(createOperation(calculusBar.value, displayBar.value));
            updateHistoric();
        }
    }
}

function addEqualOnCalculusBar() {
    if (!calculusBar.value.includes("=")) {
        calculusBar.value += "=";
    }
}

function makeOperation() {
    firstNum = firstNum.replaceAll('.', '');
    if (firstNum.includes(',')) {
        firstNum = firstNum.replace(',', ".");
    }
    secondNum = secondNum.toString().replaceAll('.', '');
    if (secondNum.includes(',')) {
        secondNum = secondNum.replace(',', ".");
    }
    switch (opSelected) {
        case '+':
            displayBar.value = calculator.add(firstNum, secondNum);
            break;
        case '-':
            displayBar.value = calculator.sub(firstNum, secondNum);
            break;
        case 'x':
            displayBar.value = calculator.mul(firstNum, secondNum);
            break;
        case '÷':
            if (secondNum == 0) {
                displayBar.value = 'Não é possível dividir por 0';
                disableBtns();
                return;
            } else {
                displayBar.value = calculator.div(firstNum, secondNum);
                break;
            }
    }
    if (displayBar.value.length > 19) {
        displayBar.value = parseFloat(displayBar.value.replaceAll('.', '')).toPrecision(15);
    } else {
        if (Number.isInteger(parseFloat(displayBar.value))) {
            displayBar.value = Intl.NumberFormat().format(displayBar.value);
        } else {
            displayBar.value = parseFloat(displayBar.value).toPrecision(13);
        }
    }
    operationsDone.unshift(createOperation(calculusBar.value, displayBar.value));
    updateHistoric();
}
    


function showCalculus(firstNum, opSelected) {
    calculusBar.value = firstNum + " " + opSelected;
}

function clearDisplays(clearAll) {
    if (clearAll == true) {
        calculusBar.value = "";
    }
    displayBar.value = "0";
    firstNum = 0;
    secondNum = 0;
}

function negate(num) {
    num = num.replace(/\./g, '').replace(',', '.');
    let negatedNum = (parseFloat(num) * -1).toString().replace('.', ',');
    if (Number.isInteger(parseFloat(negatedNum.replace(',', '.')))) {
        return Intl.NumberFormat().format(negatedNum.replace(',', '.'));
    } else {
        return negatedNum;
    }
}


function delOneValue() {
    displayBar.value = displayBar.value.slice(0, -1);
    if (displayBar.value.length < 1) {
        clearDisplays(false)
    }
}

function isDisplayBarEmpty() {
    return displayBar.value == "0" ? true : false;
}
function isFirstNumSelected() {
    return opSelected != "" && opSelected != "," ? true : false;
}

function disableBtns() {
    opButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disableBtn');
    });
    valButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disableBtn');
    });
}

function enableBtns() {
    opButtons.forEach(btn => {
        if (btn.disabled == true) {
            displayBar.value = '';
            btn.disabled = false;
            btn.classList.toggle('disableBtn');

        }
    });
    valButtons.forEach(btn => {
        if (btn.disabled == true) {
            btn.disabled = false;
            btn.classList.toggle('disableBtn');
        }
    });
}

function updateHistoric() {
    const pCalculusBar = document.createElement("p");
    pCalculusBar.classList.add("paragrafoHistorico");
    let lastValue = operationsDone.at(0);

    const pDisplayBar = document.createElement("p");
    pDisplayBar.classList.add("paragrafoHistorico");
    pDisplayBar.innerHTML = lastValue.displayBarValue;
    pDisplayBar.style.fontWeight = "bold";
    pDisplayBar.style.color = "black";
    pDisplayBar.style.fontSize = "100%";
    pDisplayBar.style.paddingRight = "1.25em";
    pDisplayBar.style.paddingBottom = "1em";
    containerHistoric.insertBefore(pDisplayBar, containerHistoric.firstChild);

    const divHistoric = document.createElement("div");
    divHistoric.classList.add("divHistorico");
    containerHistoric.appendChild(divHistoric);
    pCalculusBar.innerHTML = lastValue.calculusBarValue;
    pCalculusBar.style.fontSize = "15px";
    pCalculusBar.style.paddingRight = "1em";
    containerHistoric.insertBefore(pCalculusBar, containerHistoric.firstChild);
    UpdateElementsWhenDarkModeIsActive(isDarkModeActive);
}

const historicButton = document.querySelector("#historicButton");
const memoryButton = document.querySelector("#memoryButton");
const historicDiv = document.querySelector("#historic");
const memoryDiv = document.querySelector("#memory");
const onClickDiv = document.querySelector("#onClick");

historicButton.addEventListener("click", () => {
    memoryDiv.style.visibility = "hidden";
    memoryDiv.style.display = "none";
    historicDiv.style.display = "block";
});

memoryButton.addEventListener("click", () => {
    memoryDiv.style.visibility = "visible";
    memoryDiv.style.display = "block";
    historicDiv.style.display = "none";
});


document.getElementById('m+').addEventListener('click', changeVarMemoryFunctionUsedStatus);
const buttonMminus = document.getElementById('m-').addEventListener('click', changeVarMemoryFunctionUsedStatus);
const buttonMs = document.getElementById('ms').addEventListener('click', changeVarMemoryFunctionUsedStatus);

let buttonsMMinusInMemory = document.querySelectorAll('.minButtonsInMemoryDisplay');
let buttonsMPlusInMemory = document.querySelectorAll('.plusButtonsInMemoryDisplay');
let buttonsMcInMemory = document.querySelectorAll('.resetButtonsInMemoryDisplay');

function changeVarMemoryFunctionUsedStatus() {
    countSelectedValues = 0;
    wasMemoryFunctionUsed = true;
}

function updateMemoryElements() {
    buttonsMMinusInMemory = document.querySelectorAll('.minButtonsInMemoryDisplay');
    for (let i = 0; i < buttonsMMinusInMemory.length; i++) {
        buttonsMMinusInMemory[i].addEventListener('click', changeVarMemoryFunctionUsedStatus);
    }
    buttonsMPlusInMemory = document.querySelectorAll('.plusButtonsInMemoryDisplay');
    for (let i = 0; i < buttonsMPlusInMemory.length; i++) {
        buttonsMPlusInMemory[i].addEventListener('click', changeVarMemoryFunctionUsedStatus);
    }

    buttonsMcInMemory = document.querySelectorAll('.resetButtonsInMemoryDisplay');
    for (let i = 0; i < buttonsMcInMemory.length; i++) {
        buttonsMcInMemory[i].addEventListener('click', changeVarMemoryFunctionUsedStatus);
    }
}

memoryDiv.addEventListener('mouseover', () => {
    updateMemoryElements();
});

const darkModeBtn = document.querySelector("#darkMode").addEventListener("click", toggleDarkMode);
const buttons = document.querySelector("#buttons").childNodes;
const mainContainer = document.querySelector("#container");
const rightDiv = document.querySelector("#right");
const displayDiv = document.querySelector("#display");
const numberDiv = document.querySelector("#number");
const images = document.querySelectorAll("img");
const menuIcon = document.querySelector(".menu-icon");
const titleDiv = document.querySelector("#tittle h3");
const minimizeButton = document.querySelector("#minimizeMemory button");

let isDarkModeActive = false;
/*Ativar/desativar dark mode pelo JS*/
function toggleDarkMode() {

    memoryButton.classList.toggle("darkColorWhite");
    historicButton.classList.toggle("darkColorWhite");
    equalButton.classList.toggle('darkBgLightBlue');
    /*Memory buttons */
    buttons.forEach(element => {
        if (element.nodeType == 1) element.classList.toggle("darkColorWhite");
    });
    displayBar.classList.toggle('darkBgLightBlack');
    calculusBar.classList.toggle('darkBgLightBlack');
    displayBar.classList.toggle('darkColorWhite');
    calculusBar.classList.toggle('darkColorWhite');
    rightDiv.classList.toggle("darkBgLightBlack");
    displayDiv.classList.toggle("darkBgLightBlack");
    displayDiv.classList.toggle("numberDiv");
    mainContainer.classList.toggle('darkBgLightBlack');
    numberDiv.classList.toggle('darkBgLightBlack');
    menuIcon.classList.toggle('darkColorWhite');
    titleDiv.classList.toggle('darkColorWhite');
    minimizeButton.classList.toggle('darkColorWhite')

    numButtons.forEach(element => {
        element.classList.toggle("darkBglightGray");
        element.classList.toggle("darkColorWhite");
    });
    opButtons.forEach(element => {
        element.classList.toggle("darkBgDarkGray");
        element.classList.toggle("darkColorWhite");
    });
    changeButtons.forEach(element => {
        element.classList.toggle("darkBgDarkGray");
        element.classList.toggle("darkColorWhite");
    });
    valButtons.forEach(element => {
        element.classList.toggle("darkBgDarkGray");
        element.classList.toggle("darkColorWhite");
    });
    memoryDiv.classList.toggle("darkColorWhite");
    historicDiv.classList.toggle("darkColorWhite");
    isDarkColorWhiteActive = memoryButton.classList.contains('darkColorWhite');
    if (isDarkColorWhiteActive) {
        isDarkModeActive = true;
        images.forEach(element => {
            pathName = element.src;
            let newPathName = pathName.replace('/image/', '/imageDark/');
            element.srcset = newPathName;
        });
    }
    else {
        isDarkModeActive = false;
        images.forEach(element => {
            pathName = element.src;
            let newPathName = pathName.replace('/imageDark/', '/image/');
            element.srcset = newPathName;

        });
    }
    UpdateElementsWhenDarkModeIsActive()
}

function UpdateElementsWhenDarkModeIsActive() {
    if (isDarkModeActive) {
        const memoryDivs = document.querySelectorAll(".divMemoryNumbers")
        memoryDivs.forEach(element => {
            element.classList.add("darkBgMemoryDiv");
        });
        const divMemoryButtons = document.querySelectorAll(".divMemoryButtons")
        divMemoryButtons.forEach(element => {
            element.classList.add("darkBgMemoryDiv");
            element.classList.add("darkColorWhite");
            element.classList.add("darkBgMemoryBtns");
        })
        const paragrafosHistorico = document.querySelectorAll("#historic p");
        paragrafosHistorico.forEach(element => {
            element.classList.add("darkColorWhite");
            element.style.color = "";
        });
    } else {
        const memoryDivs = document.querySelectorAll(".divMemoryNumbers")
        memoryDivs.forEach(element => {
            element.classList.remove("darkBgMemoryDiv");
        });
        const divMemoryButtons = document.querySelectorAll(".divMemoryButtons")
        divMemoryButtons.forEach(element => {
            element.classList.remove("darkBgMemoryDiv");
            element.classList.remove("darkColorWhite");
            element.classList.remove("darkBgMemoryBtns");
        })
        const paragrafosHistorico = document.querySelectorAll("#historic p");
        paragrafosHistorico.forEach(element => {
            element.classList.remove("darkColorWhite");
            element.style.color = "";
        });
    }

}