// ==UserScript==
// @name        Hacker News: Comment Collapse
// @namespace   http://arantius.com/misc/greasemonkey/
// @description Make comments collapse/expandable, a'la Reddit.
// @include     http://news.ycombinator.com/item?*
// @include     https://news.ycombinator.com/item?*
// @require     https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js
// @require     http://arantius.com/misc/greasemonkey/imports/dollarx.js
// @resource    css https://arantius.com/misc/greasemonkey/imports/hacker-news-comment-collapse.css
// @version     7
// @grant       none
// ==/UserScript==

var cssPoint = document.getElementsByTagName('head')[0];
cssPoint = cssPoint || document.body;
var cssNode = document.createElement('link');
cssNode.setAttribute('href', GM_getResourceURL('css'));
cssNode.setAttribute('type', 'text/css');
cssNode.setAttribute('rel', 'stylesheet');
cssPoint.appendChild(cssNode);

var controls = (function() {
  var frag = document.createDocumentFragment();
  var d1 = document.createElement('a');
  d1.className = 'collapse';
  d1.textContent = '[-]';
  frag.appendChild(d1);
  var d2 = document.createElement('a');
  d2.className = 'expand';
  d2.textContent = '[+]';
  frag.appendChild(d2);
  return frag;
})();

var commentRows = $x("//span[@class = 'comhead']/ancestor::tr[2]");
for (var i = 0, commentRow; commentRow = commentRows[i]; i++) {
  var spacerWid = $x(".//img[contains(@src, 's.gif')]/@width", commentRow)[0];
  var depth = parseInt(spacerWid.nodeValue, 10) / 40;
  commentRow.setAttribute('depth', depth);
  var controlEl = $x(".//td/center", commentRow)[0];
  controlEl.appendChild(controls.cloneNode(true));
}

for (var i = 1, commentRow; commentRow = commentRows[i]; i++) {
  if (commentRow.getAttribute('depth') == '2') {
    console.log('collapse deep row', commentRow);
    toggleRowTo(commentRow, 'collapse');
  } else if ($x(".//font[@color = '#5a5a5a']", commentRow).length) {
    console.log('collapse down-modded comment', commentRow);
    toggleRowTo(commentRow, 'collapse');
  }
}

window.addEventListener('click', function(event) {
  var rowEl = $x("./ancestor::tr[2]", event.target)[0];
  toggleRowTo(rowEl, event.target.className);
}, false);

function toggleRowTo(rowEl, toggleTo) {
  if (!rowEl) return;
  var depth = parseInt(rowEl.getAttribute('depth'), 10);

  if ('collapse' == toggleTo) {
    var rowAlter = function(row) {
      row.className += ' collapse';
    }
    rowEl.className += ' collapse-line';
  } else if ('expand' == toggleTo) {
    var rowAlter = function(row) {
      row.className = row.className.replace(/ *collapse(-line)? *()/g, ' ');
    }
    rowAlter(rowEl);
  } else {
    // Not our el!
    return;
  }

  rowEl = rowEl.nextSibling;
  while (rowEl && parseInt(rowEl.getAttribute('depth'), 10) > depth) {
    rowAlter(rowEl);
    rowEl = rowEl.nextSibling;
  }
}
