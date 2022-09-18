function checkGateIntersection(gate) {
    for(let g of getGateList()) {
        if(gate.pos[0] + gate.outputPos[0] >= g.pos[0] && gate.pos[0] <= g.pos[0] + g.outputPos[0] && gate.pos[1] + gate.outputPos[1] >= g.pos[1] && gate.pos[1] <= g.pos[1] + g.outputPos[1]) {
            if(gate.pos[1] + gate.outputPos[1] > height*0.85) {
                gate.pos[0] += g.outputPos[0] + 200;
                gate.pos[1] = 100;
                checkGateIntersection(gate);
            } else {
                gate.pos[1] += g.outputPos[1] + 200;
            }

        }
    }
}

/*
function drawCircuit(parsedExpr, varList, varDict) {
    let drawnGates = 0;
    if(parsedExpr.length == 1) {
        if(typeof parsedExpr == 'object') {
            return drawCircuit(parsedExpr[0], varList, varDict);
        }
    } if(typeof parsedExpr == "string" || typeof parsedExpr == "char") {
        return getInput(varDict.indexOf(parsedExpr));
    }
    for(let i = 0; i < parsedExpr.length; i++) {
        let symbol = parsedExpr[i];
        
        if(symbol == '!') {
            if(parsedExpr.length > 2) {
                parsedExpr.splice(i, 2, ['!', parsedExpr[i+1]]);
                i--;
            } else {
                drawnGates++;
                let drawn = drawCircuit(parsedExpr[i+1], varList, varDict);
                let notgate = getNOTGate();
                if(drawn instanceof Input) {
                    notgate.pos[0] = drawn.pos[0]+100;
                } else {
                    notgate.pos[0] = drawn.pos[0] + drawn.outputPos[0] + 100;
                }
            notgate.pos[1] = 200*drawnGates;
            checkGateIntersection(notgate);
                addGate(notgate);
                addConnection(drawn, notgate);

                return notgate;
            }
        }

        if(symbol == '&') {
            var lhs = parsedExpr.slice(0, i);
            var rhs = parsedExpr.slice(i+1, parsedExpr.length);
            let drawn1 = drawCircuit(lhs, varList, varDict);
            let drawn2 = drawCircuit(rhs, varList, varDict);
            if(drawn1 instanceof ANDGate || drawn2 instanceof ANDGate) {
                if(drawn1 instanceof ANDGate) {
                    addConnection(drawn2, drawn1);
                    return drawn1;
                } else {
                    addConnection(drawn1, drawn2);
                    return drawn2;
                }
            }
            drawnGates++;
            let andgate = getANDGate();
            andgate.pos[0] = Math.max((drawn1 instanceof Input) ? drawn1.pos[0] : drawn1.pos[0] + drawn1.outputPos[0], ((drawn2 instanceof Input) ? drawn2.pos[0] : drawn2.pos[0] + drawn2.outputPos[0])) + 100;
            andgate.pos[1] = 100*drawnGates;
            checkGateIntersection(andgate);
            addGate(andgate);
            addConnection(drawn1, andgate);
            addConnection(drawn2, andgate);
            return andgate;
        }

        if(symbol == '|') {
            var lhs = parsedExpr.slice(0, i);
            var rhs = parsedExpr.slice(i+1, parsedExpr.length);
            let drawn1 = drawCircuit(lhs, varList, varDict);
            let drawn2 = drawCircuit(rhs, varList, varDict);
            if(drawn1 instanceof ORGate || drawn2 instanceof ORGate) {
                if(drawn1 instanceof ORGate) {
                    addConnection(drawn2, drawn1);
                    return drawn1;
                } else {
                    addConnection(drawn1, drawn2);
                    return drawn2;
                }
            }
            drawnGates++;
            let orgate = getORGate();
            orgate.pos[0] = Math.max((drawn1 instanceof Input) ? drawn1.pos[0] : drawn1.pos[0] + drawn1.outputPos[0], ((drawn2 instanceof Input) ? drawn2.pos[0] : drawn2.pos[0] + drawn2.outputPos[0])) + 100;
            orgate.pos[1] = 100*drawnGates;
            checkGateIntersection(orgate);
            addGate(orgate);
            addConnection(drawn1, orgate);
            addConnection(drawn2, orgate);
            return orgate;
        }

    }

}
*/

function drawCircuit(root, varList, varDict, totalHeight) {
    if(root.getValue().getType() == 'e') {
        return getInput(varDict.indexOf(root.getValue().getValue()));
    }
    let posX = width*(root.getHeight()/(totalHeight+1));
    switch(root.getValue().getValue()) {
        case '&':
            var andgate = getANDGate();
            andgate.pos[0] = posX;
            andgate.pos[1] = 0;
            var totalY = 0;
            for(let child of root.getChildren()) {
                var drawn = drawCircuit(child, varList, varDict, totalHeight);
                totalY += drawn.pos[1];
                addConnection(drawn, andgate);
            }
            var posY = totalY/root.getChildren().length;
            andgate.pos[1] = posY;
            checkGateIntersection(andgate);
            addGate(andgate);
            return andgate;
        case '|':
            var orgate = getORGate();
            orgate.pos[0] = posX;
            orgate.pos[1] = 0;
            var totalY = 0;
            for(let child of root.getChildren()) {
                var drawn = drawCircuit(child, varList, varDict, totalHeight);
                totalY += drawn.pos[1];
                addConnection(drawn, orgate);
            }
            var posY = totalY/root.getChildren().length;
            orgate.pos[1] = posY;
            checkGateIntersection(orgate);
            addGate(orgate);
            return orgate;
        case '!':
            var drawn = drawCircuit(root.getChild(0), varList, varDict, totalHeight);
            var posY = drawn.pos[1];
            var notgate = getNOTGate();
            notgate.pos[0] = posX;
            notgate.pos[1] = posY;
            checkGateIntersection(notgate);
            addGate(notgate);
            addConnection(drawn, notgate);
            return notgate;
    }
}

function flattenTree(root) {
    for(let child of root.getChildren()) {
        if(root.getValue().getValue() == '&' || root.getValue().getValue() == '|') {
            if(child.getValue().getValue() == root.getValue().getValue()) {
                for(let grandchild of child.getChildren()) {
                    root.addChild(grandchild);
                }
                root.removeChild(child);
            }
        }
        flattenTree(child);
    }
}

const drawExpression = document.getElementById("drawExpression");
drawExpression.onclick = function() {
    let expression = document.getElementById("expression").value;
    expression = checkExpression(expression);
    if(expression.length > 0 && checkExpressionFormatting(expression)) {
        clear();

        let partialParsed = partialParse(expression);
        //let parsedExpr = parseExpression(partialParsed, []);
        let rpn = genRPN(partialParsed);
        let root = genParseTree(rpn);
        flattenTree(root);
        console.log(root);
        let vars = getVariables(expression);
        addOutput();
        const varDict = [];
        for(let variable of vars) {
            addInput();
            varDict.push(variable);
        }
        finalGate = drawCircuit(root, vars, varDict, root.getHeight());
        addConnection(finalGate, getOutput(0));
        adjustConnections();
    }
}