function Conn(){

    var texto = document.getElementById("operacion").value;
    console.log(texto);

    var url='http://localhost:8080/Calcular/';

    $.post(url,{text:texto},function(data,status){
        if(status.toString()=="success"){

           document.getElementById("resultado").value=data;

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
function ast(){
  return jstree;
}



    



