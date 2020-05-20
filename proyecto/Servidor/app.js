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
                var cantidadvoid =  procesarVOID(resultado.cuerpo,instruccion.cuerpo,resultado.id);
                Errores_1.Errores.add(new CNodoError.NodoError("copia","id en la clase "+resultado.id+" coincide",0,0));
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

    cuerpoorig.forEach(cuerpoor => {
     
         if(cuerpoor.tipo===TIPO_INSTRUCCION.FUNCION){  
              cuerpocopia.forEach(cuerpocopi => {
                if(cuerpocopi.tipo===TIPO_INSTRUCCION.FUNCION){ 
                     if(cuerpoor.id===cuerpocopi.id){
                        Errores_1.Errores.add(new CNodoError.NodoError("copia","id en la metodo "+cuerpocopi.id+" coincide",0,0));

                     }
                }
                  
                                               });
         }
   

       
   

    });
}