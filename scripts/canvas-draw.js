function pathFind(startPos, endPos, path) {
    let midPos = (startPos[1] == endPos[1] || Math.abs(startPos[0] - endPos[0]) <= 70) ? endPos[0] : (startPos[0] + endPos[0])/2;

    // Phase 1: change direction until no more
    let newMidPoint = [midPos, startPos[1]];
    collisionInfo = checkLineCollision(startPos, [midPos, startPos[1]]);
    let mostRecentCollisionType = 'H';
    while(collisionInfo != undefined) {

        
        for(let gate of gateList) {
            
            //Check to see whether endPos is inside a gate
            if(endPos[0] > gate.pos[0] && endPos[0] < gate.pos[0] + gate.outputPos[0]
                && endPos[1] > gate.pos[1] && endPos[1] < gate.pos[1] + 2*gate.outputPos[1]) {
                    endPos = [collisionInfo[0], collisionInfo[1]];
                }
        }
        

        let turningPoint = [collisionInfo[0], collisionInfo[1]];
        if(collisionInfo[3] == 'V') {
            mostRecentCollisionType = 'V';
            let newX = 0;
            if(startPos[0] > endPos[0]) {
                newX = collisionInfo[2].pos[0] - 5;
            } else {newX = collisionInfo[2].pos[0] + collisionInfo[2].outputPos[0];}
            
            let turningPoint2 = [newX, collisionInfo[1]];
            path.push(turningPoint, turningPoint2);

            newMidPoint = [newX, endPos[1]];
            collisionInfo = checkLineCollision(turningPoint2, newMidPoint);
        }
        else {
            mostRecentCollisionType = 'H';
            let newY = collisionInfo[2].pos[1];
            newY += (endPos[1] >= collisionInfo[2].pos[1]+collisionInfo[2].outputPos[1]) ? 2*collisionInfo[2].outputPos[1] + 5 : - 5;
            let adjustedX = collisionInfo[0] > collisionInfo[2].pos[0] ? collisionInfo[0] + 1 : collisionInfo[0] - 5
            let turningPoint2 = [adjustedX, newY];
            path.push([adjustedX, turningPoint[1]], turningPoint2);

            newMidPoint = [(adjustedX + endPos[0])/2, newY];
            collisionInfo = checkLineCollision(turningPoint2, newMidPoint);
        }
    }
    // Phase 2: Try and reach destination
    path.push(newMidPoint);
    if(mostRecentCollisionType == 'H') {
        let nextPos = [newMidPoint[0], endPos[1]];
        collisionInfo = checkLineCollision(newMidPoint, nextPos);
        while(collisionInfo != undefined) {
            for(let gate of gateList) {
            
                //Check to see whether endPos is inside a gate
                if(endPos[0] > gate.pos[0] && endPos[0] < gate.pos[0] + gate.outputPos[0]
                    && endPos[1] > gate.pos[1] && endPos[1] < gate.pos[1] + 2*gate.outputPos[1]) {
                        endPos = [collisionInfo[0], collisionInfo[1]];
                    }
            }
            
            let turningPoint = [collisionInfo[0], collisionInfo[1]];
            let newX = 0;
            if(startPos[0] > endPos[0]) {
                newX = collisionInfo[2].pos[0] - 5;
            } else {newX = collisionInfo[2].pos[0] + collisionInfo[2].outputPos[0];}
            let turningPoint2 = [newX, collisionInfo[1]];
            path.push(turningPoint, turningPoint2);

            nextPos = [newX, endPos[1]];
            collisionInfo = checkLineCollision(turningPoint2, nextPos);
        }
        path.push(nextPos);
    }
    // Assert: the path's y-coordinate is now equal to the destination's
    if(path[path.length - 1][0] != endPos[0]) {
        return pathFind(path[path.length - 1], endPos, path);
    } else {
        return path;
    }
}

function checkLineCollision(startPos, endPos) {
    // TODO: check for intersection between a straight line segment and any gate - return earliest such point of collision (on the gate), and the gate itself
    // Assert: A collision is only found along a horizontal line
    
    let start = Math.min(startPos[0], endPos[0]);
    let end = Math.max(startPos[0], endPos[0]);
    for(let gate of gateList) {
        // More work is needed for vertical line intersections since they can come from above or below
        if(
            start > gate.pos[0] && start < gate.pos[0] + gate.outputPos[0] &&
            ((startPos[1] > gate.pos[1] + 2*gate.outputPos[1] && endPos[1] < gate.pos[1] + 2*gate.outputPos[1]) ||
              (startPos[1] <= gate.pos[1] && endPos[1] > gate.pos[1]))) {
                let intersectYPoint = startPos[1] > gate.pos[1] ? (gate.pos[1] + 2*gate.outputPos[1]) : (gate.pos[1]) ;
                return [startPos[0], intersectYPoint, gate, 'V'];
              }
        // Horizontal line detection
        if(
            startPos[1] > gate.pos[1] && startPos[1] < gate.pos[1] + 2*gate.outputPos[1] &&
            ((start < gate.pos[0] && end > gate.pos[0]) || (start > gate.pos[0] && start < gate.pos[0] + gate.outputPos[0])
            || (end > gate.pos[0] && end < gate.pos[0] + gate.outputPos[0]) || (start < gate.pos[0] + gate.outputPos[0] && end >= gate.pos[0] + gate.outputPos[0]))) {
                return [startPos[0] > gate.pos[0] ? gate.pos[0] + gate.outputPos[0] : gate.pos[0], startPos[1], gate, 'H'];
            }
        

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
       connection.startPos[1] = connection.startGate.pos[1] + connection.startGate.outputPos[1];
       connection.endPos[1] = connection.endGate.pos[1];
       tidyUpGates();
       connection.setPath();
    }
}

function tidyUpGates() {
    for(let gate of gateList) {
        let startY = gate.pos[1] + 5;
        let endY = gate.pos[1] + 2*gate.outputPos[1] - 5;
        let increment = (endY - startY)/(gate.inputs.length);

        for(let i = 0; i < gate.inputs.length; i++) {
            var startPoint = (gate.inputs.length % 2 == 0) ? -(increment/2)*(gate.inputs.length - 1) : -increment*((gate.inputs.length-1)/2);
            gate.inputs[i].endPos[1] = gate.pos[1] + gate.outputPos[1] - startPoint - (i)*increment;
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
        endGate.input = connection;
    } else {
        endGate.inputs.push(connection);
    }
    if(endGate instanceof Output) {
        connection.setEndPos(endGate.pos);
    } else {
        connection.setEndPos([endGate.pos[0], endGate.pos[1] + 10*endGate.inputs.length]);
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
ALSO: ' NOTATION IS LEGAL (MOVE THE ! TO THE OTHER SIDE OF THE CHAR SET)
*/

// Setup canvas and user interaction events

const canvas = document.getElementById("drawingCanvas");
var width = canvas.width = document.getElementById("canvas-draw").offsetWidth;
var height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
var selectedGate;
var selectedConnection;

var mouseClicked = false;
var startMousePos = [0, 0];
var startCameraPos = [0, 0];

canvas.addEventListener('wheel', e => {
    // Zoom in or out about the mouse's current position

    let oldunProjX = unprojX;
    let oldunProjY = unprojY;
    
    let zoom = Math.max(0.05, camera.getZoom() - e.deltaY/500)
    camera.setZoom(zoom);
    
    // First, find the difference in world coordinates of the world-mouse coordinates
    unprojX = camera.unprojectX(x);
    unprojY = camera.unprojectY(y);
    camera.setX(camera.getX() + (oldunProjX - unprojX));
    camera.setY(camera.getY() + (oldunProjY - unprojY));
    // Then, reset the unprojected mouse coordinates now that the camera has been shifted
    unprojX = camera.unprojectX(x);
    unprojY = camera.unprojectY(y);
    
})

canvas.addEventListener('mousedown', () => {
    if(!mouseClicked) {
        startMousePos = [x, y];
        startCameraPos = [camera.getX(), camera.getY()];
    }
    mouseClicked = true;
});

canvas.addEventListener('mouseup', () => {
    mouseClicked = false;
});

canvas.addEventListener('mousemove', () => {
    if(mouseClicked) {
        camera.setX(startCameraPos[0] + startMousePos[0] - x);
        camera.setY(startCameraPos[1] + startMousePos[1] - y);
    }
});

canvas.addEventListener('click', () => {

    // Place a new gate
    if(selectedGate != null && selectedGate != undefined && selectedGate.legalPlacement) {
        selectedGate = null;
        for(let connection of connectionList) {
            connection.setPath();
        }
    }

    // Set selected connection
    if(selectedConnection != null && selectedConnection != undefined ) {
        if(selectedConnection.legalPlacement) {
            selectedConnection.endPos[0] = selectedConnection.endGate.pos[0];
            selectedConnection.setPath();
            if(selectedConnection.endGate instanceof Output) {
                selectedConnection.endGate.input = selectedConnection;
            } else {
                selectedConnection.endGate.inputs.push(selectedConnection);
            }
            selectedConnection = null;
        }
        else {
            connectionList.splice(connectionList.indexOf(selectedConnection), 1);
            selectedConnection = null;
        }
    }

    // Toggle clicked inputs
    for(let input of inputList) {
        if(unprojX > input.pos[0] - 10 && unprojX < input.pos[0] + 10 && unprojY < input.pos[1] + 10 && unprojY > input.pos[1]  - 10) {
            input.state = !input.state;
        }
    }

});

window.onresize = function() {
    height = canvas.height = window.innerHeight; 
    width = canvas.width = window.innerWidth*(10/12);
}

var x;
var y;
var unprojX;
var unprojY;


document.querySelector('html').onmousemove = function(event) {
    x = Math.floor(event.clientX - canvas.getBoundingClientRect().left);
    y = event.clientY;
    
    unprojX = camera.unprojectX(x);
    unprojY = camera.unprojectY(y);
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
            if(x > camera.projectX(input.pos[0] - 10) && x < camera.projectX(input.pos[0] + 10) 
                && y < camera.projectY(input.pos[1] + 10) && y > camera.projectY(input.pos[1]  - 10)) {
                var connection = new Connection(connectionList.length+1);
                connection.startPos = [input.pos[0], input.pos[1]];
                connection.setEndPos([x, y]);
                selectedConnection = connection;
                connectionList.push(connection);
                connection.startGate = input;
            }
        }
        for(let gate of gateList) {
            if(x > camera.projectX(gate.pos[0] + gate.outputPos[0] - 20) && x < camera.projectX(gate.pos[0] + gate.outputPos[0] + 20)
                && y > camera.projectY(gate.pos[1] + gate.outputPos[1] - 20) && y < camera.projectY(gate.pos[1] + gate.outputPos[1] + 20)) {
                let xCoord = gate.pos[0] + gate.outputPos[0];
                let yCoord = gate.pos[1] + gate.outputPos[1];
                var connection = new Connection(connectionList.length + 1);
                connection.startPos = [xCoord, yCoord];
                connection.setEndPos([x, y]);
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
            if(x > camera.projectX(gate.pos[0]) && x < camera.projectX(gate.pos[0] + gate.outputPos[0]) 
                && y > camera.projectY(gate.pos[1]) && y < camera.projectY(gate.pos[1] + 2*gate.outputPos[1])) {

                for(let i = 0; i < connectionList.length; i++) {
                    let connection = connectionList[i];
                    if(connection.startGate == gate || connection.endGate == gate) {
                        let outGate = connection.endGate
                        if(outGate instanceof Output) { outGate.input = undefined }
                        else { outGate.inputs.splice(outGate.inputs.indexOf(gate), 1); }
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
    ctx.fillStyle = 'rgb(26,26,26)';
    
    if(selectedGate != undefined && selectedGate != null) {
        selectedGate.pos[0] = unprojX;
        selectedGate.pos[1] = unprojY;
        checkLegalPlacement(selectedGate, gateList);
    }
    if(selectedConnection != undefined && selectedConnection != null) {
        selectedConnection.endPos[0] = unprojX;
        selectedConnection.endPos[1] = unprojY;
        selectedConnection.setPath();
        checkConnectionPlacement(selectedConnection, gateList, outputList);
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let input of inputList) { input.draw(); }
    for(let gate of gateList) { gate.draw(); }
    for(let connection of connectionList) { connection.draw(connectionList); }
    for(let output of outputList) { output.draw(); }
    requestAnimationFrame(loop);
}
loop();