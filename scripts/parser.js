function genRPN(tokenised) {
    // Implementation of the shunting-yard algorithm with added implementation for unary operator '!'
    let operatorStack = new Stack();
    let output = [];
    while(tokenised.length > 0) {
        token = tokenised.shift();

        switch(token.getType()) {
            case "e":
                output.push(token);
                // Account for unary operator(s) '!' preceding the previous 'element' in the output queue
                while(!operatorStack.isEmpty() && operatorStack.peek().getValue() == '!') {
                    output.push(operatorStack.pop())
                }
                break;
            case "o":
                // Check to see if the previous operator has more precedence than the current one,
                // and place it into the output first if so
                while(!operatorStack.isEmpty() && operatorStack.peek().getValue() != '('
                && (operatorStack.peek().getPrecedence() >= token.getPrecedence())) 
                {
                    output.push(operatorStack.pop());
                }
                operatorStack.push(token);
                break;
            case "b":
                if(token.getValue() == '(') { operatorStack.push(token); }
                else {
                    while(operatorStack.peek().getValue() != '(') {
                        // Assert: the operator stack is not empty
                        output.push(operatorStack.pop());
                        }
                    // Assert: there is a left bracket at the top of the stack
                    operatorStack.pop(); // Discard the left bracket

                    if(!operatorStack.isEmpty() && operatorStack.peek().getValue() == '!') {
                        output.push(operatorStack.pop())
                    }
                }
                break;
        }
    }
    while(!operatorStack.isEmpty()) {
        output.push(operatorStack.pop());
    }

    return output;
}

function genParseTree(postfixExpr) {
    let nodeStack = new Stack();
    for(let i = 0; i < postfixExpr.length; i++) {
        let token = postfixExpr[i];
        let current = new Node(token);
        if(token.getType() == 'e') {
            nodeStack.push(current);
        }
        else {
            // Assert: nodeStack is not empty
            if(token.getValue() == '!') {
                let child = nodeStack.pop();
                current.addChild(child);
                nodeStack.push(current);
            } else {
                // All other operators (|, &) are binary
                let child1 = nodeStack.pop();
                let child2 = nodeStack.pop();
                current.addChild(child1);
                current.addChild(child2);
                nodeStack.push(current);
            }
        }
    }
    // Assert: nodeStack has only 1 item remaining
    return nodeStack.pop();
}