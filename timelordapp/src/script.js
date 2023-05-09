

//DOM
const firstDate = document.getElementById("first-date");
const secondDate = document.getElementById("second-date");
const addWeekButton = document.getElementById("week");
const addMonthButton = document.getElementById("month");
const typeOfDays = document.getElementById("days-select");
const countingUnits = document.getElementById("units");
const startButton = document.getElementById("start-button");
let output = document.querySelector("output");
let resultTable = document.querySelector(".result-table");
let rows = resultTable.rows;

//TIME UNITS
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
const MILLISECONDS_IN_MINUTE = 60 * 1000;
const MILLISECONDS_IN_SECOND = 1000;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = 24 * 60;
const SECONDS_IN_DAY = 24 * 60 * 60;

//DATES ENTRY
//fisrt date
firstDate.onchange = function () {
    if (firstDate.value === "") {
      startButton.disabled = true;
    } else {
      secondDate.setAttribute("min", this.value);
    }
};
//second date
secondDate.onchange = function () {
    if (secondDate.value === "") {
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
    firstDate.setAttribute("max", this.value);
};

//PRESETS
//week
addWeekButton.onclick = function () {
    let receivedDate = new Date(firstDate.value);
    let datePlusWeek = new Date(receivedDate);
    datePlusWeek.setDate(receivedDate.getDate() + 7);
    secondDate.valueAsDate = datePlusWeek;
    startButton.disabled = false;
};
//month
addMonthButton.onclick = function () {
    let receivedDate = new Date(firstDate.value);
    let datePlusMonth = new Date(receivedDate);
    datePlusMonth.setMonth(receivedDate.getMonth() + 1);
    secondDate.valueAsDate = datePlusMonth;
    startButton.disabled = false;
};

//TRANSFORMATIONS

//transformation result into chosen units for all days
function transformIntoTimeUnitsAllDays (calcResult, countingUnits) {
    let transformedResult = 0;
    switch (countingUnits) {
        case "days":
            transformedResult = calcResult / MILLISECONDS_IN_DAY + 1;
            break;
          case "hours":
            transformedResult = calcResult / MILLISECONDS_IN_HOUR + HOURS_IN_DAY;
            break;
          case "minutes":
            transformedResult = calcResult / MILLISECONDS_IN_MINUTE + MINUTES_IN_DAY;
            break;
          case "seconds":
            transformedResult = calcResult / MILLISECONDS_IN_SECOND + SECONDS_IN_DAY;
            break;
        }
        return transformedResult;
    }

//transformation result into chosen units for specific days
function transformIntoTimeUnitsSpecificDays (calcResult, countingUnits) {
    switch (countingUnits) {
        case "days":
            transformedResult = calcResult;
            break;
          case "hours":
            transformedResult = calcResult * HOURS_IN_DAY;
            break;
          case "minutes":
            transformedResult = calcResult * MINUTES_IN_DAY;
            break;
          case "seconds":
            transformedResult = calcResult * SECONDS_IN_DAY;
            break;
        }
        return transformedResult;
 }

//CALCULATIONS

//all days - difference
function calcAllDaysBetweenDates (start, end, countingUnits) {
    let daysInPeriod;
    let startDate = new Date (start);
    let endDate = new Date (end);
    let calcResult = Date.parse(endDate) - Date.parse(startDate);
    return `${daysInPeriod = Math.round(transformIntoTimeUnitsAllDays(calcResult, countingUnits))} ${countingUnits}`;
}

//weekend detection
function isWeekend(date) {
    let newDate = new Date(date);
    let day = newDate.getDay();  
    return day === 0 || day === 6;
}

//weekends - difference
function calcWeekends (start, end, countingUnits) {
    let weekendsInPeriod;
    let calcResult = 0;
    day = start.getDay();
    while (start <= end) {
        if (isWeekend (start)){
            calcResult++
        }
        start.setDate(start.getDate()+1)
    }
     return `${weekendsInPeriod = transformIntoTimeUnitsSpecificDays (calcResult, countingUnits)} ${countingUnits}`
}

// working dates - difference
function calcWorkdays (start, end, countingUnits) {
    let workdaysInPeriod;
    let calcResult = 0;
    day = start.getDay();
    while (start <= end) {
        if (!isWeekend (start)){
            calcResult++
        }
        start.setDate(start.getDate()+1)
    }
    return `${workdaysInPeriod = transformIntoTimeUnitsSpecificDays (calcResult, countingUnits)} ${countingUnits}`
}


//DISPLAY RESULTS

//current result

startButton.addEventListener("click", function calculateDifference() {
    if (typeOfDays.value === "allDays") {
        output.innerHTML = calcAllDaysBetweenDates(
          new Date(firstDate.value),
          new Date(secondDate.value),
          countingUnits.value
        );
        }
    if (typeOfDays.value === "weekends") {
        output.innerHTML = calcWeekends(
            new Date(firstDate.value),
            new Date(secondDate.value),
            countingUnits.value
        );
        }
    if (typeOfDays.value === "workdays") {
      output.innerHTML = calcWorkdays(
        new Date(firstDate.value),
        new Date(secondDate.value),
        countingUnits.value
      );
    }

//previous results

    resultTable.style.display = "table";

  let rowAmount = resultTable.rows.length;
  if (rowAmount > "10") {
    rows[1].remove();
  }

  let data = {
    start: new Date(firstDate.value).toDateString(),
    end: new Date(secondDate.value).toDateString(),
    result: output.value,
  };
  addRow(data.start, data.end, data.result);
  storeToLocalStorage(data);
});

function addRow(start, end, result) {
    let item = `
      <tr class="new-row">
        <td class="startDate">${start}</td>
        <td class="endDate">${end}</td>
        <td class="result">${result}</td>
      </tr>
      `;
    resultTable.insertAdjacentHTML("beforeend", item);
  }
  
  let resultData = [];
  let savedResults = JSON.parse(localStorage.getItem("resultData"));
  if (savedResults) {
    for (let value of savedResults) {
      addRow(value.start, value.end, value.result);
    }
    resultTable.style.display = "table";
  }
  
  function storeToLocalStorage(data) {
    if (!savedResults) {
      savedResults = [];
    }
    if (savedResults.length >= 10) {
      savedResults.shift();
    }
  
    savedResults.push(data);
    localStorage.setItem("resultData", JSON.stringify(savedResults));
}