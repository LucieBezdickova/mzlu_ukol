function hideAllElementsByClassName(className) {
    var x = document.getElementsByClassName(className);
    for (var i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    }
}

function loadHTMLDoc(inHTMLFile) {
    debugger;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("loadHTML").innerHTML = this.responseText;
        }
    }
    xhttp.open("GET", inHTMLFile, true);
    xhttp.send();
  }
