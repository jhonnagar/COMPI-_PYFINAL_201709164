
// Constantes para los tipos de 'valores' que reconoce nuestra gramática.
const TIPO_VALOR = {
	NUMERO:         'VAlOR_NUMERO',
	NUMERONEG:         'VAlOR_NUMERO_NEGATIVO',
	ID:             'VALOR_ID',
	CADENA:         'VALOR_CADENA',
	INT:            'INT',
	STRING:         'STRNIG',
	CHAR: 			'CHAR',
	BOOL:           'BOOLEAN',
	DOUBLE:         'DOUBLE',
	MASMAS:         'MASMAS',
	MENOSMENOS:     'MENOSMENOS'
}

// Constantes para los tipos de 'operaciones' que soporta nuestra gramática.
const TIPO_OPERACION = {
	SUMA:           'SUMA',
	RESTA:          'RESTA',
	MULTIPLICACION: 'MULTIPLICACION',
	DIVISION:       'DIVISION',
	MODULO:         'MODULO',
	POTENCIA:       'POTENCIA',
	NEGATIVO:       'NEGATIVO',
	MAYORQUE:      'MAYOR_QUE',
	MENORQUE:      'MENOR_QUE',

	MAYORIGUAL: 	'MAYOR_IGUAL',
	MENORIGUAL:    'MENOR_IGUAL',
	DIGUAL:          'IGUAL',
	NOIGUAL:    	'NO_IGUAL',

	AND:  			'AND',
	OR: 			'OR',
	NOT:   			'NOT',  	
};

// Constantes para los tipos de 'instrucciones' válidas en nuestra gramática.
const TIPO_INSTRUCCION = {
	CLASS:          'CLASS',
	IMPORT:         'IMPORT',
	FUNCION:        'FUNCION',
	DECLARACION:	'DECLARACION',
	ASIGNACION:		'IASIGANCION',
	IF:				'IF',
	IF_ELSE:		'ELSE',
	WHILE:          'WHILE',
	DO_WHILE:        'DO_WHILE',
	FOR:              'FOR',
	SWITCH:			'SWITCH',
	CASE:			'CASE',
	DEF_CASE:		'DE_FCASE',
	VALOR:          'VALOR_VARIABLE',
	PRINT:          'PRINT',
	PRINTLN:          'PRINTLN',
	PARAMETRO:       'PARAMETRO',
	BREAK:  'BREAK',
	CONTINUE:'CONTINUE',
	RETURN:  'RETURN'
}

function nuevaOperacion(operandoIzq, operandoDer, tipo) {
	return {
		operandoIzq: operandoIzq,
		tipo: tipo,
		operandoDer: operandoDer
		
	}
}


const instruccionesAPI = {

	nuevoOperacionBinaria: function(operandoIzq, operandoDer, tipo) {
		return nuevaOperacion(operandoIzq, operandoDer, tipo);
	},

	nuevoValor: function(valor, tipo) {
		return {
			tipo: tipo,
			valor: valor
		}
	},	


	nuevalorfunc: function(id,parametro) {
		return {
			tipo: TIPO_INSTRUCCION.FUNCION,
			id: id,
			parametro: parametro
		}
	},	
	nuevonot: function(valor) {
		return {
			tipo: TIPO_OPERACION.NOT,
			condicion: valor
		}
	},
	class: function (id,instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.CLASS,
			id:id,
			cuerpo: instrucciones
		}
	},
	import: function (id) {
		return {
			tipo: TIPO_INSTRUCCION.IMPORT,
			id:id
		}
	},


	variable: function(id,valor) {
		return {
			tipo:TIPO_INSTRUCCION.VALOR,
			identificador: id,
			valor: valor
			
		}
	},
	declaracion: function(tipo,ID,valor) {
		return {
			tipo: TIPO_INSTRUCCION.DECLARACION,
			tipo_dato: tipo,
			id:ID,
			valor: valor
			
		}
	},
	parametro: function(tipo,ID) {
		return {
			tipo: TIPO_INSTRUCCION.PARAMETRO,
			tipo_dato: tipo,
			id:ID,
			
		}
	},

	nuevoid: function(id) {
		return {
			id:id
		}
	},

	funcion: function(parametros , cuerpo) {
		return {
			tipo: TIPO_INSTRUCCION.FUNCION,
			parametros:parametros,
			cuerpo:cuerpo
		}
	},
	funcionvoid: function(id,parametros , cuerpo) {
		return {
			tipo: TIPO_INSTRUCCION.FUNCION,
			id:id,
			parametros:parametros,
			cuerpo:cuerpo
		}
	},
	nuevoif: function(condicion , cuerpo,elses) {
		return {
			tipo: TIPO_INSTRUCCION.IF,
			condicion:condicion,
			cuerpo:cuerpo,
			else:elses
		}
	},
	nuevoelse: function( cuerpo) {
		return {
			cuerpo:cuerpo,
		}
	},

	nuevowhile: function(condicion , cuerpo,elses) {
		return {
			tipo: TIPO_INSTRUCCION.WHILE,
			condicion:condicion,
			cuerpo:cuerpo
		}
	},
	nuevodo: function(cuerpo,condicion) {
		return {
			tipo: TIPO_INSTRUCCION.DO_WHILE,
			cuerpo:cuerpo,
			condicion:condicion
			
		}
	},

	nuevofor: function(Asignacion,condicion,decoaumen,cuerpo) {
		return {
			tipo: TIPO_INSTRUCCION.FOR,
			variable:Asignacion,
			condicion:condicion,
			INCoDEC:decoaumen,
			cuerpo:cuerpo
		
			
		}
	},
	nuevoswitch: function(exprecion,listacase) {
		return {
			tipo: TIPO_INSTRUCCION.SWITCH,
			exprecion:exprecion,
			listacase:listacase
			
			
			
		}
	},
	nuevocase: function(exprecion,cuerpo) {
		return {
			tipo: TIPO_INSTRUCCION.CASE,
		    exprecion :exprecion,
			cuerpo:cuerpo
			
			
		}
	},
	nuevodefcase: function(cuerpo) {
		return {
			tipo: TIPO_INSTRUCCION.DEF_CASE,
			cuerpo:cuerpo
			
			
		}
	},
	nuevoprint: function(print) {
		return {
			tipo: TIPO_INSTRUCCION.PRINT,
			print:print
			
			
		}
	}
	,
	nuevoprintln: function(print) {
		return {
			tipo: TIPO_INSTRUCCION.PRINTLN,
			println:print
			
			
		}
	},
	nuevoreturn: function(valor) {
		return {
			tipo: TIPO_INSTRUCCION.RETURN,
			valor: valor 
			
		}
	}
	,
	nuevobreak: function() {
		return {
			tipo: TIPO_INSTRUCCION.BREAK
			
		}
	}
	
	,
	nuevocontinue: function() {
		return {
			tipo: TIPO_INSTRUCCION.CONTINUE
			
		}
	}
	
	


 
	
}
// Exportamos nuestras constantes y nuestra API

module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
