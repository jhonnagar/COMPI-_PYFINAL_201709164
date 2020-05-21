/*------------------------------------------------IMPORTS----------------------------------------------*/
%{
	const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
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
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

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
    : tclass id llavea cuerpo llavec {$$={text: 'class '+$2,children: $4};}
    | timport id puntocoma {$$={text: 'import', children: [{text: $2 }]};}
    | error { $$=""; }
    ;

cuerpo: cuerpo cuerpoc { $1.push($2); $$ = $1; }
      | cuerpoc { $$ = [$1]; }
      ;

cuerpoc: tipoDato ids valores  {$$={text:'declaracion '+$1,children:[{text:'ids',children:$2},{text:'valores',children:$3}]};}
       | id valores {$$={text:'valor '+$1,children:$2};} 
       | tvoid id para parametro parc llavea cuerpovoid llavec { $$={text:'void '+$2,children:[{text:'parametro',children:$4},{text:'cuerpo',children:$7}]};}
       | error { $$=""; }
       ;
funcion:  parametro parc llavea cuerpovoid llavec { $$= [{text:'funcion'},{text:'parametro',children:$1},{text:'cuerpo',children:$4}];};

parametro: parametro coma parametrox{ $1.push($3) ; $$=$1;}
          |parametrox  {$$=[$1];}
          | {$$="";}
        ;
parametrox: tipoDato id {$$={text:$1,children:[{text:$2}]}; }
  | error { $$=""; }
       ;
cuerpovoid: cuerpovoid cuerpovoidx {$1.push($2);$$=$1;}
          | cuerpovoidx {$$=[$1];}
 ;


cuerpovoidx: tif para condicion parc llavea cuerpovoid llavec elses { $$={text:'IF',children:[{text:' condicion',children:$3},{text:'cuerpo',children:$6},{text:'else',children:$8}]}; }
            |tipoDato ids valores  {$$={text:'declaracion '+$1,children:[{text:'ids',children:$2},{text:'valores',children:$3}]};}
            | id valores {$$={text:'valor '+$1,children:$2};} 
            | twhile para condicion parc llavea cuerpovoid llavec { $$={text:'WHILE',children:[{text:' condicion',children:$3},{text:'cuerpo',children:$6}]}; }
            | tdo llavea cuerpovoid llavec  twhile para condicion parc puntocoma { $$={text:'do',children:[{text:' cuerpo',children:$3},{text:'condicion',children:$7}]}; } 
            | tfor para idfor condicion puntocoma  id cambioid parc llavea cuerpovoid llavec  { $$={text:'FOR',children:[{text:'variable',children:[$3]},{text:'condicion',children:$4},{text:$6,children:[{text:$7}]},{text:'cuerpo',children:$10}]};} 
            | tswitch para EXP parc llavea casos llavec {$$={text:'switch',children:[{text:'expresion',children:$3},{text:'casos',children:$6}]};}
            | tprint para EXP parc puntocoma { $$= {text:'print',children:$3};} 
            | tprintln para EXP parc puntocoma { $$= {text:'print',children:$3};} 
            | tcontinue puntocoma {$$={text:'continue'};}
            | tbreak  puntocoma {$$={text:'break'};}
            | treturn treturnc {$$={text:'return',children:$2}}
             | error { $$=""; }
       ;
casos: casos nuevocaso{$1.push($2);$$=$1;} 
       | nuevocaso {$$=[$1];}
       ;
nuevocaso: tcase EXP dospuntos cuerpocase tbreak puntocoma {$$={text:'case',children:[{text:'valor',children:$2},{text:'cuerpo',children:$4}]};}
        | tdefault  dospuntos cuerpocase tbreak puntocoma {$$={text:'default',children:$3};}
         | error { $$=""; }
       ;
cuerpocase: cuerpocase cuerpocasex {$1.push($2);$$=$1;}
          | cuerpocasex {$$=[$1];}
 ;

cuerpocasex:  tif para condicion parc llavea cuerpovoid llavec elses { $$={text:'IF',children:[{text:' condicion',children:$3},{text:'cuerpo',children:$6},{text:'else',children:$8}]}; }
            |tipoDato ids valores  {$$={text:'declaracion '+$1,children:[{text:'ids',children:$2},{text:'valores',children:$3}]};}
            | id valores {$$={text:'valor '+$1,children:$2};} 
            | twhile para condicion parc llavea cuerpovoid llavec { $$={text:'WHILE',children:[{text:' condicion',children:$3},{text:'cuerpo',children:$6}]}; }
            | tdo llavea cuerpovoid llavec  twhile para condicion parc puntocoma { $$={text:'do',children:[{text:' cuerpo',children:$3},{text:'condicion',children:$7}]}; } 
            | tfor para idfor condicion puntocoma  id cambioid parc llavea cuerpovoid llavec { $$={text:'FOR',children:[{text:'variable',children:[$3]},{text:'condicion',children:$4},{text:$6,children:[{text:$7}]},{text:'cuerpo',children:$10}]};} 
            | tswitch para EXP parc llavea casos llavec {$$={text:'switch',children:[{text:'expresion',children:$3},{text:'casos',children:$6}]};}
            | tprint para EXP parc puntocoma { $$= {text:'print',children:$3};} 
            | tprintln para EXP parc puntocoma { $$= {text:'print',children:$3};} 
            | tcontinue puntocoma {$$={text:'continue'};}
            | treturn treturnc {$$={text:'return',children:$2}}
             | error { $$=""; }
       ;
treturnc: EXP puntocoma{$$=$1;}
        |puntocoma{$$="";}
        ;
cambioid:taumen{$$=$1}
         |tdecren{$$=$1};
            
idfor:tipoDato id valores  {$$={text:'declaracion '+$1,children:[{text:'id'+$2},{text:'valor',children:$3}]};}
      | id valores {$$={text:'valor '+$1,children:$2};}
         | error { $$=""; }
       ;
elses: telse tipodeelse{ $$=$2;}
       |{$$="";}
       ;
tipodeelse:llavea cuerpovoid llavec {$$=$2;}
        |  tif para condicion parc llavea cuerpovoid llavec elses { $$=[{text:'IF',children:[{text:' condicion',children:$3},{text:'cuerpo',children:$6},{text:'else',children:$8}]}]; }
 | error { $$=""; }
       ;

/*------------------------------------------------COMPONER condicion -----------------------------------------------*/

condicion:condicion tmayor condicion    {  $$ = [{text:'izq',children:$1},{text:'MAYOR'},{text:'der',children:$3}]; }   
         |condicion tmayori condicion   {  $$ = [{text:'izq',children:$1},{text:'MAYOR_IGUAL'},{text:'der',children:$3}]; }
         |condicion tmenor condicion    {  $$ = [{text:'izq',children:$1},{text:'MENOR'},{text:'der',children:$3}]; }
         |condicion tmenori condicion   {  $$ = [{text:'izq',children:$1},{text:'MENOR-IGUAL'},{text:'der',children:$3}]; }
         |condicion igualdad condicion  {  $$ = [{text:'izq',children:$1},{text:'IGUAL'},{text:'der',children:$3}]; }
         |condicion noigualdad condicion{  $$ = [{text:'izq',children:$1},{text:'NO_IGUAL'},{text:'der',children:$3}]; }
         |condicion tand condicion      {  $$ = [{text:'izq',children:$1},{text:'AND'},{text:'der',children:$3}]; }
         |condicion tor condicion       {  $$ = [{text:'izq',children:$1},{text:'OR'},{text:'der',children:$3}]; }
         |tnot condicion {   $$=[{text:'not',children:$2}];}
         |EXP {$$=$1;}
         | para condicion parc{$$=$2;}
         | error { $$=""; }
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
idr: id {$$={text:$1}}
  | error { $$=""; }
       ;
/*------------------------------------------------COMPONER LO VALORES -----------------------------------------------*/
valores: puntocoma{$$=" ";}
       | tigual EXP puntocoma{$$=$2;} 
       | para funcion {$$=$2;}
       | taumen puntocoma {$$=[{text:$1}];}
       | tdecren puntocoma {$$=[{text:$1}];}
       ;
EXP: para EXP parc   {  $$=$2; }
    |tresta entero %prec UTresta    {  $$ = {text:'-'+$1}; }
    |EXP tpoten EXP             {  $$ = [{text:'izq',children:$1},{text:'^'},{text:'der',children:$3}]; }
    |EXP tmodul EXP           {  $$ = [{text:'izq',children:$1},{text:'%'},{text:'der',children:$3}]; }
    |EXP tdiv EXP              {  $$ = [{text:'izq',children:$1},{text:'/'},{text:'der',children:$3}]; }
    |EXP tmul EXP              {  $$ = [{text:'izq',children:$1},{text:'*'},{text:'der',children:$3}]; }
    |EXP tsuma EXP              {  $$ = [{text:'izq',children:$1},{text:'+'},{text:'der',children:$3}]; }
    |EXP tresta EXP            {  $$ = [{text:'izq',children:$1},{text:'-'},{text:'der',children:$3}]; }
    |decimal                {  $$ = [{text:$1}];}
    |entero                  {  $$ = [{text:$1}]; }
    |id  {  $$ = [{text:$1}]; }
    |cadena {  $$ =[ {text:$1}]; }
    |char    {  $$ =[{text:$1}]; }
    |ttrue    {  $$ = [{text:$1}]; }
    |tfalse  {  $$ =[{text:$1}]; }
    |id para idx parc {  $$ =[{text:$1}, {text:'parametros',children:$3}];}
    ;

idx: idex {$$=$1}
    | {""}
    ;
idex: idex coma idxr { $1.push($3) ; $$=$1;}
    | idxr  {$$=[$1];}
    ;
idxr: condicion {$$={text:'parametros',children:$1};}   
    ;
    