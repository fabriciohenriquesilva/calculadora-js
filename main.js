let inputExpressao = document.querySelector('#expressao');
let inputResultado = document.querySelector('#resultado');

let inputDigitos = document.querySelectorAll('.digito');
inputDigitos.forEach(e => { 
    e.addEventListener('click', function() {
        inputExpressao.value += this.innerHTML;
    });
});

let btnLimparHistorico = document.querySelector('#limpar');
btnLimparHistorico.addEventListener('click', () => {
    inputResultado.value = '';
});

let btnCalcular = document.querySelector('#calcular');
btnCalcular.addEventListener('click', () => {
    let resultado = avaliarExpressao(inputExpressao.value);
    if(resultado != null || resultado != undefined) {
        exibirResultadoNoVisor(resultado);
    }
});

let btnLimparEntrada = document.querySelector('#cancelar');
btnLimparEntrada.addEventListener('click', () => {
    inputExpressao.value = '';
});

let testes = [
    "20+2*6/2-5", // 21
    "2*(2+3)", // 10
    "2*2+3", // 7
    "2+2*3", // 8
    "-20+2*6/(-2-7)", // -21.3333332
    "-20+2*6/(2-7)", // -22.4
    "5+4-3+6/1*5", // 36
    "-5+4-3+6-3/1*5", // -13
    "-20-(104*5)+1", // -539
    "-20-(-104*5)+1", // 501
    "1.5+2.5", // 4
    "(-5+(3+(2*3-(-2.5*-2+5/3))+7))", // 4.3333
    "-5+(3+(2*3-(-2.5*-2))+7)", // 6
    "-5+(3+(2*3-(-2.5*(-2)))+7)", // 6
    "(2+3*4)-4", // 10
    "((2+3)*4)-4/-(3-1)", // 22
    "((2+3)*4)-4/-(-3-1)", // 19
    "-20+2*6/-(-2-1)", // -16
    "-20+(2*6/-(-2-1)+5*2)", // -6
    "-(1.25-2.51)", // 1.259999999998
    "-(-1.25-2.51)", // 3.76
    "(0.25+(2*(5+2)-10)+(3-2/4*(1+6*2)))", // 0.75
    "(0.25+-(2*(5+2)-10)+(3-2/4*(1+6*2)))" // -7,25
];

function exibirResultadoNoVisor(resultado) {
    inputResultado.value += `${inputExpressao.value} = ${resultado}\n`;
}

function avaliarExpressao(expressao) {
    let arr = expressao.replaceAll(',', '.').split('').filter(e => e != ' ');
    
    if(iniciaComOperadorInvalido(arr)){
        return exibirResultadoNoVisor("Erro no início da expressão");
    }
    if(possuiCaracteresInvalidos(arr)) {
        return exibirResultadoNoVisor("Expressão possui caractere inválido");
    }
    if(possuiParentesesIncompletos(arr)) {
        return exibirResultadoNoVisor("Parênteses incompletos");
    }
    if(possuiOperadoresInconsistentes(arr)) {
        return exibirResultadoNoVisor("Operadores inconsistentes");
    }
    if(terminaComOperadorInvalido(arr)) {
        return exibirResultadoNoVisor("Erro no final da expressão");
    }
    
    if(arr[0] == '+') {
        arr.unshift('0');
    }
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == '+' && arr[i-1] == '-') {
            arr.splice(i, 1)
        }
    }

    while( arr.findIndex(e => e == ')' ) >= 0 ) {
        let fimParenteses = arr.findIndex(e => e == ')' );

        let inicioParenteses = buscarParentesesDeAbertura(fimParenteses, arr);
        
        let expressaoEntreParenteses = arr.slice(inicioParenteses, fimParenteses+1);
        
        let resultado = resolverExpressao(expressaoEntreParenteses);

        arr.splice(inicioParenteses, fimParenteses-inicioParenteses+1, resultado);
    }

    let resultado = resolverExpressao(arr);
    return resultado;

}

function resolverExpressao(expressao) {
    let expr = expressao.filter(e => e != '(' && e != ')' && e != '')
    let numeros = extraiNumeros(expr);
    let operadores = extraiSinais(expr);

    if(operadores.length == 0) {
        return numeros[0];
    }
    else {
        while(operadores.length > 0){
            let indice = procuraPrimeiraOperacao(operadores);
            
            let a = numeros[indice];
            let b = numeros[indice+1];
            let op = operadores[indice];
            let c = aplicar(a, b, op);
            
            numeros[indice] = c;
            numeros.splice(indice + 1, 1);
            operadores.splice(indice, 1);
        }
    
        let resultado = numeros[0];
        return resultado;
    }
}

function aplicar(a, b, operador) {
    if (operador == '+') return a + b;
    if (operador == '-') return a - b;
    if (operador == '*') return a * b;
    if (operador == '/') {
        if(b == 0) {
            exibirResultadoNoVisor("Não é permitido dividir por zero");
            throw new Error("Não é permitido dividir por zero");
        }   
        else {
            return a / b;
        }
    }
}

function procuraPrimeiraOperacao(operadores) {
    let peso = 0;
    let indice = -1;

    for (let i = 0; i < operadores.length; i++) {
        let operador = operadores[i];

        if (operador == ')') {
            if (peso < 3) {
                indice = i;
                peso = 3;
            }
        }

        if (operador == '*' || operador == '/') {
            if (peso < 2) {
                indice = i;
                peso = 2;
            }
        }

        if (operador == '+' || operador == '-') {
            if (peso < 1) {
                indice = i;
                peso = 1;
            }
        }
    }
    return indice;
}

function extraiSinais(expressao) {

    let arr = expressao;
    let operadores = [];

    for(let i = 0; i < arr.length; i++) {
        if(/[+*\/]/.test(arr[i])) {
            operadores.push(arr[i]);
        }
        else if(arr[i] == '-' && /\d/.test(arr[i-1]) && /\d/.test(arr[i+1])) {
            operadores.push(arr[i]);
        }
    }
        
    return operadores;
}

function extraiNumeros(expressao) {
    let arr = expressao;
    let numeroString = '';
    let numeros = [];

    for(let i = 0; i < arr.length; i++){
        if( arr[i] == '-' && ( /[+*\/]/.test(arr[i-1]) || i == 0) ) {

            if(arr[i+1] < 0) {
                arr[i+1] *= -1;
                arr.splice(i, 1);
            }
            else {
                numeroString += arr[i];
                continue;
            }
        }
        
        if(/\d/.test(arr[i]) || arr[i] == '.'){
            numeroString += arr[i];
        }
        else if(/[-+*\/]/.test(arr[i])) {
            numeros.push(numeroString);
            numeroString = '';
        }

        if(i == arr.length-1) {
            if(numeroString != '') {
                numeros.push(numeroString);
                numeroString = '';
            }
        }
    }
    return numeros.map(e => parseFloat(e));
}

function buscarParentesesDeAbertura(indice, arr) {
    for(let i = indice; i >= 0; i--) {
        if(arr[i] == '(') {
            return i;
        }
    }
    return -1;
}

function possuiParentesesIncompletos(expressao) {
    let arr = expressao;
    let qtdeParenteseAbrindo = 0;
    let qtdeParenteseFechando = 0;

    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == '(') {
            qtdeParenteseAbrindo++;
        }
        if(arr[i] == ')') {
            qtdeParenteseFechando++;
        }
    }

    if(qtdeParenteseAbrindo != qtdeParenteseFechando) {
        return true;
    }
    return false;
}

function possuiOperadoresInconsistentes(expressao) {
    let arr = expressao;
    for(let i = 0; i < arr.length; i++) {
        let elemento = arr[i];

        if( /[+*\/]/.test(elemento) ) {
            if( /[+*\/]/.test(arr[i+1]) ) {
                return true;
            }
        } else if (elemento == '-') {
            if(arr[i+1] == '/' || arr[i+1] == '*') {
                return true;
            }
        }
    }
    return false;
}

function iniciaComOperadorInvalido(expressao) {
    let arr = expressao;
    if(/[.&,;:|?%$@!=*\/]/.test(arr[0])) {
        return true;
    }
    return false;
}

function terminaComOperadorInvalido(expressao) {
    let arr = expressao;
    let elemento = arr[arr.length-1];
    if(/[-.&,;:|?%$@!=+*\/]/.test(elemento)) {
        return true;
    }
    return false;
}

function possuiCaracteresInvalidos(expressao) {
    return expressao.some(e => /[a-zA-Z&;:|?%$@!=]/.test(e));
}
