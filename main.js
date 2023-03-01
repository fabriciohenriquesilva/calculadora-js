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
]

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
        // console.log(op)

        if (op == ')') {
            let inicio = buscarParentesesDeAbertura(indice, sinais);
            // console.log(indice, op, inicio);
            let s = sinais.splice(inicio, indice-inicio+1);
            // console.log(s, sinais)
            let n = numeros.splice(inicio, indice-inicio);
            c = resolverParenteses(s, n);
            // console.log(c)
            numeros.splice(inicio, 0, c);
        }
        else {
            let a = numeros[indice];
            let b = numeros[indice + 1];
            // console.log(numeros)

            c = aplicar(a, b, op);
            // console.table([a, op, b, c]);

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
        .filter(e => e != ' ');

    // console.log(arr)
    for(let i = 0; i < arr.length; i++) {
        if(i > 0 && arr[i] == '-' && arr[i-1] == '(') {
            // console.log([i, arr[i]]);
            arr.splice(i, 1);
        }
        // if(arr[i] == '-' && arr[i+1] == '(') {
        //     arr[i] = '*';
        // }
    }

    arr = arr.filter(e => /\D/.test(e))
        .filter(e => e != '.');

    if(arr[0] == '-' && arr.length > 1){
        arr.splice(0, 1);
    }
        
    return arr;
}

function extraiNumeros(expressao) {
    let arr = expressao.replaceAll(',', '.').split('').filter(e => e != ' ');

    // console.log(arr);

    let numeroString = '';
    let numeros = [];

    for(let i = 0; i < arr.length; i++){
        // console.log([i, arr[i], numeroString]);
        if( (i == 0 || arr[i-1] == '(') && arr[i] == '-') {
            numeroString += arr[i];
            continue;
        }

        if(/\d/.test(arr[i]) || arr[i] == '.'){
            numeroString += arr[i];
        }
        
        if(/[-+*\/]/.test(arr[i])) {
            // if(arr[i] == '-' && arr[i+1] == '(') {
            //     console.log(i)
            //     numeros.push(-1);
            //     numeroString = '';
            // }
            // else{
            numeros.push(numeroString);
            numeroString = '';
        }
        // else {
        //     console.log("Operação inválida");
        // }

        if(i == arr.length-1) {
            numeros.push(numeroString);
            numeroString = '';
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
        // console.table([a, op, b, c]);
        
        numeros[indice] = c;
        numeros.splice(indice + 1, 1);
        arr.splice(indice, 1);
    }

    let resultado = numeros[0];
    return resultado;
    
}