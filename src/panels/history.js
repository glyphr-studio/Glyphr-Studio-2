/**
    Panel > History
    Shows a list of all the undo-able actions for
    the current page.
**/

function makePanel_History() {
  let content = '<div class="navarea_header">';

  content += projectEditor.nav.page;

  content += '<h1 class="paneltitle">edit history</h1>';

  let q = editor.history[editor.nav.page].queue;

  content += '</div><div class="panel_section">';

  // log("MAKEPANEL_HISTORY - rolling out queue\n" + json(q));

  content +=
    '<button style="width:100px;" class="' +
    (q.length > 0 ? 'button--call-to-action' : 'buttondis') +
    '" onclick="historyPull();">';
  content += 'undo' + (q.length > 0 ? ' (' + q.length + ')' : '');
  content += '</button><br>';
  content += '<table class="detail">';

  let te;
  let currname = '';
  for (let e = q.length - 1; e >= 0; e--) {
    te = q[e];

    if (te.name !== currname) {
      content +=
        '<tr><td colspan=2 ><div class="history_char">' +
        te.name +
        '</div></td></tr>';
      currname = te.name;
    }

    content +=
      '<tr>' +
      '<td class="history_action">' +
      te.description +
      '</td>' +
      '<td class="history_date">' +
      new Date(te.date).toLocaleString() +
      '</td>' +
      '</tr>';
  }

  content +=
    '<tr><td colspan=2  style="border-bottom:1px solid rgb(204,209,214);"></td></tr><tr>' +
    '<td class="history_char">Initial State</td>' +
    '<td class="history_date">' +
    new Date(editor.history[editor.nav.page].initialDate).toLocaleString() +
    '</td>' +
    '</tr>';

  content += '</table>';
  content += '</div>';

  return content;
}
