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
    avaliarExpressao(inputExpressao.value)
});

let btnLimparEntrada = document.querySelector('#cancelar');
btnLimparEntrada.addEventListener('click', () => {
    inputExpressao.value = '';
});

let testes = [
    "20+2*6/2-5",
    "2*(2+3)",
    "2*2+3",
    "2+2*3",
    "-20+2*6/(-2-7)",
    "-20+2*6/(2-7)",
    "5+4-3+6/1*5",
    "-5+4-3+6-3/1*5",
    "-20-(104*5)+1",
    "1.5+2.5",
    "-20+2*6/-(-2-1)"
];

function exibirResultadoNoVisor(resultado) {
    inputResultado.value += `${inputExpressao.value} = ${resultado}\n`
}

function avaliarExpressao(expressao) {
    let arr = expressao.replaceAll(',', '.').split('').filter(e => e != ' ');

    while( arr.findIndex(e => e == ')' ) >= 0 ) {
        let i = arr.findIndex(e => e == ')' )

        let inicio = buscarParentesesDeAbertura(i, arr);
        console.log("Posição do parentese final:", i)
        console.log("Posição do parentese inicial:", inicio)
        
        let miniExpressao = arr.slice(inicio, i+1).join('');
        console.log("Expressão a ser resolvida:", miniExpressao);
        
        let resultado = resolverExpressao(miniExpressao);

        console.log(resultado)
        arr.splice(inicio, i-inicio+1, resultado);
        console.log(arr)

    }

    let resultado = resolverExpressao(arr.join(''));
    console.log("O resultado final é", resultado)
    exibirResultadoNoVisor(resultado);

}

function resolverExpressao(expressao) {
    let expr = expressao.split('').filter(e => e != '(' && e != ')')
    console.log(expr)
    let numeros = extraiNumeros(expr);
    let operadores = extraiSinais(expr);

    console.log(numeros)
    console.log(operadores)

    if(operadores.length == 0) {
        return numeros[0];
    }
    else {
        return resolverParenteses(operadores, numeros);
    }
}

function aplicar(a, b, operador) {
    if (operador == '+') return a + b;
    if (operador == '-') return a - b;
    if (operador == '*') return a * b;
    if (operador == '/') {
        if(b == 0) {
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
            operadores.push(arr[i])
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
            numeroString += arr[i];
            continue;
        }

        if(/\d/.test(arr[i]) || arr[i] == '.'){
            numeroString += arr[i];
        }
        
        if(/[-+*\/]/.test(arr[i])) {
            numeros.push(numeroString);
            numeroString = '';
        }

        if(i == arr.length-1) {
            if(numeroString != '') {
                numeros.push(numeroString)
                numeroString = ''
            }
        }
    }
    console.log(numeros)
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

function resolverParenteses(sinais, numeros) {
    let arr = sinais;
    
    while(arr.length > 0){
        let indice = procuraPrimeiraOperacao(arr);
        
        let a = numeros[indice];
        let b = numeros[indice+1];
        let op = arr[indice];
        let c = aplicar(a, b, op);
        
        numeros[indice] = c;
        numeros.splice(indice + 1, 1);
        arr.splice(indice, 1);
    }

    let resultado = numeros[0];
    return resultado;
}