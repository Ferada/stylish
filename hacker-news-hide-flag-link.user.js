// ==UserScript==
// @name        Hacker News: Hide Flag Link
// @namespace   https://github.com/Ferada/stylish
// @description Hide the flag link so as not to accidentally click it.
// @include     http://news.ycombinator.com/item?*
// @include     https://news.ycombinator.com/item?*
// @include     https://news.ycombinator.com/news
// @include     https://news.ycombinator.com/news
// @version     1
// @grant       none
// ==/UserScript==

var links = document.getElementsByTagName ("a");

for (var i = 0; i < links.length; ++i) {
  var link = links[i];

  if (link.innerHTML === "flag") {
    link.removeAttribute ("href");
    link.innerHTML = "<del>flag</del>";
  }
}
