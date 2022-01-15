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
        this.outputPos = [50, 50];
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x+50, y+50);
        ctx.lineTo(x, y+100);
        ctx.closePath();
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctx.stroke();
        
    }

    evaluate() {
        if(this.inputs.length == 0) {
            return false;
        }
        return !this.inputs[0].evaluate();
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
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.moveTo(x, y+50);
        ctx.arc(x, y+50, 50, Math.PI/2, -Math.PI/2, true);
        ctx.closePath();
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctx.stroke();
        
    }

    evaluate() {
        for(let input of this.inputs) {
            if(!input.evaluate()) {
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
        ctx.beginPath();
        ctx.moveTo(x, y+80);
        ctx.bezierCurveTo(x+25, y+60, x+25, y+20, x, y);
        ctx.stroke();

        ctx.moveTo(x+10, y+80);
        ctx.bezierCurveTo(x+35, y+60, x+35, y+20, x+10, y);
        ctx.stroke();

        ctx.moveTo(x+10, y+80);
        ctx.bezierCurveTo(x+15, y+80, x+55, y+80, x+70, y+40);
        ctx.stroke();

        ctx.moveTo(x+10, y);
        ctx.bezierCurveTo(x+15, y, x+55, y, x+70, y+40);
        ctx.stroke();
        
    }

    evaluate() {
        if(this.inputs.length < 2) {
            return false;
        }
        let a = this.inputs[0].evaluate();
        let b = this.inputs[1].evaluate();
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
        ctx.beginPath();
        ctx.moveTo(x, y+80);
        ctx.bezierCurveTo(x+25, y+60, x+25, y+20, x, y);
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctx.stroke();

        ctx.moveTo(x, y+80);
        ctx.bezierCurveTo(x+5, y+80, x+45, y+80, x+60, y+40);
        ctx.stroke();

        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x+5, y, x+45, y, x+60, y+40);
        ctx.stroke();
    }

    evaluate() {
        for(let input of this.inputs) {
            if(input.evaluate()) {
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
        ctx.moveTo(x+70, y+40);
        ctx.arc(x+65, y+40, 5, 0, Math.PI*2);
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctx.stroke();
        
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
        ctx.moveTo(x+60, y+50);
        ctx.arc(x+55, y+50, 5, 0, Math.PI*2);
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#ff0000';
        ctx.stroke();
    }

    evaluate() {
        return !super.evaluate();
    }
}

class Input {
    constructor(x, y) {
        this.state = false;
        this.pos = [x, y];
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x-10, y, 10, 0, Math.PI*2);
        ctx.strokeStyle = this.state ? '#00f500' : '#f50000';
        ctx.stroke();
    }

    evaluate() {
        return this.state;
    }
}

class Output {
    constructor(x, y) {
        this.pos = [x,y];
        this.input;
    }

    getState() {
        return this.input.state;
    }

    draw() {
        let x = this.pos[0];
        let y = this.pos[1];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x-10, y, 10, 0, Math.PI*2);
        ctx.strokeStyle = this.state ? '#00f500' : '#f50000';
        ctx.stroke();
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
    }

    draw(connectList) {
        let startPos = this.startPos;
        let endPos = this.endPos;
        ctx.strokeStyle = this.legalPlacement ? '#f5f5f5' : '#f50000';
        ctx.beginPath();
        ctx.moveTo(startPos[0], startPos[1]);
        let midPos = startPos[0] + (endPos[0]-startPos[0])*(1 - this.position*0.1);
        midPos = midPos > startPos[0] ? midPos : startPos[0];
        ctx.lineTo(midPos, startPos[1]);
        ctx.lineTo(midPos, endPos[1]);
        ctx.lineTo(endPos[0], endPos[1]);
        ctx.stroke();
    }
}

function checkLegalPlacement(gate, gateList) {
    legalPlace = true;
    for(let gateI of gateList) {
        if(gate != gateI) {
            if((gate.pos[0] > gateI.pos[0]-80 && gate.pos[0] < gateI.pos[0] + 80 &&
                gate.pos[1] > gateI.pos[1]-100 && gate.pos[1] < gateI.pos[1] + 100)){
                    gate.legalPlacement = false;
                    return;
                }
        }
    }
    gate.legalPlacement = true;
}

function checkConnectionPlacement(connection, gateList, outputList) {
    var legal = false;
    for(let gate of gateList) {
        if(connection.endPos[0] >= gate.pos[0] - 10 && connection.endPos[0] <= gate.pos[0] + 10
            && connection.endPos[1] >= gate.pos[1] && connection.endPos[1] <= gate.pos[1]+2*gate.outputPos[1] &&
            gate.inputs.length != gate.capacity) {
                connection.legalPlacement = true;
                connection.endGate = gate;
                legal = true;
        }
    }
    for(let output of outputList) {
        if(connection.endPos[0] >= output.pos[0] - 10 && connection.endPos[0] <= output.pos[0] + 10 && connection.endPos[1] >= output.pos[1] - 10 && connection.endPos[1] <= output.pos[1] + 10) {
            if(output.input == undefined || output.input == null) {
                connection.legalPlacement = true;
                connection.endGate = output;
                legal = true;
            }
        }
    }
    if(!legal) {
        connection.legalPlacement = false;
    }
}

function evaluateOutputs(outputs) {
    for(let output of outputs) {
        if(output.input != null && output.input != undefined) {
            output.state = output.input.evaluate();
        }
    }
}

function setupGate(gate, gatelist) {
    if(selectedGate == null || selectedGate == undefined) {
        gate.pos[0] = x;
        gate.pos[1] = y;
        selectedGate = gate; 
        gatelist.push(gate);
    }
}

function adjustConnections() {
    for(let connection of connectionList) {
        if(connection.startGate instanceof Input) {
            connection.startPos[1] = connection.startGate.pos[1];
        }
        if(connection.endGate instanceof Output) {
            connection.endPos[1] = connection.endGate.pos[1];
        }
    }
}

function addInput() {
    var input = new Input(45, 0);
    inputList.push(input);
    let listEven = inputList.length % 2 == 0;
    var startPoint = 0;
    for(let i = 0; i < inputList.length; i++) {
        if(listEven) {
            startPoint = -50*(inputList.length-1);
        } else {
            startPoint = -100*((inputList.length - 1)/2);
        }
        inputList[i].pos[1] = (height/2) + startPoint + i*100;
    }
    adjustConnections();
}

function addOutput() {
    var output = new Output(width*0.95, (1+outputList.length)*30);
    outputList.push(output);
    let listEven = outputList.length % 2 == 0;
    var startPoint = 0;
    for(let i = 0; i < outputList.length; i++) {
        if(listEven) {
            startPoint = -50*(outputList.length-1);
        } else {
            startPoint = -100*((outputList.length - 1)/2);
        }
        outputList[i].pos[1] = (height/2) + startPoint + i*100;
    }
    adjustConnections();
}

function clear() {
    inputList = [];
    outputList = [];
    connectionList = [];
    gateList = [];
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

function addGate(gate) {
    gateList.push(gate);
}

function getGateList() {
    return gateList;
}

function addConnection(startGate, endGate) {
    let connection = new Connection();
    connection.startGate = startGate;
    connection.endGate = endGate;
    connection.legalPlacement = true;
    if(startGate instanceof Input) {
        connection.startPos = startGate.pos;
    } else {
        connection.startPos = [startGate.pos[0] + startGate.outputPos[0], startGate.pos[1] + startGate.outputPos[1]];
    }
    if(endGate instanceof Output) {
        endGate.input = startGate;
    } else {
        endGate.inputs.push(startGate);
    }
    if(endGate instanceof Output) {
        connection.endPos = endGate.pos;
    } else {
        connection.endPos = [endGate.pos[0], endGate.pos[1] + 10*endGate.inputs.length];
    }
    connection.position = connectionList.length+1;
    connectionList.push(connection);
}

function getInput(index) {
    return inputList[index];
}

function getOutput(index) {
    return outputList[index];
}

/* TODO:
ALSO: MAKE IT SO *, + AND ' NOTATION IS LEGAL (JUST GO THROUGH STRING AND REPLACE THE CHARACTERS, AND MOVE THE ! TO THE OTHER SIDE OF THE CHAR SET)
*/

const canvas = document.getElementById("drawingCanvas");
var width = canvas.width = window.innerWidth*0.9;
var height = canvas.height = window.innerHeight*0.85;
const ctx = canvas.getContext('2d');
var selectedGate;
var selectedConnection;

canvas.addEventListener('click', () => {
    if(selectedGate != null && selectedGate != undefined && selectedGate.legalPlacement) {
        selectedGate = null;
    }
    if(selectedConnection != null && selectedConnection != undefined ) {
        if(selectedConnection.legalPlacement) {
            selectedConnection.endPos[0] = selectedConnection.endGate.pos[0];
            if(selectedConnection.endGate instanceof Output) {
                selectedConnection.endGate.input = selectedConnection.startGate;
            } else {
                selectedConnection.endGate.inputs.push(selectedConnection.startGate);
            }
            selectedConnection = null;
        }
        else {
            connectionList.splice(connectionList.indexOf(selectedConnection), 1);
            selectedConnection = null;
        }
    }
    for(let input of inputList) {
        if(x > input.pos[0] - 10 && x < input.pos[0] + 10 && y < input.pos[1] + 10 && y > input.pos[1]  - 10) {
            input.state = !input.state;
        }
    }
});

window.onresize = function() {
    height = canvas.height = window.innerHeight*0.85; 
    width = canvas.width = window.innerWidth*0.9;
}

var x;
var y;
document.querySelector('html').onmousemove = function(event) {
    x = Math.floor(event.clientX - width*0.1);
    y = event.clientY;
}
document.getElementById('bin').onclick = function() {
    if(selectedGate != null && selectedGate != undefined) {
        gateList.splice(gateList.indexOf(selectedGate), 1);
        selectedGate = null;
    }
}
document.getElementById('evaluate').onclick = function() {
    evaluateOutputs(outputList);
}

var keydownC = false;
var keydownD = false;
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    
    if(!keydownC && (keyName == 'c' || keyName == 'C') && (selectedConnection == null || selectedConnection == undefined)) {
        keydownC = true;
        for(let input of inputList) {
            if(x > input.pos[0] - 10 && x < input.pos[0] + 10 && y < input.pos[1] + 10 && y > input.pos[1]  - 10) {
                var connection = new Connection(connectionList.length+1);
                connection.startPos = [input.pos[0], input.pos[1]];
                connection.endPos = [x, y];
                selectedConnection = connection;
                connectionList.push(connection);
                connection.startGate = input;
            }
        }
        for(let gate of gateList) {
            if(x > gate.pos[0] + gate.outputPos[0] - 20 && x < gate.pos[0] + gate.outputPos[0] + 20 && y > gate.pos[1] + gate.outputPos[1] - 20 && y < gate.pos[1] + gate.outputPos[1] + 20) {
                let xCoord = gate.pos[0] + gate.outputPos[0];
                let yCoord = gate.pos[1] + gate.outputPos[1];
                var connection = new Connection(connectionList.length + 1);
                connection.startPos = [xCoord, yCoord];
                connection.endPos = [x, y];
                selectedConnection = connection;
                connectionList.push(connection);
                connection.startGate = gate;
            }
        }
    }

    if(!keydownD && (keyName == 'd' || keyName == 'D')) {
        keyDownD = true;
        for(let j = 0; j < gateList.length; j++) {
            let gate = gateList[j];
            if(x > gate.pos[0] && x < gate.pos[0] + gate.outputPos[0] && y > gate.pos[1] && y < gate.pos[1] + 2*gate.outputPos[1]) {
                for(let i = 0; i < connectionList.length; i++) {
                    let startgate = connectionList[i].startGate;
                    let endgate = connectionList[i].endGate;
                    if(startgate.pos[0] == gate.pos[0] && startgate.pos[1] == gate.pos[1] || endgate.pos[0] == gate.pos[0] && endgate.pos[1] == gate.pos[1]) {
                        if(endgate instanceof Output) {
                            endgate.input = null;
                        } else {
                            let inputs = endgate.inputs;
                            for(let k = 0; k < inputs.length; k++) {
                                if(inputs[k].pos[0] == startgate.pos[0] && inputs[k].pos[1] == startgate.pos[1]) {
                                    inputs.splice(k, 1);
                                    k--;
                                }
                            }
                        }
                        connectionList.splice(i, 1);
                        i--;
                    }
                }
                gateList.splice(j, 1);
            }
            
        }
    }
    
});
document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    if(keyName == 'c' || keyName == 'C') {
        keydownC = false;
    }
    if(keyName == 'd' || keyName == 'D') {
        keydownD = false;
    }
});

//Start of main code

var gateList = [];
var connectionList = [];
var inputList = [];
var outputList = [];

document.getElementById('not').onclick = function() {gate = new NOTGate(); setupGate(gate, gateList);}
document.getElementById('and').onclick = function() {gate = new ANDGate(); setupGate(gate, gateList);}
document.getElementById('or').onclick = function() {gate = new ORGate(); setupGate(gate, gateList);}
document.getElementById('nand').onclick = function() {gate = new NANDGate(); setupGate(gate, gateList);}
document.getElementById('nor').onclick = function() {gate = new NORGate(); setupGate(gate, gateList);}
document.getElementById('xor').onclick = function() {gate = new XORGate(); setupGate(gate, gateList);}

document.getElementById('addInput').onclick = function() {
    addInput();
}
document.getElementById('addOutput').onclick = function() {
    addOutput();
}

function loop() {
    ctx.fillStyle = 'rgb(0,0,0)';
    
    if(selectedGate != undefined && selectedGate != null) {
        selectedGate.pos[0] = x;
        selectedGate.pos[1] = y;
        checkLegalPlacement(selectedGate, gateList);
    }
    if(selectedConnection != undefined && selectedConnection != null) {
        selectedConnection.endPos[0] = x;
        selectedConnection.endPos[1] = y;
        checkConnectionPlacement(selectedConnection, gateList, outputList);
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let input of inputList) {
        input.draw();
    }
    for(let gate of gateList) {
        gate.draw();
    }
    for(let connection of connectionList) {
        connection.draw(connectionList);
    }
    for(let output of outputList) {
        output.draw();
    }
    requestAnimationFrame(loop);
}
loop();