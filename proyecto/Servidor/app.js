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
    Errores_1.Errores.add(new CNodoError.NodoError("sintactica","No se esperaba el caracter: ",0,0));
    Errores_1.Errores.add(new CNodoError.NodoError("pedos ","No se esperaba el caracter: ",0,0));

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
                                        "id en la variable "+idor.id+" coincide </br>",0,0));
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
                                    console.log("esta 1 con el id  "+idor.id);
                                    
                                    if (cuerpoor.valor.parametros!="" && cuerpocopi.valor.parametros!=""){
                                        console.log("esta qui");
                                        var para = procesarPARAMETROS(cuerpoor.valor.parametros,cuerpocopi.valor.parametros);
                                        }
                                        console.log("esta qui 2 ");
                                        var varia = procesarVariables(cuerpoor.valor.cuerpo,cuerpocopi.valor.cuerpo,idcopi.id,idclass);
                                        numero++;
                                        Errores_1.Errores.add(new CNodoError.NodoError("copia de funcion","en la clase "+idclass+"</br>"+
                                       "id en la funcion "+idcopi.id+" coincide </br>"+
                                       "parametros que coinciden ("+para+")</br>"+
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