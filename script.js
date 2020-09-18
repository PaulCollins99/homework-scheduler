var lastTask;
var lastTT;
let test;
let importJSON = false
let input

function clickHandler(ev, t, timeTable) {
  if (!importJSON) {
    if (lastTask)
      timeTable.unFocusTask(lastTask);
    if (lastTT)
      timeTable.unbindTasks();
    lastTask = t;
    lastTT = timeTable
    timeTable.bindTaskForm(t, $("#edit-form"));
    timeTable.focusTask(t);
  }

}


function exportAsJson(t) {
  jsonexport = t.toJsonObj()
  localStorage.setItem("save", JSON.stringify(jsonexport))
}

function downloadJSON() {
  var text = JSON.stringify(timeTable.toJsonObj(), null, 2);
  var filename = "schedule.json";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

function importFile() {
  const fileToImport = document.getElementById('fileToImport');
  const file = fileToImport.files[0];
  const fileReader = new FileReader();
  fileReader.addEventListener('load', function () {
    input = this.result
    importJson()
  });
  fileReader.readAsText(file);
}

function importJson() {

  timeTable.tasks.forEach(task => {
    timeTable.removeTask(task)
  })

  importJSON = true;
  timeTable.unbindTasks();
  timeTable.fromJsonObj(JSON.parse(input))
  for (let i=0; i<timeTable.tasks.length; i++) {
    timeTable.tasks[i].range.$el.addClass(timeTable.tasks[i].info.unpaid_minutes.get().toLowerCase())
  }
  importJSON = false
}

$('#create-form-1').submit(function (e) {
  e.preventDefault();
  var sArray = $(this).serializeArray();
  console.log(sArray);
  var params = {};
  for (var t of sArray) {
    params[t.name] = t.value;
  }
  importJSON = true
  timeTable.addTask(params);

  for (let i=0; i<timeTable.tasks.length; i++) {
    timeTable.tasks[i].range.$el.addClass(timeTable.tasks[i].info.unpaid_minutes.get().toLowerCase())
  }
  
  importJSON = false
});

$('.delete-task').click(function (e) {
  e.preventDefault();
});

function changeHandler () {
  for (let i=0; i<timeTable.tasks.length; i++) {
    let arr = timeTable.tasks[i].range.$el[0].className.split(" ")
    if (arr.includes("meeting")) {
      timeTable.tasks[i].range.$el.removeClass("meeting")
    } else if (arr.includes("interview")) {
      timeTable.tasks[i].range.$el.removeClass("interview")
    }
    timeTable.tasks[i].range.$el.addClass(timeTable.tasks[i].info.unpaid_minutes.get().toLowerCase())
    //console.log(timeTable.tasks[i].range.$el[0].classList.includes())
  }
}

var timeTable = new TimeTable();
$("#sliders").prepend(timeTable.$el);
timeTable.on("click.task", clickHandler);
timeTable.on('addtask', clickHandler)
timeTable.on("change.task", changeHandler)


window.downloadJSONBtn.addEventListener("click", downloadJSON)
window.importBtn.addEventListener("click", importFile)