
/*------------------------------------------------IMPORTS----------------------------------------------*/
%{
	const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
        let CErrores=require('../JavaAST/Errores');
        let CNodoError=require('../JavaAST/NodoError');
%}


/* Definición Léxica */
%lex


%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

"imprimir"		return 'timprime';
"numero"		return 'rnumero';
"String"		return 'tstring';
"int"			return 'tint';
"boolean"		return 'tboolean';
"double"	        return 'tdouble';
"char"		    	return 'tchar';
"--"			return 'tdecren';
"++"			return 'taumen';
"=="			return 'igualdad';
"="	    		return 'tigual';
"+"		    	return 'tsuma';
"-"		    	return 'tresta';
"*"		    	return 'tmul';
"/"		    	return 'tdiv';
"^"		    	return 'tpoten';
"%"		    	return 'tmodul';

">="			return 'tmayori';
"<="			return 'tmenori';
"!="			return 'noigualdad';
">"		    	return 'tmayor';
"<"			    return 'tmenor';

"&&"			return 'tand';
"||"			return 'tor';
"System.out.println"     return 'tprintln';
"System.out.print"  return 'tprint';
"continue"    return 'tcontinue';
"!"			    return 'tnot';
"class"			return 'tclass';
"import"			return 'timport';
"if"				return 'tif';
"else"				return 'telse';
"switch"			return 'tswitch';
"case"				return 'tcase';
"default"			return 'tdefault';
"while"				return 'twhile';
"do"				return 'tdo';
"for"				return 'tfor';
"break"				return 'tbreak';
"return"                        return 'treturn';


"void"				return 'tvoid';
"true"                          return'ttrue';
"false"                         return'tfalse';
":"					return 'dospuntos';
";"					return 'puntocoma';
","					return 'coma';
"{"					return 'llavea';
"}"					return 'llavec';
"("					return 'para';
")"					return 'parc';



\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'cadena'; }
\'[^\"]?\'				{ yytext = yytext.substr(1,yyleng-2); return 'char'; }
[0-9]+("."[0-9]+)\b  	return 'decimal';
[0-9]+\b				return 'entero';
([a-zA-Z_])[a-zA-Z0-9_]*	return 'id';


<<EOF>>				return 'EOF';
.	 CErrores.Errores.add(new CNodoError.NodoError("Lexico","No se esperaba el caracter: "+yytext,yylineno,yylloc.first_column))
/lex

/*--------------------------------------------------SINTACTICO-----------------------------------------------*/

/*-----ASOCIACION Y PRECEDENCIA-----*/
%left tsuma tresta igualdad noigualdad EXP
%left tmul tdiv  tmenor tmayor condicion
%left tmayori tmenori tmodul tpoten
%left para parc tand tor 
%left tnot 


%start ini

%% /* Definición de la gramática */

ini
	: instrucciones EOF {return $1;}
;

instrucciones
	: instrucciones instruccion 	{ $1.push($2); $$ = $1; }
	| instruccion					{ $$ = [$1]; }
;
instruccion
    : tclass id llavea cuerpo llavec{$$=instruccionesAPI.class($2,$4);}
    | timport id puntocoma {$$=instruccionesAPI.import($2);}
    | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }

    ;

cuerpo: cuerpo cuerpoc { $1.push($2); $$ = $1; }
      | cuerpoc { $$ = [$1]; }
      ;

cuerpoc: tipoDato ids valores {$$=instruccionesAPI.declaracion($1,$2,$3);}
        | id valores {$$=instruccionesAPI.variable($1,$2);}
        | tvoid id para parametro parc llavea cuerpovoid llavec { $$= instruccionesAPI.funcionvoid($2,$4,$7);}
          | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }
 ;
funcion:  parametro parc llavea cuerpovoid llavec { $$= instruccionesAPI.funcion($1,$4);};

parametro: parametro coma parametrox{ $1.push($3) ; $$=$1;}
          |parametrox  {$$=[$1];}
          | {$$="";}
        ;
parametrox: tipoDato id {$$=instruccionesAPI.parametro($1,$2); }
          | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }
;
cuerpovoid: cuerpovoid cuerpovoidx {$1.push($2);$$=$1;}
          | cuerpovoidx {$$=[$1];}
;


cuerpovoidx: tif para condicion parc llavea cuerpovoid llavec elses { $$=instruccionesAPI.nuevoif($3,$6,$8); }
            |tipoDato ids valores {$$=instruccionesAPI.declaracion($1,$2,$3);}
            |id valores {$$=instruccionesAPI.variable($1,$2);}
            | twhile para condicion parc llavea cuerpovoid llavec { $$=instruccionesAPI.nuevowhile($3,$6); }
            | tdo llavea cuerpovoid llavec  twhile para condicion parc puntocoma { $$=instruccionesAPI.nuevodo($3,$7);} 
            | tfor para idfor condicion puntocoma  id cambioid parc llavea cuerpovoid llavec  { $$=instruccionesAPI.nuevofor($3,$4,$7,$10);} 
            | tswitch para EXP parc llavea casos llavec {$$=instruccionesAPI.nuevoswitch($3,$6);}
            | tprint para EXP parc puntocoma { $$= instruccionesAPI.nuevoprint ($3);} 
            | tprintln para EXP parc puntocoma { $$= instruccionesAPI.nuevoprintln ($3);} 
            | tcontinue puntocoma {$$=instruccionesAPI.nuevocontinue();}
            | tbreak  puntocoma {$$=instruccionesAPI.nuevobreak();}
            | treturn treturnc {$$=instruccionesAPI.nuevoreturn($2);}
               | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }
 ;
casos: casos nuevocaso{$1.push($2);$$=$1;} 
       | nuevocaso {$$=[$1];}
       ;
nuevocaso: tcase EXP dospuntos cuerpocase tbreak puntocoma {$$=instruccionesAPI.nuevocase($2,$4);}
        | tdefault  dospuntos cuerpocase tbreak puntocoma {$$=instruccionesAPI.nuevodefcase($3);}
            | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }

        ;
cuerpocase: cuerpocase cuerpocasex {$1.push($2);$$=$1;}
          | cuerpocasex {$$=[$1];}
 ;
cuerpocasex: tif para condicion parc llavea cuerpovoid llavec elses { $$=instruccionesAPI.nuevoif($3,$6,$8); }
            |tipoDato ids valores {$$=instruccionesAPI.declaracion($1,$2,$3);}
            |id valores {$$=instruccionesAPI.variable($1,$2);}
            | twhile para condicion parc llavea cuerpovoid llavec { $$=instruccionesAPI.nuevowhile($3,$6); }
            | tdo llavea cuerpo llavec  twhile para condicion parc puntocoma { $$=instruccionesAPI.nuevodo($3,$7);} 
            | tfor para idfor condicion puntocoma  id cambioid parc llavea cuerpovoid llavec  { $$=instruccionesAPI.nuevofor($3,$4,$7,$10);} 
            | tswitch para EXP parc llavec casos llavea {$$=instruccionesAPI.nuevoswitch($3,$6);}
            | tprint para EXP parc puntocoma { $$= instruccionesAPI.nuevoprint ($3);} 
            | tprintln para EXP parc puntocoma { $$= instruccionesAPI.nuevoprintln ($3);} 
            | tcontinue puntocoma {$$=instruccionesAPI.nuevocontinue();}
            | treturn treturnc {$$=instruccionesAPI.nuevoreturn($2);}
            | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }
 ;
treturnc: EXP puntocoma{$$=$1;}
        |puntocoma{$$="";}
        ;
cambioid:taumen{$$=$1}
         |tdecren{$$=$1}
         ;
            
idfor:  tipoDato ids valores {$$=instruccionesAPI.declaracion($1,$2,$3);}
        | id valores {$$=instruccionesAPI.variable($1,$2);}
        | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }

        ;
elses: telse tipodeelse{ $$=$2;}
       |{$$="";}
       ;
tipodeelse:llavea cuerpovoid llavec {$$= instruccionesAPI.nuevoelse($2);}
        |  tif para condicion parc llavea cuerpovoid llavec elses { $$=instruccionesAPI.nuevoif($3,$6,$8); }
            | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }

;

/*------------------------------------------------COMPONER condicion -----------------------------------------------*/

condicion:condicion tmayor condicion {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYORQUE); }
         |condicion tmayori condicion  {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYORIGUAL); }
         |condicion tmenor condicion   {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENORQUE); }
         |condicion tmenori condicion  {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENORIGUAL); }
         |condicion igualdad condicion {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DIGUAL); }
         |condicion noigualdad condicion {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.NOIGUAL); }
         |condicion tand condicion {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.AND); }
         |condicion tor condicion {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.OR); }
         |tnot condicion {   $$=instruccionesAPI.nuevonot($2);}
         |EXP {$$=$1;}
         | para condicion parc{$$=$2;}
             | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }

        ;
tipoDato:tint {$$=$1;}
 |tstring{$$=$1;}
 |tboolean{$$=$1;}
 |tdouble{$$=$1;}
 |tchar {$$=$1;} 
 
 ;
ids: ids coma idr { $1.push($3) ; $$=$1;}
   | idr  {$$=[$1];}
 ;
idr: id {$$=instruccionesAPI.nuevoid($$=$1);}
    | error { $$=""; CErrores.Errores.add(new CNodoError.NodoError("SINTACTICO","No se esperaba el token: "+yytext,this._$.first_line,this._$.first_column));  }

 ;
/*------------------------------------------------COMPONER LO VALORES -----------------------------------------------*/
valores: puntocoma{$$=" ";}
       | tigual EXP puntocoma{$$=$2;} 
       | para funcion {$$=$2;}
       | taumen puntocoma {$$=1}
       | tdecren puntocoma {$$=1}

       ;
EXP: para EXP parc   {  $$=$2; }
    |tresta entero %prec UTresta  {  $$ = instruccionesAPI.nuevoValor(Number($2), TIPO_VALOR.NUMERONEG);  }	
       |EXP tpoten EXP             {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.POTENCIA); }
          |EXP tmodul EXP             {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MODULO); }
    |EXP tdiv EXP             {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DIVISION); }
    |EXP tmul EXP             {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MULTIPLICACION); }
    |EXP tsuma EXP            {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.SUMA); }
    |EXP tresta EXP          { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.RESTA); }
    |decimal                 { $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.NUMERO); }
    |entero                  {  $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.NUMERO);  }
    |id  {  $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.ID);  }
    |cadena  {  $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA);  }
    |char    {  $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CHAR);  }
    |ttrue    {  $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOL);  }
    |tfalse  {  $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOL);  }
    |id para idx parc {  $$ = instruccionesAPI.nuevalorfunc($1,$3);  }
    
    ;

idx: idex {$$=$1}
| {""}
;
idex: idex coma idxr { $1.push($3) ; $$=$1;}
| idxr  {$$=[$1];}
;
idxr: condicion {$$=instruccionesAPI.nuevoid($1);}

    
;