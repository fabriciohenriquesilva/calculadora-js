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
btnCalcular.addEventListener('click', calcular);

let btnLimparEntrada = document.querySelector('#cancelar');
btnLimparEntrada.addEventListener('click', () => {
    inputExpressao.value = '';
})

function calcular() {
    let expressao = inputExpressao.value;

    let numeros = extraiNumeros(expressao);
    let sinais = extraiSinais(expressao);

    console.log(numeros);
    console.log(sinais);

    while (sinais.length > 0) {
        let c = 0;
        let indice = procuraPrimeiraOperacao(sinais);
        let op = sinais[indice];

        if (op == ')') {
            let inicio = buscarParentesesDeAbertura(indice, sinais);
            let s = sinais.splice(inicio, indice);
            let n = numeros.slice(inicio, indice);
            c = resolverParenteses(s, n);
            
            numeros[inicio] = c;
            numeros.splice(inicio+1, n.length);
        }
        else {
            let a = numeros[indice];
            let b = numeros[indice + 1];

            c = aplicar(a, b, op);
            numeros[indice] = c;
            numeros.splice(indice + 1, 1);
            sinais.splice(indice, 1);
        }
    }
    let resultado = numeros[0];
    inputResultado.value += `${expressao} = ${resultado} \n`;
}

function aplicar(a, b, operador) {
    if (operador == '+') return a + b;
    if (operador == '-') return a - b;
    if (operador == '*') return a * b;
    if (operador == '/') return a / b;
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
    let arr = expressao.replaceAll(',', '.').split('')
        .filter(e => e != ' ')
        .filter(e => /\D/.test(e))
        .filter(e => e != '.');
    
    if(arr[0] == '-'){
        arr.splice(0, 1);
    }
    
    return arr;
}

function extraiNumeros(expressao) {
    let arr = expressao.replaceAll(',', '.').split('').filter(e => e != ' ');

    console.log(arr);

    let numeroString = '';
    let numeros = [];

    for(let i = 0; i < arr.length; i++){
        if(/\d/.test(arr[i]) || arr[i] == '-' || arr[i] == '.'){
            numeroString += arr[i];

            if(i+1 >= arr.length) {
                numeros.push(numeroString);
            }

            for(let j = i+1; j < arr.length; j++) {
                if(/\d/.test(arr[j]) || arr[j] == '.') {
                    numeroString += arr[j];
                    i = j;
                    continue; // break faz 1.5 + 2.5 funcionar
                }
                if(/[+*-\/()]/.test(arr[j]) || j == arr.length-1) {
                    i = j;
                    if(arr[j] != '('){
                        numeros.push(numeroString);
                        numeroString = '';
                    }
                    break;
                }
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

function resolverParenteses(sinais, numeros) {
    let arr = sinais.filter(e => e != '(' && e != ')');
    
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