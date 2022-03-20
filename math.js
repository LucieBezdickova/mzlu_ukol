function hideAllElementsByClassName(className) {
    var x = document.getElementsByClassName(className);
    for (var i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    }
}

function nactiHTMLData(inHTMLFile,inElementId) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById(inElementId).innerHTML = this.responseText;
      }
  }
  xhttp.open("GET", inHTMLFile, true);
  xhttp.send();
}

function loadUkolyXMLDoc(inHTMLFile,inElementId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        rozpadniUkoly(this.responseText);
        }
    }
    xhttp.open("GET", inHTMLFile, true);
    xhttp.send();
  }

function nactiUkoly(xmlText) {
  var x, i, xmlDoc, txt;
  debugger;
  parser = new DOMParser;
  xmlDoc = parser.parseFromString(xmlText,"text/xml");
  txt = "";
    x = xmlDoc.getElementsByTagName("ukol");

  // pro každý úkol
  for (i = 0; i< x.length; i++) {
    txt += "<div class='task'>"

    txt += "<section class='task_header' onclick='hideAllElementsByClassName(''task_container'');this.nextElementSibling.style=''display:block''>"
    txt += "<div class='task_header_desc'>" +  x[i].getAttribute("nadpis") + "</div>"
    txt += "<div class='task_level'>" + x[i].getAttribute("uroven") + "</div>"
    txt += "</section>"
  
    txt += "<b>" + x[i].getAttribute("id")+"</b>" + "<br>";
    txt += "<b>" + x[i].getAttribute("nadpis")+"</b>" + "<br>";
    txt += x[i].getAttribute("uroven") + "<br>";
    txt += x[i].getAttribute("body") + "<br>";

    // process all help
    nap_radky = x[i].getElementsByTagName("ukol_napoveda");
    
    // .getElementsByTagName("ukol_napoveda_obsah");
    var h;
    for (h = 0; h< nap_radky.length; h++) {
        
        // body_dolu
        txt +=  "body dolů" + nap_radky[h].getAttribute("body_dolu"); 
        txt += " <b>help:</b>" + nap_radky[h].getElementsByTagName("ukol_napoveda_obsah")[0].innerHTML + "<br>";       
    }

    txt += "</div>"  // task element

  }
  document.getElementById("ukolyHtml").innerHTML = txt;
}
