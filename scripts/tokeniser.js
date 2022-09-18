class Token {

    static precedenceOrder = {
        '|': 1,
        '&': 2,
        '!': 3,
        '(': 4,
        ')': 4
    };

    static tokenTypes = {
        // Since an element can be any other string, use default || option to class elements as 'e'
        '|': 'o',
        '&': 'o',
        '!': 'o',
        '(': 'b',
        ')': 'b'
    };

    constructor(type, value) {
        // Type can either be an element "e", an operator "o", or bracket "b"
        this.type = type;
        this.value = value;
        this.precedence = (Token.precedenceOrder[value] || 4);
    }

    getPrecedence() { return this.precedence; }
    getType() { return this.type; }
    getValue() { return this.value; }

    setType(newType) { this.type = newType; }
    setValue(newVal) { this.value = newVal; }
}

// TODO: Change name to 'tokenise'
function partialParse(expr) {
    let res = expr.match(/[()!&|]|[\w\s]+/g);
    for(var i = 0; i < res.length; i++) {
        res[i] = new Token(Token.tokenTypes[res[i]] || 'e', res[i]);
    }
    return res;
}