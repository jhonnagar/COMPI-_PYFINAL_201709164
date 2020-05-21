"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var gramatica = require("./AnalizadorJava/GramaticaJava");
var gramaticaarbol = require("./AnalizadorJava/reporte");
var Errores_1 = require("./JavaAST/Errores");
var CNodoError = require("./JavaAST/NodoError");
var app = express();
const TIPO_OPERACION	= require('./AnalizadorJava/instrucciones').TIPO_OPERACION;
const TIPO_VALOR 		= require('./AnalizadorJava/instrucciones').TIPO_VALOR;
const instruccionesAPI	= require('./AnalizadorJava/instrucciones').instruccionesAPI;
const TIPO_INSTRUCCION = require('./AnalizadorJava/instrucciones').TIPO_INSTRUCCION;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
var resultadox ;
app.post('/Calcular/', function (req, res) {
    var entrada = req.body.text;
    var resultado = parser(entrada)
    resultadox=resultado;

    var rerror = Errores_1.Errores.geterror();
    
    Errores_1.Errores.clear();
    res.send(rerror);
});


app.post('/Calcular1/', function (req, res) {
    var entrada = req.body.text;
    var resultado = parser(entrada)
    comparar(resultado); 
    var rerror = Errores_1.Errores.geterror();
    Errores_1.Errores.clear();
    res.send(rerror);
});
app.post('/Arbol/', function (req, res) {
    var entrada = req.body.text;
    var resultado = parserarbol(entrada)
    res.send(resultado);
});
/*---------------------------------------------------------------*/
var server = app.listen(8080, function () {
    console.log('Servidor escuchando en puerto 8080...');
});
/*---------------------------------------------------------------*/
function parser(texto) {
    try {   
         var resultado =gramatica.parse(texto);
           
        return resultado;
    }
    catch (e) {
        return "Error en compilacion de Entrada: " + e.toString();
    }
}
function parserarbol(texto) {
    try {   
         var ast =gramaticaarbol.parse(texto);
        return ast;
    }
    catch (e) {
        return "Error en compilacion de Entrada: " + e.toString();
    }
}

function procesarCLASS(resultado){
    resultadox.forEach(instruccion => {
   
        if (instruccion.tipo === TIPO_INSTRUCCION.CLASS) {
            if (resultado.id===instruccion.id){
                var canti=  procesarVOID(resultado.cuerpo,instruccion.cuerpo,resultado.id);
                var canti2 =procesarFUNCIONES(resultado.cuerpo,instruccion.cuerpo,resultado.id);
                Errores_1.Errores.add(new CNodoError.NodoError("copia de clase","id en la clase "+resultado.id+" coincide </br>"+
                "metodos que coinciden ("+canti+")</br>"+
                "funciones que coinciden ("+canti2+")",0,0));
            }
        } });

}

function comparar(resultado) {
    resultado.forEach(instruccion => {
   
        if (instruccion.tipo === TIPO_INSTRUCCION.CLASS) {
            procesarCLASS(instruccion);
        } });
}
function procesarVOID(cuerpoorig,cuerpocopia,idclass){
 var numero = 0;
    cuerpoorig.forEach(cuerpoor => {
    
         if(cuerpoor.tipo===TIPO_INSTRUCCION.FUNCION){  
              cuerpocopia.forEach(cuerpocopi => {
                if(cuerpocopi.tipo===TIPO_INSTRUCCION.FUNCION){ 
                     if(cuerpoor.id===cuerpocopi.id){
                         if (cuerpoor.parametros!="" && cuerpocopi.parametros!=""){
                         var para = procesarPARAMETROS(cuerpoor.parametros,cuerpocopi.parametros);
                         }
                         var varia = procesarVariables(cuerpoor.cuerpo,cuerpocopi.cuerpo,cuerpocopi.id,idclass);
                         numero++;
         Errores_1.Errores.add(new CNodoError.NodoError("copia de metodo","en la clase "+idclass+"</br>"+
                        "id en el metodo "+cuerpocopi.id+" coincide </br>"+
                        "parametros que coinciden ("+para+")</br>"+
                        "variables que coinciden ("+varia+")",0,0));

                     }
                }
                  
                });
         }
   

       
   

    });
    return numero;
}
function procesarPARAMETROS(parameorig,paramecopia){
    var nuemor = 0 ;
   
    parameorig.forEach(parameor => {
        if (parameor.tipo===TIPO_INSTRUCCION.PARAMETRO){
         
            paramecopia.forEach(paramecopi=>{
                if (paramecopi.tipo===TIPO_INSTRUCCION.PARAMETRO){
                if (paramecopi.id===parameor.id && paramecopi.tipo_dato===parameor.tipo_dato ){
                    
                   nuemor ++;
                }}
            });

        }


    });
   return nuemor;
}

function procesarVariables(cuerpoorig,cuerpocopia,idvoid,idclass){
    var numero = 0;
    numero += procesardeclaracion(cuerpoorig,cuerpocopia,idvoid,idclass);
    cuerpoorig.forEach(cuerpoor => {
    
        if(cuerpoor.tipo===TIPO_INSTRUCCION.IF){  
             cuerpocopia.forEach(cuerpocopi => {
               if(cuerpocopi.tipo===TIPO_INSTRUCCION.IF){  
                    
                    numero += procesarVariables(cuerpoor.cuerpo,cuerpocopi.cuerpo,idvoid,idclass); 
                    if (cuerpoor.else!="" && cuerpocopi.else!="" ){
                    numero += procesarelse(cuerpoor.else,cuerpocopi.else,idvoid,idclass);
                }
                }
            });
        }

        if(cuerpoor.tipo===TIPO_INSTRUCCION.WHILE){  
            cuerpocopia.forEach(cuerpocopi => {
              if(cuerpocopi.tipo===TIPO_INSTRUCCION.WHILE){  
                   numero += procesarVariables(cuerpoor.cuerpo,cuerpocopi.cuerpo,idvoid,idclass); 
              
               }
           });
       }
       if(cuerpoor.tipo===TIPO_INSTRUCCION.FOR){  
        cuerpocopia.forEach(cuerpocopi => {
          if(cuerpocopi.tipo===TIPO_INSTRUCCION.FOR){  
               numero += procesarVariables(cuerpoor.cuerpo,cuerpocopi.cuerpo,idvoid,idclass); 
          
           }
       });
   }
   if(cuerpoor.tipo===TIPO_INSTRUCCION.DO_WHILE){  
    cuerpocopia.forEach(cuerpocopi => {
      if(cuerpocopi.tipo===TIPO_INSTRUCCION.DO_WHILE){  
           numero += procesarVariables(cuerpoor.cuerpo,cuerpocopi.cuerpo,idvoid,idclass); 
      
       }
   });
}



    });
  return numero;
}
function procesarelse( cuerpoorig,cuerpocopia,idvoid,idclass){
     var numero = 0
    if(cuerpoorig.tipo===TIPO_INSTRUCCION.IF && cuerpocopia.tipo===TIPO_INSTRUCCION.IF){  
        numero += procesarVariables(cuerpoorig.cuerpo,cuerpocopia.cuerpo,idvoid,idclass); 
        if (cuerpoorig.else!="" && cuerpocopia.else!="" ){
        numero += procesarelse(cuerpoorig.else,cuerpocopia.else,idvoid,idclass);
    }
    }else{
        numero += procesarVariables(cuerpoorig.cuerpo,cuerpocopia.cuerpo,idvoid,idclass); 
        
    }
return numero;
}
function procesardeclaracion(cuerpoorig,cuerpocopia,idvoid,idclass){

 var numero =0 ;
    cuerpoorig.forEach(cuerpoor => {
    
        if(cuerpoor.tipo===TIPO_INSTRUCCION.DECLARACION){  
             cuerpocopia.forEach(cuerpocopi => {
               if(cuerpocopi.tipo===TIPO_INSTRUCCION.DECLARACION){ 
                    if( cuerpoor.tipo_dato===cuerpocopi.tipo_dato){
                        cuerpoor.id.forEach(idor =>{
                            cuerpocopi.id.forEach(idcopi =>{
                                if (idor.id === idcopi.id){
                                      Errores_1.Errores.add(new CNodoError.NodoError("copia de variable","en la clase "+idclass+"</br>"+
                                       "en el metodo "+idvoid+"</br>"+
                                       JSON.stringify(cuerpoor.tipo_dato, null, 2)+ " id en la variable "+idor.id+" coincide </br>",0,0));
                                        numero ++;
                                }

                            
                            });

                        });
                      

                    }
               }
                 
               });
        }
  

      
  

   });
   return numero;
}
function procesarFUNCIONES(cuerpoorig,cuerpocopia,idclass){
    var numero = 0;
    cuerpoorig.forEach(cuerpoor => {
    
        if(cuerpoor.tipo===TIPO_INSTRUCCION.DECLARACION){  
             cuerpocopia.forEach(cuerpocopi => {
               if(cuerpocopi.tipo===TIPO_INSTRUCCION.DECLARACION){ 
                    if( cuerpoor.tipo_dato===cuerpocopi.tipo_dato){
                        cuerpoor.id.forEach(idor =>{
                            cuerpocopi.id.forEach(idcopi =>{
                                if (idor.id === idcopi.id){
                                   if (cuerpoor.valor.tipo === TIPO_INSTRUCCION.FUNCION && cuerpocopi.valor.tipo === TIPO_INSTRUCCION.FUNCION) {
                                       var para=0
                                    if (cuerpoor.valor.parametros!="" && cuerpocopi.valor.parametros!=""){
                                         para = procesarPARAMETROS(cuerpoor.valor.parametros,cuerpocopi.valor.parametros);
                                        }
                                        var varia = procesarVariables(cuerpoor.valor.cuerpo,cuerpocopi.valor.cuerpo,idcopi.id,idclass);
                                        var retun= procesaretun(cuerpoor.valor.cuerpo,cuerpocopi.valor.cuerpo);
                                        numero++;
                                        Errores_1.Errores.add(new CNodoError.NodoError("copia de funcion","en la clase "+idclass+"</br>"+
                                       "id en la funcion "+idcopi.id+" coincide </br>"+
                                       "parametros que coinciden ("+para+")</br>"+
                                       "return que coinciden ("+retun+")</br>"+
                                       "variables que coinciden ("+varia+")",0,0));
               
                                    

                                   }
                                 





                                }

                            
                            });

                        });
                      

                    }
               }
                 
               });
        }
  

      
  

   });
return numero;
}
function procesarRETURN(cuerpoorig,cuerpocopia){

    var numero =0 ;
       cuerpoorig.forEach(cuerpoor => {
       
           if(cuerpoor.tipo===TIPO_INSTRUCCION.RETURN){  
                cuerpocopia.forEach(cuerpocopi => {
                  if(cuerpocopi.tipo===TIPO_INSTRUCCION.RETURN){ 
                            if (JSON.stringify(cuerpoor.valor, null, 2)=== JSON.stringify(cuerpocopi.valor, null, 2)){   
                                           numero ++;
                                   }}
   
                               
                       
                  

                  });
           }
     
   
         
     
   
      });
      return numero;
   }
function procesaretun(cuerpoorig,cuerpocopia){

    var numero = 0;
    numero += procesarRETURN(cuerpoorig,cuerpocopia);
    cuerpoorig.forEach(cuerpoor => {
    
        if(cuerpoor.tipo===TIPO_INSTRUCCION.IF){  
             cuerpocopia.forEach(cuerpocopi => {
               if(cuerpocopi.tipo===TIPO_INSTRUCCION.IF){  
                    
                    numero += procesaretun(cuerpoor.cuerpo,cuerpocopi.cuerpo); 
                    if (cuerpoor.else!="" && cuerpocopi.else!="" ){
                    numero += procesarelseretun(cuerpoor.else,cuerpocopi.else);
                }
                }
            });
        }

        if(cuerpoor.tipo===TIPO_INSTRUCCION.WHILE){  
            cuerpocopia.forEach(cuerpocopi => {
              if(cuerpocopi.tipo===TIPO_INSTRUCCION.WHILE){  
                   numero += procesaretun(cuerpoor.cuerpo,cuerpocopi.cuerpo); 
              
               }
           });
       }
       if(cuerpoor.tipo===TIPO_INSTRUCCION.FOR){  
        cuerpocopia.forEach(cuerpocopi => {
          if(cuerpocopi.tipo===TIPO_INSTRUCCION.FOR){  
            numero += procesaretun(cuerpoor.cuerpo,cuerpocopi.cuerpo); 
          
           }
       });
   }
   if(cuerpoor.tipo===TIPO_INSTRUCCION.DO_WHILE){  
    cuerpocopia.forEach(cuerpocopi => {
      if(cuerpocopi.tipo===TIPO_INSTRUCCION.DO_WHILE){  
        numero += procesaretun(cuerpoor.cuerpo,cuerpocopi.cuerpo); 
      
       }
   });
}



    });
  return numero;
    
}

function procesarelseretun( cuerpoorig,cuerpocopia,idvoid,idclass){
    var numero = 0
   if(cuerpoorig.tipo===TIPO_INSTRUCCION.IF && cuerpocopia.tipo===TIPO_INSTRUCCION.IF){  
       numero += procesaretun(cuerpoorig.cuerpo,cuerpocopia.cuerpo); 
       if (cuerpoorig.else!="" && cuerpocopia.else!="" ){
       numero += procesarelseretun(cuerpoorig.else,cuerpocopia.else,idvoid,idclass);
   }
   }else{
       numero += procesaretun(cuerpoorig.cuerpo,cuerpocopia.cuerpo,idvoid,idclass); 
       
   }
return numero;
}