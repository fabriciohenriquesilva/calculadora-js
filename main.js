let inputExpressao = document.querySelector('#expressao');
let inputResultado = document.querySelector('#resultado');

inputExpressao.addEventListener('blur', () => {
    // let expressao = inputExpressao.value;
    // let expressao = '20 +2 * 6 /2 - 5';
    let expressao = '5 + 4 - 3 + 6 / 1 * 5'
    console.log(expressao);
    
    let operandos = expressao.split(/[\+\-\*\/]/).map(e => parseFloat(e));
    let operadores = expressao.split(/\s?\d+\s?/).filter( e => e != '');

    console.log(operandos);
    console.log(operadores);
    
    while(operadores.length > 0) {
        let indice = procuraPrimeiraOperacao(operadores);
        let a = operandos[indice];
        let b = operandos[indice + 1];
        let op = operadores[indice];
        
        let c = aplicar(a, b, op);
     
        console.table([a, op, b, c]);
        operandos[indice] = c;
        operandos.splice(indice + 1, 1);
        operadores.splice(indice, 1);

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
