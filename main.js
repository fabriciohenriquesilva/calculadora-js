let inputExpressao = document.querySelector('#expressao');
let inputResultado = document.querySelector('#resultado');

inputExpressao.addEventListener('blur', () => {
    // let expressao = inputExpressao.value;
    let expressao = '20 + 2 * 6 / (2 - 7)';
    // let expressao = '5 + 4 - 3 + 6 / 1 * 5';
    console.log(expressao);
    
    let operandos = extraiOperandos(expressao);
    let operadores = extraiOperadores(expressao);

    console.log(operandos);
    console.log(operadores);
    
    while(operadores.length > 0) {
        let indice = procuraPrimeiraOperacao(operadores);
        let a = operandos[indice];
        let b = operandos[indice + 1];
        let op = operadores[indice];
        let c = 0;
        
        if(op == '(') {
            let op = operadores.splice(indice+1, 1);
            operadores.splice(operadores.indexOf(')'), 1);
            c = aplicar(a, b, op);    
            console.table([a, op, b, c]);
        }
        else {
            c = aplicar(a, b, op);
            console.table([a, op, b, c]);
        }
     
        operandos[indice] = c;
        operandos.splice(indice + 1, 1);
        operadores.splice(indice, 1);

        console.log(operadores);
        console.log(operandos);

    }

    console.log(operandos);
    
});

function aplicar(a, b, operador) {
    if(operador == '+') return a + b;
    if(operador == '-') return a - b;
    if(operador == '*') return a * b;
    if(operador == '/') return a / b;
}

function procuraPrimeiraOperacao(operadores) {
    let peso = 0;
    let indice = -1;

    for(let i = 0; i < operadores.length; i++) {
        let operador = operadores[i];

        if(operador == '(') {
            if(peso < 3) {
                indice = i;
                peso = 3;
            }
        }

        if(operador == '*' || operador == '/') {
            if(peso < 2) {
                indice = i;
                peso = 2;
            }
        }

        if(operador == '+' || operador == '-') {
            if(peso < 1) {
                indice = i;
                peso = 1;
            }
        }
    }
    return indice;
}

function extraiOperandos(expressao) {
    return expressao.split(/\D+/)
                    .filter(e => e != '')
                    .map(e => parseFloat(e));
}

function extraiOperadores(expressao) {
    return expressao.split(/\s?\d+\s?|\s/)
                    .filter( e => e != '');
}
