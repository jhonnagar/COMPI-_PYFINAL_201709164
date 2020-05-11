
/*------------------------------------------------IMPORTS----------------------------------------------*/
%{
	const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
%}


/* Definición Léxica */
%lex

%options case-insensitive

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

"imprimir"			return 'timprime';
"numero"			return 'rnumero';
"string"			return 'tstring';
"int"			    return 'tint';
"boolean"			return 'tboolean';
"double"			return 'tdouble';
"char"		    	return 'tchar';
"--"			return 'tdecren';
"=="			return 'igualdad';
"="	    		return 'tigual';
"+"		    	return 'tsuma';
"-"		    	return 'tresta';
"*"		    	return 'tmul';
"/"		    	return 'tdiv';
"^"		    	return 'tpoten';
"%"		    	return 'tmodul';
"++"			return 'taumen';
">="			return 'tmayori';
"<="			return 'tmenori';
"!="			return 'noigualdad';
">"		    	return 'tmayor';
"<"			    return 'tmenor';

"&&"			return 'tand';
"||"			return 'tor';
"!"			    return 'tnot';
"class"			return 'tclass';
"import"			return 'timport';
"if"				return 'tif';
"else"				return 'telse';
"switch"			return 'tswitch';
"case"				return 'tcase';
"default"			return 'tdafault';
"while"				return 'while';
"do"				return 'do';
"for"				return 'for';
"break"				return 'break';
"void"				return 'tvoid';
":"					return 'dospuntos';
";"					return 'puntocoma';
","					return 'coma';
"{"					return 'llavea';
"}"					return 'llavec';
"("					return 'para';
")"					return 'parc';



\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
[0-9]+("."[0-9]+)?\b  	return 'decimal';
[0-9]+\b				return 'entero';
([a-zA-Z])[a-zA-Z0-9_]*	return 'id';


<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

/lex

/*--------------------------------------------------SINTACTICO-----------------------------------------------*/

/*-----ASOCIACION Y PRECEDENCIA-----*/
%left tsuma tresta
%left tmul tdiv
%left para parc


%start ini

%% /* Definición de la gramática */

ini
	: instrucciones EOF {
		return $1;}
;

instrucciones
	: instrucciones instruccion 	{ $1.push($2); $$ = $1; }
	| instruccion					{ $$ = [$1]; }
;
instruccion
    : tclass id llavea cuerpo llavec{$$=instruccionesAPI.class($2,$4);}
    | timport id puntocoma {$$=instruccionesAPI.import($2);};

cuerpo: cuerpo cuerpoc { $1.push($2); $$ = $1; }
      | cuerpoc { $$ = [$1]; }
      ;

cuerpoc: tipoDato ids valores {$$=instruccionesAPI.declaracion($1,$2,$3);}
        | id valores {$$=instruccionesAPI.variable($1,$2);}
        | tvoid id para parametro parc llavea cuerpovoid llavec { $$= instruccionesAPI.funcionvoid($2,$4,$7);}
       ;
funcion:  parametro parc llavea cuerpovoid llavec { $$= instruccionesAPI.funcion($1,$4);};

parametro: parametro coma parametrox{ $1.push($3) ; $$=$1}
          |parametrox  {$$=[$1]}
          | {$$=""}
        ;
parametrox: tipoDato id {$$=instruccionesAPI.parametro($1,$2) }
;
cuerpovoid: {$$="cuerpo"}
;
tipoDato:tint {$$=$1}
 |tstring{$$=$1}
 |tboolean{$$=$1}
 |tdouble{$$=$1}
 |tchar {$$=$1} 
 ;
ids: ids coma idr { $1.push($3) ; $$=$1}
   | idr  {$$=[$1]}
 ;
idr: id {$$=instruccionesAPI.nuevoid($$=$1);}
 ;
/*------------------------------------------------COMPONER LO VALORES -----------------------------------------------*/
valores: puntocoma{$$=" "}
       | tigual EXP puntocoma{$$=$2} 
       | para funcion {$$=$2}
       ;
EXP: para EXP parc   {  $$=$2; }
    |EXP tdiv EXP             {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DIVISION); }
    |EXP tmul EXP             {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MULTIPLICACION); }
    |EXP tsuma EXP            {  $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.SUMA); }
    |EXP tresta EXP          { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.RESTA); }
    |decimal                 { $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.NUMERO); }
    |entero                  {  $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.NUMERO);  };