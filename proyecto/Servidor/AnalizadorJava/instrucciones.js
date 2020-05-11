
// Constantes para los tipos de 'valores' que reconoce nuestra gramática.
const TIPO_VALOR = {
	NUMERO:         'VAlOR_NUMERO',
	IDENTIFICADOR:  'VALOR_IDENTIFICADOR',
	CADENA:         'VALOR_CADENA',
}

// Constantes para los tipos de 'operaciones' que soporta nuestra gramática.
const TIPO_OPERACION = {
	SUMA:           'OP_SUMA',
	RESTA:          'OP_RESTA',
	MULTIPLICACION: 'OP_MULTIPLICACION',
	DIVISION:       'OP_DIVISION',
	NEGATIVO:       'OP_NEGATIVO',
	MAYOR_QUE:      'OP_MAYOR_QUE',
	MENOR_QUE:      'OP_MENOR_QUE',

	MAYOR_IGUAL: 	'OP_MAYOR_IGUAL',
	MENOR_IGUAL:    'OP_MENOR_IGUAL',
	DOBLE_IGUAL:    'OP_DOBLE_IGUAL',
	NO_IGUAL:    	'OP_NO_IGUAL',

	AND:  			'OP_AND',
	OR: 			'OP_OR',
	NOT:   			'OP_NOT',  	

	CONCATENACION:  'OP_CONCATENACION'
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
	SWITCH:			'SWITCH',
	VALOR:          'VALOR_VARIABLE',
	PARAMETRO:       'PARAMETRO'
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














	nuevoAsignacion: function(identificador, expresionNumerica) {
		return {
			tipo: TIPO_INSTRUCCION.ASIGNACION,
			identificador: identificador,
			expresionNumerica: expresionNumerica
		}
	},

	/**
	 * Crea un objeto tipo Instrucción para la sentencia If.
	 * @param {*} expresionLogica 
	 * @param {*} instrucciones 
	 */
	nuevoIf: function(expresionLogica, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.IF,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones
		}
	},

	/**
	 * Crea un objeto tipo Instrucción para la sentencia If-Else.
	 * @param {*} expresionLogica 
	 * @param {*} instruccionesIfVerdadero 
	 * @param {*} instruccionesIfFalso 
	 */
	nuevoIfElse: function(expresionLogica, instruccionesIfVerdadero, instruccionesIfFalso) {
		return {
			tipo: TIPO_INSTRUCCION.IF_ELSE,
			expresionLogica: expresionLogica,
			instruccionesIfVerdadero: instruccionesIfVerdadero,
			instruccionesIfFalso: instruccionesIfFalso
		}
	},
  
	/**
	 * Crea un objeto tipo Instrucción para la sentencia Switch.
	 * @param {*} expresionNumerica 
	
	nuevoSwitch: function(expresionNumerica, casos) {
		return {
			tipo: TIPO_INSTRUCCION.SWITCH,
			expresionNumerica: expresionNumerica,
			casos: casos
		}
	},

	
	 * Crea una lista de casos para la sentencia Switch.
	 * @param {*} caso 
	
	nuevoListaCasos: function (caso) {
		var casos = []; 
		casos.push(caso);
		return casos;
	},

	/**
	 * Crea un objeto tipo OPCION_SWITCH para una CASO de la sentencia switch.
	 * @param {*} expresionNumerica 
	 * @param {*} instrucciones 
	 
	nuevoCaso: function(expresionNumerica, instrucciones) {
		return {
			tipo: TIPO_OPCION_SWITCH.CASO,
			expresionNumerica: expresionNumerica,
			instrucciones: instrucciones
		}
	},
	/**
	 * Crea un objeto tipo OPCION_SWITCH para un CASO DEFECTO de la sentencia switch.
	 * @param {*} instrucciones 
	 
	nuevoCasoDef: function(instrucciones) {
		return {
			tipo: TIPO_OPCION_SWITCH.DEFECTO,
			instrucciones: instrucciones
		}
	},
    
	/**
	* Crea un objeto tipo Operador (+ , - , / , *) 
	* @param {*} operador 
	*/
	nuevoOperador: function(operador){
		return operador 
	},
 
	/**
	 * Crea un objeto tipo Instrucción para la sentencia Asignacion con Operador
	 * @param {*} identificador 
	 * @param {*} operador 
	 * @param {*} expresionCadena 
	 */
	nuevoAsignacionSimplificada: function(identificador, operador , expresionNumerica){
		return{
			tipo: TIPO_INSTRUCCION.ASIGNACION_SIMPLIFICADA,
			operador : operador,
			expresionNumerica: expresionNumerica,
			identificador : identificador
		} 
	}
}
// Exportamos nuestras constantes y nuestra API

module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
