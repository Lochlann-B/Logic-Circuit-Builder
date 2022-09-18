class Gate {
    constructor() {
        this.inputs = [];
        this.state = false;
        this.capacity = -1;
        this.isFull = false;
        this.pos = [0, 0];
        this.outputPos = [0, 0];
        this.legalPlacement = true;
    }

    draw() {};

    setOutputPos() {};

    addInput(input) {
        this.inputs.push(input);
    }

    evaluate() {return state};
}

class NOTGate extends Gate {
    constructor() {
        super();
        this.capacity = 1;
        this.outputPos = [60, 50];
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        ctxbeginPath();
        ctxmoveTo(x, y);
        ctxlineTo(x+50, y+50);
        ctxlineTo(x, y+100);
        ctxclosePath();
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctxstroke();
        ctxbeginPath();
        ctxmoveTo(x+60, y+50);
        ctxarc(x+55, y+50, 5, 0, Math.PI*2);
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctxstroke();
    }

    evaluate() {
        if(this.inputs.length == 0) {
            return false;
        }
        return !this.inputs[0].startGate.evaluate();
    }
}

class ANDGate extends Gate {
    constructor() {
        super();
        this.outputPos = [50, 50];
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        ctxbeginPath();
        ctxmoveTo(x, y);
        ctxmoveTo(x, y+50);
        ctxarc(x, y+50, 50, Math.PI/2, -Math.PI/2, true);
        ctxclosePath();
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctxstroke();
        
    }

    evaluate() {
        for(let input of this.inputs) {
            if(!input.startGate.evaluate()) {
                return false;
            }
        }
        return true;
    }
}

class XORGate extends Gate {
    constructor() {
        super();
        this.capacity = 2;
        this.outputPos = [70, 40];
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctxbeginPath();
        ctxmoveTo(x, y+80);
        ctxbezierCurveTo(x+25, y+60, x+25, y+20, x, y);
        ctxstroke();

        ctxmoveTo(x+10, y+80);
        ctxbezierCurveTo(x+35, y+60, x+35, y+20, x+10, y);
        ctxstroke();

        ctxmoveTo(x+10, y+80);
        ctxbezierCurveTo(x+15, y+80, x+55, y+80, x+70, y+40);
        ctxstroke();

        ctxmoveTo(x+10, y);
        ctxbezierCurveTo(x+15, y, x+55, y, x+70, y+40);
        ctxstroke();
        
    }

    evaluate() {
        if(this.inputs.length < 2) {
            return false;
        }
        let a = this.inputs[0].startGate.evaluate();
        let b = this.inputs[1].startGate.evaluate();
        return ((!a)&&(b))||((a)&&(!b));
    }
}

class ORGate extends Gate {
    constructor() {
        super();
        this.outputPos = [60, 40];
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        ctxbeginPath();
        ctxmoveTo(x, y+80);
        ctxbezierCurveTo(x+25, y+60, x+25, y+20, x, y);
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctxstroke();

        ctxmoveTo(x, y+80);
        ctxbezierCurveTo(x+5, y+80, x+45, y+80, x+60, y+40);
        ctxstroke();

        ctxmoveTo(x, y);
        ctxbezierCurveTo(x+5, y, x+45, y, x+60, y+40);
        ctxstroke();
    }

    evaluate() {
        for(let input of this.inputs) {
            if(input.startGate.evaluate()) {
                return true;
            }
        }
        return false;
    }
}

class NORGate extends ORGate {
    constructor() {
        super();
        this.outputPos = [70, 40];
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        super.draw(x, y);
        ctxmoveTo(x+70, y+40);
        ctxarc(x+65, y+40, 5, 0, Math.PI*2);
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctxstroke();
        
    }

    evaluate() {
        return !super.evaluate();
    }
}

class NANDGate extends ANDGate {
    constructor() {
        super();
        this.outputPos = [60, 50];
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        super.draw(x, y);
        ctxmoveTo(x+60, y+50);
        ctxarc(x+55, y+50, 5, 0, Math.PI*2);
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctxstroke();
    }

    evaluate() {
        return !super.evaluate();
    }
}

class Input {
    constructor(x, y) {
        this.state = false;
        this.pos = [x, y];
        this.outputPos = [0,0];
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        ctxbeginPath();
        ctxmoveTo(x, y);
        ctxarc(x-10, y, 10, 0, Math.PI*2);
        ctx.strokeStyle = this.state ? '#00f500' : '#f50000';
        ctxstroke();
    }

    evaluate() {
        return this.state;
    }
}

class Output {
    constructor(x, y) {
        this.pos = [x,y];
        this.outputPos = [0,0];
        this.input;
    }

    getState() {
        return this.input.startGate.state;
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        ctxbeginPath();
        ctxarc(x+10, y, 10, Math.PI*2, 0);
        ctx.strokeStyle = this.state ? '#00f500' : '#f50000';
        ctxstroke();
    }
}

class Connection {
    constructor(position) {
        this.startPos = [0, 0];
        this.endPos = [0, 0];
        this.startGate;
        this.endGate;
        this.legalPlacement = false;
        this.position = position;
        this.path = []
        this.colour = 'rgb(255, 255, 255)';
        this.randomiseColour();
    }

    randomiseColour() {
        let r = Math.random() * 200;
        let g = 27 + Math.random() * 223;
        let b = 765 - r - g;
        this.colour = 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    setEndPos(x, y) {
        this.endPos = [x, y];
        this.setPath();
    }

    setEndPos(coords) {
        this.endPos = coords;
        this.setPath();
    }

    draw(connectList) {
        let startPos = this.startPos;
        let endPos = this.endPos;
        ctx.strokeStyle = this.legalPlacement ? this.colour : '#f50000';
        ctxbeginPath();
        ctxmoveTo(startPos[0], startPos[1]);
        for(let point of this.path) {
            ctxlineTo(point[0], point[1]);
        }
        ctxstroke();
    }

    setPath() {
        this.path = pathFind(this.startPos, this.endPos, []);
    }

    setDefaultPath() {
        let avg = (this.startPos[0] + this.endPos[0])/2
        this.path = [[avg, this.startPos[1]], [avg, this.endPos[1]], this.endPos];
    }
}

function evaluateOutputs(outputs) {
    for(let output of outputs) {
        if(output.input != null && output.input != undefined) {
            output.state = output.input.startGate.evaluate();
        }
    }
}

function getNOTGate() {
    return new NOTGate();
}
function getANDGate() {
    return new ANDGate();
}
function getORGate() {
    return new ORGate();
}
function getNORGate() {
    return new NORGate();
}
function getNANDGate() {
    return new NANDGate();
}
function getXORGate() {
    return new XORGate();
}