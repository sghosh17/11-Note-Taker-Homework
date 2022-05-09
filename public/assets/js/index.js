var $noteTitle = $(".note-title");
var $noteText = $(".note-content");
var $saveNoteHandler = $(".save-note");
var $newNoteHandler = $(".new-note");
var $noteList = $(".list-container .list-group");
var currentNote = {};

// This fetches all the notes from the database
var getAllNotes = function () {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// This saves a new note to the database
var addNote = function (note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// This deletes a note from the database
var deleteNote = function (id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

var displayCurrentNote = function () {
  $saveNoteHandler.hide();

  if (currentNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(currentNote.title);
    $noteText.val(currentNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

var handleAddNote = function () {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  addNote(newNote).then(function (data) {
    fetchSavedNotes();
    displayCurrentNote();
  });
};

var handleDeleteNote = function (e) {
  e.stopPropagation();

  var note = $(this).parent(".list-group-item").data();

  if (currentNote.id === note.id) {
    currentNote = {};
  }

  deleteNote(note.id).then(function () {
    fetchSavedNotes();
    displayCurrentNote();
  });
};

var handleViewNote = function () {
  currentNote = $(this).data();
  displayCurrentNote();
};

var handleCreateNewNote = function () {
  currentNote = {};
  displayCurrentNote();
};

// Show the save button when note title and text are entered by the user
var handleDisplaySaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteHandler.hide();
  } else {
    $saveNoteHandler.show();
  }
};

var showNotes = function (notes) {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

var fetchSavedNotes = function () {
  return getAllNotes().then(function (data) {
    showNotes(data);
  });
};

$saveNoteHandler.on("click", handleAddNote);
$noteList.on("click", ".list-group-item", handleViewNote);
$newNoteHandler.on("click", handleCreateNewNote);
$noteList.on("click", ".delete-note", handleDeleteNote);
$noteTitle.on("keyup", handleDisplaySaveBtn);
$noteText.on("keyup", handleDisplaySaveBtn);

// Initial display of saved notes
fetchSavedNotes();
