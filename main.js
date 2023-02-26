let inputExpressao = document.querySelector('#expressao');
let inputResultado = document.querySelector('#resultado');

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
    // let expressao = '-20 + 2 * 6 / ( 2 - 7)';
    // let expressao = '5 + 4 - 3 + 6 - 3 / (1 * 5)';
    console.log(expressao);

    let operandos = extraiNumeros(expressao);
    let operadores = extraiOperadores(expressao);

    console.log("L26 -> ", operandos);
    console.log("L27 -> ", operadores);

    while (operadores.length > 0) {
        let indice = procuraPrimeiraOperacao(operadores);
        let a = operandos[indice];
        let b = operandos[indice + 1];
        let op = operadores[indice];
        let c = 0;

        if (op == '(') {
            let op = operadores.splice(indice + 1, 1);
            operadores.splice(operadores.indexOf(')'), 1);
            c = aplicar(a, b, op);
            // console.table([a, op, b, c]);
        }
        else {
            c = aplicar(a, b, op);
            // console.table([a, op, b, c]);
        }

        operandos[indice] = c;
        operandos.splice(indice + 1, 1);
        operadores.splice(indice, 1);

        // console.log(operadores);
        // console.log(operandos);

    }

    console.log(operandos);
    let resultado = operandos[0];
    inputResultado.value += `${expressao} = ${resultado} \n`;
}

inputExpressao.addEventListener('blur', () => {
    

});

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

        if (operador == '(') {
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

function extraiOperadores(expressao) {
    let arr = expressao.split(/\s?\d+\s?|\s/)
        .filter(e => e != '');
    
    if(arr[0] == '-'){
        arr.splice(0, 1);
    }
    
    arr = verificaErroDeDivisaoPorParenteses(arr);

    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == '-') {
            arr[i] = '+';
        }
    }   
    
    return arr;
}

function extraiNumeros(expressao) {
    let arr = expressao.replaceAll(',', '.').split('').filter(e => e != ' ');

    let numeroString = '';
    let numeros = [];

    console.log(arr);

    for(let i = 0; i < arr.length; i++){
        console.log("arr[i]", arr[i]);
        if(/\d/.test(arr[i]) || arr[i] == '-' || arr[i] == '.'){
            numeroString += arr[i];

            if(i+1 >= arr.length) {
                numeros.push(numeroString);
            }

            for(let j = i+1; j < arr.length; j++) {
                console.log("v[j]", arr[j])
                if(/\d/.test(arr[j]) || arr[j] == '.') {
                    numeroString += arr[j];
                    console.log("L141", i, j, arr[j], numeroString);
                    i = j;
                }
                if(arr[j] == '-'){
                    numeros.push(numeroString);
                    numeroString = '';
                    break;
                }
                if(/[+*\/()]/.test(arr[j]) || j == arr.length-1) {
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

function verificaErroDeDivisaoPorParenteses(arr) {
    let i = arr.findIndex(e => e == '/(');
    let copy = arr;
    if(i > 0) {
        copy = arr.slice(0, i);
        copy.push('/', '(');
        copy.push(...arr.slice(i+1));
    }

    return copy;

}