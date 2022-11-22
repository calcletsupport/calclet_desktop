const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");

function outputText(str) {
    $('#output').append(str + '<br/>');
}

function outputText(str) {
    $('#output').append(str + '<br/>');
}

function outputList(list) {

    let ListStr = '';
    ListStr += '<div class="list">';
    ListStr += '<ul>';
    for (let i = 0; i < list.length; i++) {
        ListStr += '<div class="list-item"><li>' + list[i] + '</li></div>';
    }
    ListStr += '<ul></div>';
    $('#output').append(ListStr);
}


function outputTable(tableName, dataArray) {

    $('#output').append('<p>' + tableName + '</p>');

    var tableStr = "";

    tableStr += '<table class="table is-bordered is-striped is-small is-fullwidth">';
    tableStr += '<tbody>';

    for (let i = 0; i < dataArray.length; i++) {
        tableStr += '<tr>';
        for (let j = 0; j < dataArray[i].length; j++) {
            tableStr += '<td>' + dataArray[i][j] + "</td>";
        }
        tableStr += '</tr>';
    }

    tableStr += '</tbody>';
    tableStr += '</table>';

    $('#output').append(tableStr);
}


let editor = null;

editor = ace.edit('editor', {
    showPrintMargin: false,
    showLineNumbers: false,
    showGutter: false,
    wrap: true,
    scrollPastEnd: 1,
    fixedWidthGutter: true,
    fadeFoldWidgets: true,
    highlightActiveLine: false,
    autoScrollEditorIntoView: true,
    useWorker: true,
    theme: "ace/theme/github",
    fontSize: 9,
});


editor.gotoLine(1, 1);
let text = '// Start developing your app';
editor.session.insert(editor.getCursorPosition(), text);
editor.session.setMode("ace/mode/javascript");

ipcRenderer.on('create-new-file-message-from-main', (event, file, content) => {
    let text = "// Start developing your app";
    editor.setValue(text, -1);
$("#output").html("");
    ipcRenderer.send('resent-current-file-path-from-renderer');
});

ipcRenderer.on('file-opened', (event, file, content) => {
 editor.setValue(content, -1);
});


ipcRenderer.on('run', (event, file, content) => {
    let code = editor.getValue();
    $("#output").html("");
    new Function(code)();
});

ipcRenderer.on('get-content-message-from-main', (event, file, content) => {
    let editor_content = editor.getValue();
    ipcRenderer.send('content-message-from-renderer', editor_content);
    console.log(editor_content);
});