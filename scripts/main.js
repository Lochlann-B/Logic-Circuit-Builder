let expSubmit = document.getElementById("submitSOP");
let posSubmit = document.getElementById("submitPOS");

function simplify(expression, get1s=true) {
    if(expression.length > 0 && checkExpressionFormatting(expression)) {
        expression = checkExpression(expression);
        let partialParsed = partialParse(expression);

        let parsedExpr = parseExpression(partialParsed, []);

        let answerText = QM(parsedExpr, getVariables(partialParsed), get1s);
        let output = document.getElementById("outputText");
        output.className = "answer";
        output.textContent = answerText;
        return answerText;
    }
}

posSubmit.onclick = function() {
    let expression = document.getElementById("expression").value;
    let ansText = simplify(expression, false);
    ansText = checkExpression(ansText);
    let partialParseExpr = partialParse(ansText);
    //let parsedExpr = parseExpression(partialParseExpr, []);
    let ans = convertToPOS(partialParseExpr);
    let output = document.getElementById("outputText");
    output.className = "answer";
    output.textContent = ans;
}

expSubmit.onclick = function() {
    let expression = document.getElementById("expression").value;
    simplify(expression);
}