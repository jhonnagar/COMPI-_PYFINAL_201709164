function Conn(){

    var texto = document.getElementById("operacion").value;
    console.log(texto);

    var url='http://localhost:8080/Calcular/';

    $.post(url,{text:texto},function(data,status){
        if(status.toString()=="success"){
          alert("analizado y listo para comparar");
          rep = data;

        }else{
            alert("Error estado de conexion:"+status);
        }
    });
}

function Conn3(){

  var texto = document.getElementById("operacion").value;
  console.log(texto);

  var url='http://localhost:8080/Calcular1/';

  $.post(url,{text:texto},function(data,status){
      if(status.toString()=="success"){
       alert("COMPARACION COMPLETADA");
        rep = data;

      }else{
          alert("Error estado de conexion:"+status);
      }
  });
}
function Conn1(){

  var texto = document.getElementById("operacion").value;
  console.log(texto);

  var url='http://localhost:8080/Arbol/';

  $.post(url,{text:texto},function(data,status){
      if(status.toString()=="success"){
    
         jstree =data;
         var ast = JSON.stringify(jstree, null, 2);
        alert(ast);
      }else{
          alert("Error estado de conexion:"+status);
      }
  });
}
var jstree= [
  { "text" : "Arbol", "children" : [
    { "text" : "Sin Cambios" },
  ]}
];
var rep ="hola";
function ast(){
  return jstree;
}
function reporte_errores(){
  return rep;
}



function AbrirArchivo(files){
  var file = files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
  
  }
    
  reader.readAsText(file);
  file.clear;
   
 
}
 var file_input=document.getElementById("fileInput");
  document.getElementById('fileInput').value="";

  




function saveTextAsFile(nombre, contenido) {
  var textToWrite = contenido;
  var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
  var fileNameToSaveAs = nombre;
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "My Hidden Link";

  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);

  downloadLink.onclick = destroyClickedElement;

  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);

  downloadLink.click();
}
function destroyClickedElement(event) {

  document.body.removeChild(event.target);
}

function guardararchivo() {
  saveTextAsFile("guardar.java", document.getElementById("operacion").value);
}


    




