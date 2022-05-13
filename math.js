// Funkce skryje všechny elementy
function hideAllElementsByClassName(className) {
    var x = document.getElementsByClassName(className);
    for (var i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    }
}

// Funkce zpracuje otevření stránek a zpracování parametrů
function zpracujNacteniStranky() {

  // výchozí akce
  nactiHTMLData('data/info.html','obsah');

  // př. volání http://127.0.0.1:5501/index.html?rocnik=6&tema=ukoly6.delitelnost
  const dotazNaWeb = window.location.search;  // získám celý řetězec dotazu
  const dotazParametry = new URLSearchParams(dotazNaWeb);  // z řetezce chci znát jen ty parametry, tj. vše za ?
  const rocnik = dotazParametry.get('rocnik')  // který ročník načíst do témat
  const tema = dotazParametry.get('tema')    // které téma otevřít

  if (rocnik == "6") { nactiHTMLData('data/temata6.html','temata');}
  if (rocnik == "7") { nactiHTMLData('data/temata7.html','temata');}
  if (rocnik == "8") { nactiHTMLData('data/temata8.html','temata');}
  if (rocnik == "9") { nactiHTMLData('data/temata9.html','temata');}

  if (tema != "") {
    nactiXMLUkolyData("data/" + tema +".xml",'obsah');
  }
}

// Funkce zpracuje načtení témat 
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

// Funkce načte XML soubor a volá jeho zpracování
function nactiXMLUkolyData(inXMLFile,inElementId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        nactiUkoly(this.responseText,inElementId);
        }
    }
    xhttp.open("GET", inXMLFile, true);
    xhttp.send();
  }

// Funkce načte z XML souboru data a vygeneruje HTML kód
function nactiUkoly(xmlText, inElementId) {
  var x, i, xmlDoc, txt;
  parser = new DOMParser;
  xmlDoc = parser.parseFromString(xmlText,"text/xml");
  txt = "";
    x = xmlDoc.getElementsByTagName("ukol");

  // pro každý úkol
  for (i = 0; i< x.length; i++) {
    txt += "<div class='ukol'>";

    txt += "<section class='ukol_hlavicka' onclick=\"hideAllElementsByClassName(\'ukol_obsah\');this.nextElementSibling.style=\'display:block\'\">";
    txt += "<div class='ukol_nadpis'>" +  x[i].getAttribute("nadpis") + "</div>";
    txt += "<div class='ukol_level' level='" + x[i].getAttribute("uroven") +  "'>" + x[i].getAttribute("uroven") + "</div>";
    txt += "<div class='ukol_body'>" + x[i].getAttribute("body") + "</div>";
    txt += "</section>";
  
      txt += "<div class='ukol_obsah'>";
          txt += "<section class='ukol_zadani'>";
            txt +=  x[i].getElementsByTagName("ukol_zadani")[0].innerHTML;
          txt += "</section>"; // ukol_zadani

          // projdi všechny nápovědy
          napovedy = x[i].getElementsByTagName("ukol_napoveda");
          var h, zobrazh;
          for (h = 0; h< napovedy.length; h++) {
              zobrazh = h + 1;
              txt +=  "<section class='ukol_napoveda'>";
                txt += "<div class='ukol_napoveda_hlavicka' help_points=" + napovedy[h].getAttribute("body_dolu") + " ukol_id=" + x[i].getAttribute("id") + " onclick=\"this.nextElementSibling.style=\'display:block\';this.style=\'display:none\'\">Ukaž " +  zobrazh + ". nápovědu:</div>";
                  txt += "<div class='ukol_napoveda_radek'>";
                    txt += napovedy[h].getElementsByTagName("ukol_napoveda_obsah")[0].innerHTML;       
                  txt += "</div>"; // ukol help line
              txt += "</section>";
          }

          // element odpovědi a řešení 
          debugger
          txt += "<section class=\"ukol_odpoved\" ukol_id=\""+ x[i].getAttribute("id") + "\" ukol_body=\"" + x[i].getAttribute("body") + "\">";
          
              txt += "<div class=\"ukol_odpoved_zak\" ukol_reseniA=\"" + x[i].getAttribute("reseni_A") + "\" ukol_reseniB=\"" + x[i].getAttribute("reseni_B") + "\" ukol_reseniC=\"" + x[i].getAttribute("reseni_C") + "\">";
              // příklad Odpověď: 12 malířů vymaluje tuto halu za %1 hodin.
                  txt += x[i].getElementsByTagName("ukol_odpoved_zaka")[0].innerHTML.replace("%1","<input type=text id=\"ukol_odpoved1\" size=1 title=\"Zadejte výsledek\"/>").replace("%2","<input type=text id=\"ukol_odpoved2\" size=1 title=\"Zadejte výsledek\"/>").replace("%3","<input type=text id=\"ukol_odpoved3\" size=1 title=\"Zadejte výsledek\"/>");   
                  txt += "<button class=\"ukol_check_btn\" onclick=\"overVysledek(this.parentNode.getAttribute('ukol_reseniA'),this.parentNode.getAttribute('ukol_reseniB'),this.parentNode.getAttribute('ukol_reseniC'),document.getElementById('ukol_odpoved1').value,document.getElementById('ukol_odpoved2')===null?'0':document.getElementById('ukol_odpoved2').value,document.getElementById('ukol_odpoved3')===null?'0':document.getElementById('ukol_odpoved3').value);document.getElementById(\'reseni_"+ x[i].getAttribute("id") +"\').style=\'display:block\';\">Zkontroluj</button>";
              txt += "</div>";
              
              // alert(this.parentNode.getAttribute('ukol_reseniA') + ' vs. ' + document.getElementById('ukol_odpoved1').value);
              // ternární operátor na test přítomnosti odpovědi 2 a  document.getElementById('ukol_odpoved2').value === null)?"0":document.getElementById('ukol_odpoved2').value;

              txt += "<div class=\"ukol_reseni\" id=\"reseni_"+ x[i].getAttribute("id")  +"\" style=\"display:none;\">";
                  txt += x[i].getElementsByTagName("ukol_reseni")[0].innerHTML;
              txt += "</div>"
          txt += "</section>"; // ukol_odpoved 

      txt += "</div>"; // ukol container

    txt += "</div>";  // ukol element

  }
  document.getElementById(inElementId).innerHTML = txt;
}

// Funkce kontroluje odeslaný výsledek
function overVysledek(inResA,inResB,inResC,inVyslA,inVyslB,inVyslC) {
  debugger;
  let spravnaOdp = true;
  if (((inResA != inVyslA) && (inResA !='0')) || ((inResB != inVyslB) && (inResB !='0')) || ((inResC != inVyslC) && (inResC !='0'))) {
    spravnaOdp = false;
  }
  
  if (spravnaOdp == true) {
    alert("Gratulace, správný výsledek.");
  } else {
    alert("Projdi si řešení a zkontroluj postup.");
  }

}