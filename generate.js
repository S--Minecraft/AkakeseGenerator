(function(){
var get = function(obj, cb){
  if(!obj) {
    throw "get(): obj is undefined or null";
  }
  var BASEURL = "https://ja.wikipedia.org/w/api.php";
  var xhr = new XMLHttpRequest();

  param = "?origin=*&";
  for(var k in obj) {
    param += k+"="+obj[k]+"&";
  }
  param = param.slice(0, -1);

  xhr.onload = function(){
    cb(JSON.parse(xhr.responseText));
  };
  xhr.open("GET", BASEURL+param);
  xhr.send();
};

var getText = function(cb){
  get({
    format: "json",
    action: "query",
    prop: "extracts",
    generator: "random",
    redirects: "1",
    exintro: "1",
    explaintext: "1",
    grnnamespace: "0",
    grnlimit: "1"
  }, function(json){
    for(var key in json.query.pages) {
      var text = json.query.pages[key].extract;
      break;
    }
    cb(text);
  });
};

var prefix = "☝(´･_･`)";
var suffix = "わかったかはよ垢消せ";
var maxLen = 140 - prefix.length - suffix.length;
var textFormat = function(text){
  var text = text.replace(/\n/g, "");
  var text = text.replace(/[(（][^)）]+?[)）]/g, "");
  if(text.length <= maxLen) {
    return prefix+text+suffix;
  }
  var lines = text.split("。");
  var newText = prefix;
  for(var i = 0; ; i++) {
    var line = lines[i];
    if(newText.length+line.length > maxLen) {
      break;
    }
    newText += line + "。";
  }
  return newText+suffix;
};

var addList = function(text) {
  $template = document.querySelector("#template").cloneNode(true);
  $template.removeAttribute("id");
  $template.removeAttribute("hidden");
  $text = $template.querySelector(".text")
  $text.value = textFormat(text);
  $parent = document.querySelector(".created")
  $parent.insertBefore($template, $parent.firstChild);
  $text.style.height = $text.scrollHeight + "px";
};

document.addEventListener("DOMContentLoaded", function(e){
  document.querySelector("#generate-button").addEventListener("click", function(e){
    getText(function(text){
      addList(text);
    });
  });
  document.addEventListener("click", function(e){
    if(e.target.classList.contains("copy")){
      var textarea = e.target.parentElement.parentElement.querySelector(".text");
      textarea.select();
      document.execCommand("copy");
      return;
    }
    if(e.target.classList.contains("tweet")){
      var BASEURL = "https://twitter.com/share?text=";
      var textarea = e.target.parentElement.parentElement.querySelector(".text");
      open(BASEURL+encodeURIComponent(textarea.value));
      return;
    }
  });
});
}());
