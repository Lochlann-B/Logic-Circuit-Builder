let expSubmit = document.getElementById("submitSOP");
let posSubmit = document.getElementById("submitPOS");

camera = new Camera();

function simplify(expression, get1s=true) {
    if(expression.length > 0 && checkExpressionFormatting(expression)) {
        expression = checkExpression(expression);
        let partialParsed = partialParse(expression);
        let rpn = genRPN(partialParsed);
        let tree = genParseTree(rpn);
        let answerText = QM(tree, getVariables(expression), get1s);
        let output = document.getElementById("outputText");
        output.className = "answer";
        output.textContent = (answerText == '' ? "Expression always false!" : answerText);
        return answerText;
    }
}

posSubmit.onclick = function() {
    let expression = document.getElementById("expression").value;
    let ansText = simplify(expression, false);
    ansText = checkExpression(ansText);
    let partialParseExpr = partialParse(ansText);
    let ans = convertToPOS(partialParseExpr);
    let output = document.getElementById("outputText");
    output.className = "answer";
    output.textContent = (ans == '()' ? 'Expression always false!' : ans);
}

expSubmit.onclick = function() {
    let expression = document.getElementById("expression").value;
    simplify(expression);
}