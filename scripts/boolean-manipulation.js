

function QM(booleanFunction, varList, get1s=true) {
    let truthTable = getTruthTable(booleanFunction, varList, get1s);
    console.log("yeah");
    //Generate a table of all expressions which evaluate to true
    let mintermTable = [];
    for(let i = 0; i < truthTable.length; i++) {
        if(truthTable[i][truthTable[i].length-1] == true) {
            mintermTable.push(truthTable[i].slice(0, truthTable[i].length-1));
        }
    }

    mintermCopy = JSON.parse(JSON.stringify(mintermTable));

    //Combine minterms
    let essentialImplicants = [];
    let combinedMinterms = [];
    let combined = true;
    //If no combinations happen (no two minterms with a difference of 1 bit), then stop attempting to combine minterms
    while(combined) {
        combined = false;
        for(let i = 0; i < mintermTable.length; i++) {
            let hasCombined = false;
            for(let j = 0; j < mintermTable.length; j++) {
                let differenceCount = 0;
                let tempCombined = [];
                
                for(let k = 0; k < mintermTable[i].length; k++) {
                    if(((mintermTable[i][k] == '-' && mintermTable[j][k] != '-') || (mintermTable[i][k] != '-' && mintermTable[j][k] == '-'))) {
                        differenceCount = 0;
                        break;
                    }
                    if(mintermTable[i][k] != mintermTable[j][k]) {
                        differenceCount++;
                        tempCombined.push('-');
                    } else {
                        tempCombined.push(mintermTable[i][k]);
                    }
                }
                if(differenceCount == 1) {
                    //check to see if minterm is already in the combined array
                    
                    let entered = false;
                    for(let entry of combinedMinterms) {
                        let alreadyEntered = true;
                        for(let x = 0; x < entry.length; x++) {
                            if(entry[x] != tempCombined[x]) {
                                alreadyEntered = false;
                            }
                        }
                        if(alreadyEntered) {
                            entered = true;
                        }
                    }
                    
                    if(!entered || combinedMinterms.length == 0) {
                    combinedMinterms.push(tempCombined);

                    }
                    hasCombined = true;
                    combined = true;
                }
            }
            if(!hasCombined) {

                //Check to see if minterm is already in the essentialImplicants array
                let entered = false;
                for(let entry of essentialImplicants) {
                    let alreadyEntered = true;
                    for(let x = 0; x < entry.length; x++) {       
                        if(entry[x] != mintermTable[i][x]) {
                            alreadyEntered = false;
                        }
                    }
                    if(alreadyEntered) {
                        entered = true;
                    }
                }
                //Minterms in the essential implicants array are 'marked with an asterisk'
                if(!entered || essentialImplicants.length == 0) {
                    essentialImplicants.push(mintermTable[i]);
                }
            }
        }
        //console.log(combinedMinterms);
        
        mintermTable = combinedMinterms;
        combinedMinterms = [];

}

function getPossibleNums(implicant, implicantArray) {
    var possibleNums = [];
    let dashCount = 0;
    let dashIndexes = [];
    for(let y = 0; y < implicant.length; y++) {

        if(implicant[y] == '-') {
            dashCount++;
            dashIndexes.push(y);
        }
    }
    let code = genGreyCode(dashCount);
    for(let i = 0; i < code.length; i++) {
        possibleNums.push([]);
        var count = 0;
        for(let j = 0; j < implicant.length; j++) {
            if(dashIndexes.indexOf(j) != -1) {
                possibleNums[i].push(code[i][count]);
                count++;
            }
            else {
                possibleNums[i].push(implicant[j]);
            }
        }
    }
    return possibleNums;
    
}

//Create prime implicant table
implicantChart = [];
implicants = [];
for(let i = 0; i < essentialImplicants.length; i++) {
    implicantChart.push([]); 
    let implicantArray = [];
    implicantArray = getPossibleNums(essentialImplicants[i], implicantArray);
    implicants.push(implicantArray);
    for(let j = 0; j < mintermCopy.length; j++) {
        for(let implicant of implicantArray) {
            if(contentEquals(mintermCopy[j], implicant)) {
                implicantChart[i][j] = true;
                break;
            } else {
                implicantChart[i][j] = false;
            }
        }
        
    }
}
function scrubTable(row) {
    var length = implicantChart[row].length;
    for(let z = 0; z < length; z++) {
        if(implicantChart[row][z] == 1) {
            for(let l = 0; l < implicantChart.length; l++) {
                implicantChart[l].splice(z, 1);
            }
            z--;
            length--;
        }
    }
    implicantChart.splice(row, 1);
    essentialImplicants.splice(row, 1);
}

//Search for essential prime implicants
finalAns = [];
for(let i = 0; i < implicantChart[0].length; i++) {
    let index = -1;
    var unique = 0;
    for(let j = 0; j < implicantChart.length; j++) {
        if(implicantChart[j][i] == true) {
            unique++;
            index = j;
        }
    }
    if(unique == 1) {
        finalAns.push(essentialImplicants[index]);
        scrubTable(index);
        i--;
        if(implicantChart.length == 0) {
            break;
        }
    }
}
//Get any answer from the remaining implicants
while(implicantChart.length > 0) {
    if(implicantChart.length > 0) {
        if(implicantChart[0].length > 0) {
            finalAns.push(essentialImplicants[0]);
            
        }
        scrubTable(0);
    }
}

//console.log(finalAns);

let answer = "(";
for(let s = 0; s < finalAns.length; s++) {
    if(s != 0) {
        answer += ")+(";
    }
    let displayCharCount = 0;
    for(let t = 0; t < varList.length; t++) {
        
        
        if(finalAns[s][t] == false) {
            if(displayCharCount != 0) {
                answer += "&";
            }
            displayCharCount++;
            answer += "!" + varList[t];
        }
        else if(finalAns[s][t] == true) {
            if(displayCharCount != 0) {
                answer += "&";
            }
            displayCharCount++;
            answer += varList[t];
        }
    }
}
answer += ")";
//console.log(answer);
return answer;

    
}

function convertToPOS(partialParsed) {
    for(let i = 0; i < partialParsed.length; i++) {

        switch(partialParsed[i]) {
            case '&':
                partialParsed[i] = '|';
                break;
            case '|':
                partialParsed[i] = '&';
                break;
            case '!':
                partialParsed.splice(i, 1);
                break;
            default:
                if(partialParsed[i] != '(' && partialParsed[i] != ')') {
                    partialParsed.splice(i, 0, '!');
                    i++;
                }
                break;
        }
    }
    ansString = "";
    for(let symbol of partialParsed) {
        if(symbol == '|') {
            ansString += '+';
        } else {
            ansString += symbol;
        }
    }
    return ansString;
}

function groupNots(parsedExpr) {
    for(let i = 0; i < parsedExpr.length; i++) {
        symbol = parsedExpr[i];
        if(typeof symbol == 'object') {
            groupNots(symbol);
        } 
        else if(symbol == '!') {
            parsedExpr.splice(i, 2, "!" + parsedExpr[i+1]);
        }
    }
}

function contentEquals(l1, l2) {
    //Lists must be of equal length and not a multi dimensional array
    let equals = true;
    for(let a = 0; a < l1.length; a++) {
            if(l1[a] != l2[a]) {
                equals = false;
                break;
            }
        }
    return equals;
}

function getTruthTable(booleanFunction, varList, get1s) {
    rows = genGreyCode(varList.length);
    result = [];
    values = {true:true, false:false};
    for(let i = 0; i < rows.length; i++) {
        //Setup values
        for(let j = 0; j < varList.length; j++) {
            values[varList[j]] = rows[i][j];
        }
        answer = evaluateExpression(booleanFunction, values, get1s);
        if(!get1s) {
            answer = !answer;
        }
        rows[i].push(answer);
        result.push(rows[i]);
    }
    return result;
}

function getKMTable(booleanFunction, varList) {
    columns = genGreyCode(Math.floor(varList.length/2));
    rows = genGreyCode(varList.length - Math.floor(varList.length/2));
    result = [];
    for(let i = 0; i < columns.length; i++) {
        result.push([]);
        for(let j = 0; j < rows.length; j++) {
            let values = {true:true, false:false};
            for(let k = 0; k < varList.length; k++) {
                if(k < Math.floor(varList.length/2)) {
                    values[varList[k]] = columns[i][k];
                } else {
                    values[varList[k]] = rows[j][k-Math.floor(varList.length/2)];
                }
            }
            result[i].push(evaluateExpression(booleanFunction, values));
        }
    }
    return result;
}

function genGreyCode(len) {
    if(len <= 1) {
        const li = [[false], [true]];
        return li;
    } else {
        const previousCode = genGreyCode(len-1);
        const revList = reverse(previousCode);
        for(let i = 0; i < revList.length; i++) {
            revList[i].splice(0, 0, true);
            previousCode[i].splice(0, 0, false);
        }
        return previousCode.concat(revList);
    }
}

function reverse(list) {
    copyList = JSON.parse(JSON.stringify(list));
    for(let i = 0; i < Math.floor(list.length/2); i++) {
        temp = copyList[i];
        copyList[i] = copyList[copyList.length-i-1];
        copyList[copyList.length-i-1] = temp;
    }
    return copyList;
}

function partialParse(expr) {
    return expr.match(/[()!&|]|[\w\s]+/g);
}

function getVariables(partialParsedExpr) {
    let varList = [];
    for(let variable of partialParsedExpr) {
        if(variable != '(' && variable != ')' && variable != '!' && variable != '|' && variable != '&') {
            if(varList.indexOf(variable) == -1) {
                varList.push(variable);
            }
        }
    }
    return varList;
}

function parseExpression(expr, parsedExpr) {
    if(expr == null || expr == undefined) {
        return [];
    }
    for(let index = 0; index < expr.length; index++) {
        if(expr[index] == '(') {
            let group = findGroup(expr.slice(index, expr.length));
            parsedExpr.push(parseExpression(group, []));
            index += group.length+1;
        } else {
            parsedExpr.push(expr[index]);
        } 
    }
    return parsedExpr;
}

function evaluateExpression(expression, values) {
    expr = JSON.parse(JSON.stringify(expression));
    let index = 0;
    for(let symbol of expr) {
        switch(symbol) {
            case '!':
                if(typeof(expr[index+1]) == "object") {
                    
                     expr.splice(index, 2, !evaluateExpression(expr[index+1], values));
                }
                else {
                    expr.splice(index, 2, !values[expr[index+1]]);
                }
                break;
            case '&':
                var lhs = expr.slice(0, index);
                var rhs = expr.slice(index+1, expr.length);
                return evaluateExpression(lhs, values) && evaluateExpression(rhs, values);
            case '|':
                var lhs = expr.slice(0, index);
                var rhs = expr.slice(index+1, expr.length);
                return evaluateExpression(lhs, values) || evaluateExpression(rhs, values);
        }
        if(expr.length == 1) {
            if(typeof(expr[0]) == "object") {
                return evaluateExpression(expr[0], values);
            }
            return values[expr[0]];
        }
        index++;
    }
}

function findGroup(expr) {
    let bracketCount = 0;
    let index = 0;
    for(let symbol of expr) {
        switch(symbol) {
            case '(':
                bracketCount++;
                break;
            case ')':
                bracketCount--;
                break;
        }
        index++;
        if(bracketCount == 0) {
            return expr.slice(1, index-1);
        }
    }
    console.log("Error: brackets are not consistent!");
    return [];
}

function checkExpression(e) {
    e = e.replace(/\*/g, '&');
    e = e.replace(/\+/g, '|');
    return e;
}

function checkExpressionFormatting(e) {
    let bracketCount = 0;
    
    for(let char of e) {
        switch(char) {
            case '(':
                bracketCount++;
                break;
            case ')':
                bracketCount--;
                break;
        }
        if(bracketCount < 0) {
            return false;
        }
    }
    let illegalPos = e.search(/[(!&|][&|]|[&|!][)&|]/);
    if(illegalPos != -1 || bracketCount != 0) {
        return false;
    }
    return true;
}