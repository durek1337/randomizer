/**
 * Zufallsbasierte Schüler:innen-Zuweisung
 * ---------------------------------------
 * Dieses Script ermöglicht:
 * - Verwaltung mehrerer Schüler:innen-Listen
 * - Drag & Drop Sortierung
 * - Zufallsauswahl mit Gewichtung
 * - CSV/JSON Import & Export
 * - Lokale Speicherung (localStorage)
 * 
 * Wichtige Funktionen:
 * - `randomizedPick()` — Auswahl nach Gewichtung (z. B. *-Markierung)
 * - `getCurrentList()` — Zugriff auf aktive Liste
 * - `showList()` — Rendering und Sortieraktivierung
 * - `saveToLocalStorage()` — Änderungen dauerhaft speichern
 * 
 * Erweiterungen:
 * - Undo, Datenvalidierung, Kalenderplanung etc. sind leicht ergänzbar.
 */


let quantifier = 1;
let currentListName = "Standardliste";
let lists = {};

function saveToLocalStorage() {
  localStorage.setItem("lists", JSON.stringify(lists));
  localStorage.setItem("currentListName", currentListName);
}

function loadFromLocalStorage() {
  const savedLists = localStorage.getItem("lists");
  const savedCurrent = localStorage.getItem("currentListName");

  if (savedLists) {
    lists = JSON.parse(savedLists);
  } else {
    lists = {
      "Standardliste": ["Sofia", "Emilia+Lilly", "Louisa+Lea", "Marcus+Anton"]
    };
  }

  if (savedCurrent && lists[savedCurrent]) {
    currentListName = savedCurrent;
  } else {
    currentListName = Object.keys(lists)[0];
  }
}

function getCurrentList() {
  return lists[currentListName];
}

function setCurrentList(newList) {
  lists[currentListName] = newList;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function randomizedPick() {
  document.getElementById("resultList").innerHTML = "";
  const result = getRandomUniqueElements(getCurrentList(), quantifier);
  for (let i = 0; i < result.length; i++) {
    addStudent(result[i]);
    await delay(500);
  }
}

function getRandomUniqueElements(array, quantifier) {
  if (quantifier > array.length) {
    throw new Error("Nicht genug einzigartige Elemente im Array.");
  }
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, quantifier);
}

function addStudent(student) {
  const resultList = document.getElementById("resultList");
  const li = document.createElement("li");
  li.style.opacity = 0;
  li.innerHTML = `<span class='index'>${resultList.children.length + 1}.</span> <span class='entry'>${student}</span>`;
  resultList.appendChild(li);
  setTimeout(() => {
    li.style.opacity = 1;
  }, 300);
}

function showList() {
  const list = getCurrentList();
  const listHTML = "<ul>" + list.map((e, i) => (
    "<li>" + e +
    " <button onclick='editStudent(" + i + ")'>✏️</button>" +
    " <button onclick='removeStudent(" + i + ")'>🗑️</button>" +
    "</li>"
  )).join("") + "</ul>";
  document.getElementById("list").innerHTML = listHTML;
  document.getElementById("headList").textContent = "Zur Auswahl (" + list.length + ")";
}

function addNewStudent() {
  const input = document.getElementById("newStudentInput");
  const name = input.value.trim();
  if (name && !getCurrentList().includes(name)) {
    getCurrentList().push(name);
    input.value = "";
    saveToLocalStorage();
    showList();
    updateQuantifierSelect();
  }
  input.focus();
}

function removeStudent(index) {
  getCurrentList().splice(index, 1);
  saveToLocalStorage();
  showList();
  updateQuantifierSelect();
}

function editStudent(index) {
  const newName = prompt("Neuer Name für: " + getCurrentList()[index], getCurrentList()[index]);
  if (newName && newName.trim()) {
    getCurrentList()[index] = newName.trim();
    saveToLocalStorage();
    showList();
  }
}

function updateQuantifierSelect() {
  const select = document.getElementById("quantifierSelect");
  select.innerHTML = "";
  for (let i = 1; i <= getCurrentList().length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
  quantifier = Math.min(quantifier, getCurrentList().length);
}

function updateListSelector() {
  const select = document.getElementById("listSelector");
  select.innerHTML = "";
  for (const listName in lists) {
    const option = document.createElement("option");
    option.value = listName;
    option.textContent = listName;
    if (listName === currentListName) {
      option.selected = true;
    }
    select.appendChild(option);
  }
}

function switchList(name) {
  currentListName = name;
  saveToLocalStorage();
  showList();
  updateQuantifierSelect();
  updateListSelector();
  updateTitle();
}

function duplicateList() {
  const newName = prompt("Name der neuen Liste", currentListName + " Kopie");
  if (newName && !lists[newName]) {
    lists[newName] = [...getCurrentList()];
    switchList(newName);
  }
}

function deleteCurrentList() {
  if (confirm("Diese Liste wirklich löschen?")) {
    delete lists[currentListName];
    const remaining = Object.keys(lists);
    if (remaining.length > 0) {
      currentListName = remaining[0];
    } else {
      lists["Neue Liste"] = [];
      currentListName = "Neue Liste";
    }
    saveToLocalStorage();
    switchList(currentListName);
  }
}

function updateTitle() {
  document.title = currentListName + " – Zufallsgenerator";
  const titleInput = document.getElementById("pageTitleInput");
  if (titleInput) {
    titleInput.value = currentListName;
  }
}

function renameListTitle() {
  const input = document.getElementById("pageTitleInput");
  const newName = input.value.trim();
  if (newName && newName !== currentListName && !lists[newName]) {
    lists[newName] = [...getCurrentList()];
    delete lists[currentListName];
    currentListName = newName;
    saveToLocalStorage();
    switchList(currentListName);
  } else {
    input.value = currentListName; // reset to current if invalid
  }
}

function exportLists() {
  const textArea = document.getElementById("jsonArea");
  textArea.value = JSON.stringify(lists, null, 2);
}

function importLists() {
  const textArea = document.getElementById("jsonArea");
  try {
    const imported = JSON.parse(textArea.value);
    if (typeof imported === "object" && !Array.isArray(imported)) {
      lists = imported;
      currentListName = Object.keys(lists)[0] || "Standardliste";
      saveToLocalStorage();
      switchList(currentListName);
    } else {
      alert("Ungültiges Format: Es muss ein Objekt mit Listen sein.");
    }
  } catch (e) {
    alert("Fehler beim Parsen des JSON: " + e.message);
  }
}

window.addEventListener("load", () => {
  loadFromLocalStorage();
  updateTitle();
  showList();
  updateQuantifierSelect();
  updateListSelector();
  document.getElementById("quantifierSelect").addEventListener("change", (ev) => {
    quantifier = parseInt(ev.target.value, 10);
  });
  document.getElementById("newStudentInput").addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      addNewStudent();
    }
  });
  document.getElementById("listSelector").addEventListener("change", (ev) => {
    switchList(ev.target.value);
  });
});


function resetToDefaultList() {
  lists = {
    "Standardliste": [
      "Sofia",
      "Emilia+Lilly",
      "Louisa+Lea",
      "Marcus+Anton",
            "Nelle+Leyla",
      "Elly+Letizia"
    ]
  };
  currentListName = "Standardliste";
  saveToLocalStorage();
  switchList(currentListName);
}


function exportToCSV() {
  const list = getCurrentList();
  let csvContent = "data:text/csv;charset=utf-8,";
  list.forEach((entry, index) => {
    csvContent += (index + 1) + "," + entry + "\n";
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", currentListName + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadBackupFile() {
  const dataStr = JSON.stringify(lists, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "listen-backup.json";
  link.click();
  URL.revokeObjectURL(url);
}

function uploadBackupFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (typeof imported === "object" && !Array.isArray(imported)) {
        lists = imported;
        currentListName = Object.keys(lists)[0] || "Standardliste";
        saveToLocalStorage();
        switchList(currentListName);
      } else {
        alert("Ungültiges Format: Kein gültiges Listenobjekt.");
      }
    } catch (error) {
      alert("Fehler beim Einlesen der Datei: " + error.message);
    }
  };
  reader.readAsText(file);
}

function removeStudent(index) {
  if (confirm("Eintrag wirklich löschen?")) {
    getCurrentList().splice(index, 1);
    saveToLocalStorage();
    showList();
    updateQuantifierSelect();
  }
}

// Drag & Drop Sortierung
function enableSorting() {
  const list = document.getElementById("list").querySelector("ul");
  let dragged;

  list.addEventListener("dragstart", function(event) {
    dragged = event.target;
    event.target.style.opacity = .5;
  });

  list.addEventListener("dragend", function(event) {
    event.target.style.opacity = "";
  });

  list.addEventListener("dragover", function(event) {
    event.preventDefault();
  });

  list.addEventListener("drop", function(event) {
    event.preventDefault();
    if (event.target.tagName === "LI" && dragged !== event.target) {
      const draggedIndex = [...list.children].indexOf(dragged);
      const targetIndex = [...list.children].indexOf(event.target);
      const arr = getCurrentList();
      const [moved] = arr.splice(draggedIndex, 1);
      arr.splice(targetIndex, 0, moved);
      saveToLocalStorage();
      showList();
      updateQuantifierSelect();
    }
  });
}

function showList() {
  const list = getCurrentList();
  const listHTML = "<ul>" + list.map((e, i) => (
    "<li draggable='true'>" + e +
    " <button onclick='editStudent(" + i + ")'>✏️</button>" +
    " <button onclick='removeStudent(" + i + ")'>🗑️</button>" +
    "</li>"
  )).join("") + "</ul>";
  document.getElementById("list").innerHTML = listHTML;
  document.getElementById("headList").textContent = "Zur Auswahl (" + list.length + ")";
  enableSorting();
}

// Zufall mit Gewichtung: z. B. Favoriten oder Entzerrung
function getWeightedRandomUniqueElements(array, quantifier) {
  const weights = array.map(name => {
    return name.includes("*") ? 2 : 1; // z. B. Markierung durch "*"
  });

  const weighted = array.flatMap((item, i) => Array(weights[i]).fill(item));
  const unique = new Set();
  while (unique.size < quantifier && unique.size < array.length) {
    const pick = weighted[Math.floor(Math.random() * weighted.length)];
    unique.add(pick);
  }
  return Array.from(unique);
}

function randomizedPick() {
  document.getElementById("resultList").innerHTML = "";
  const result = getWeightedRandomUniqueElements(getCurrentList(), quantifier);
  let delay = 0;
  result.forEach((student, i) => {
    setTimeout(() => addStudent(student), delay);
    delay += 500;
  });
}
