
const displayBarToMemory = document.getElementById('displayBar')
const divMemory = document.getElementById('memory')

const memory = (() => {
  let contador = 1
  let memoryList = []
  const clear = () => {
    contador = 0
    getList().length = 0
  }

  const getLastNumber = () => getList()[getLength()]

  const add = (value) => getList().push({ 
    id: contador++, 
    value
  })

  const  sumNum = (x, y) => parseFloat(x) + parseFloat(y)
  const subNum = (x, y) => parseFloat(x) - parseFloat(y)

  const remove = (id) => getList().splice(id, 1)

  const getNumber = (id) => getList()[id]
  const updateNumber = (id, value) => getNumber(id).value = value
  const getList = () => memoryList
  const updateLastNumber = (num) => getList()[getLength()].value = num
  const getLength = () => getList().length - 1

  return { clear, getLastNumber, add, remove, sumNum, subNum, getNumber, updateNumber, getList, updateLastNumber, getLength }

})()

function getValueInDisplay() {
  const displayBarToMemoryValue =  displayBarToMemory.value;
  const valueInDisplay = displayBarToMemoryValue.replaceAll(".","");
  const formatCommas = valueInDisplay.replace(",",".");
  return formatCommas;
}

document.getElementById('ms').addEventListener('click', () => {
  const valueInDisplay = getValueInDisplay()
  memory.add(valueInDisplay)
  const formattedNumber = Intl.NumberFormat().format(valueInDisplay)
  createNumberInMemoryDisplay().innerHTML = formattedNumber
})

document.getElementById('m-').addEventListener('click', () => {
  const valueInDisplay = getValueInDisplay()
  checkIsFirstNumAndCreate(valueInDisplay)
  makeCalculation(memory.getLastNumber().value, valueInDisplay, '-')
})

document.getElementById('m+').addEventListener('click', () => {
  const valueInDisplay = getValueInDisplay()
  checkIsFirstNumAndCreate(valueInDisplay)
  makeCalculation(memory.getLastNumber().value, valueInDisplay, '+')
})


document.getElementById('mr').addEventListener('click', () => {
  const memoryNumber = memory.getLastNumber().value
  toString(memoryNumber).replace(".",",").replaceAll(".",",")
  const formattedNumber = Intl.NumberFormat().format(memoryNumber);
  displayBarToMemory.value = formattedNumber
})

document.getElementById('mc').addEventListener('click', () => {
  memory.clear()
  divMemory.querySelectorAll('.memoryNumbers').forEach((item) => item.remove())
  divMemory.querySelectorAll('.buttonsInMemoryDisplay').forEach((item) => item.remove())
  divMemory.querySelectorAll('.divMemoryNumbers').forEach((item) => item.remove())
})

const makeCalculation = (x, y, operator) => {
  let num = 0
  if(operator === '+') {
    num = memory.sumNum(x, y)
  }
  if(operator === '-') {
    num = memory.subNum(x, y)
  }
  memory.updateLastNumber(num)
  getLastNumberInMemoryDisplayAndRebase(memory.getLastNumber().value)
}

const getLastNumberInMemoryDisplayAndRebase = (content) => document.getElementById(`num${memory.getLength()}`).innerHTML = Intl.NumberFormat().format(content)

const createNumberInMemoryDisplay = () => {
  const divNumbers = document.createElement('div')
  divNumbers.classList.add('divMemoryNumbers')
  divNumbers.id = `${memory.getLength()}`

  const p = document.createElement('p')
  p.className = `memoryNumbers`
  p.id = `num${memory.getLength()}`
  
  divMemory.append(divNumbers)
  divNumbers.append(p)
  createButtonsInButtomMemoryNumber(divNumbers)
  return p
}

const updateNumberInMemoryDisplay = (id, value) => {
  let numberToUpdate = document.getElementById('num' + id)
  numberToUpdate.textContent = value
}

const checkIsFirstNumAndCreate = (num) => {
  if (memory.getLength() < 0) {
    memory.add(0)
    createNumberInMemoryDisplay().innerHTML = num
  }
}

const createButtonsInButtomMemoryNumber = (e) => {
  const buttonMPlus = document.createElement('button')
  buttonMPlus.innerHTML = 'M+'
  buttonMPlus.id = 'm+InMemoryDisplay'
  buttonMPlus.className = 'plusButtonsInMemoryDisplay'
  buttonMPlus.classList.add("divMemoryButtons");

  const buttonMMinus = document.createElement('button')
  buttonMMinus.innerHTML = 'M-'
  buttonMMinus.id = 'm-InMemoryDisplay'
  buttonMMinus.className = 'minButtonsInMemoryDisplay'  
  buttonMMinus.classList.add("divMemoryButtons");

  const buttonMC = document.createElement('button')
  buttonMC.innerHTML = 'MC'
  buttonMC.id = 'mcInMemoryDisplay'
  buttonMC.className = 'resetButtonsInMemoryDisplay'  
  buttonMC.classList.add("divMemoryButtons");


  buttonMMinus.addEventListener('click', () => {
    const displayValue = getValueInDisplay()
    const id = parseInt(buttonMMinus.parentElement.id)
    const memoryNumber = memory.getNumber(id).value;

    const subNumber = memory.subNum(memoryNumber, displayValue)
    memory.updateNumber(id, subNumber)

    toString(subNumber).replace(".",",").replaceAll(".",",")
    const formattedNumber = Intl.NumberFormat().format(subNumber);
    updateNumberInMemoryDisplay(id, formattedNumber);
  })

  buttonMC.addEventListener('click', () => {
    const id = parseInt(buttonMC.parentElement.id)
    const divToRemove = document.getElementById(id)
    memory.remove(id)

    document.querySelectorAll('.divMemoryNumbers').forEach(i => {
      if(i.id > id) {
        i.id = i.id - 1
      }
    })
    document.querySelectorAll('.memoryNumbers').forEach(i => {
      let itemId = parseInt(i.id.replace('num', ''))
      if(itemId > id) {
        i.id = `num${itemId - 1}`
        console.log(itemId)
      }
    })
    divMemory.removeChild(divToRemove)
  })

  buttonMPlus.addEventListener('click', () => {
    const displayValue = getValueInDisplay()
    const id = parseInt(buttonMPlus.parentElement.id)
    const memoryNumber = memory.getNumber(id).value;

    const sumNumber = memory.sumNum(memoryNumber, displayValue)

    memory.updateNumber(id, sumNumber)

    toString(sumNumber).replace(".",",").replaceAll(".",",")
    const formattedNumber = Intl.NumberFormat().format(sumNumber);

    updateNumberInMemoryDisplay(id, formattedNumber);
  })

  document.getElementById(`num${memory.getLength()}`).addEventListener('click', () => {
    const id = parseInt(buttonMPlus.parentElement.id)
    const memoryNumber = memory.getNumber(id).value;

    const formattedNumber = Intl.NumberFormat().format(memoryNumber);
    displayBarToMemory.value = formattedNumber
  })

  e.append(buttonMPlus, buttonMMinus, buttonMC)
}