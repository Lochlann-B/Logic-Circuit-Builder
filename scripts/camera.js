class Camera {

    constructor() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
    }

    projectX(x) {
        return x*this.zoom - this.x*this.zoom;
    }

    //Used for transforming camera-world coordinates (i.e. mouse pos) to model coordinates
    unprojectX(x) {
        return x/this.zoom + this.x;
    }

    projectY(y) {
        return y*this.zoom - this.y*this.zoom;
    }

    unprojectY(y) {
        return y/this.zoom + this.y;
    }

    setX(x) { this.x = x; }
    setY(y) { this.y = y; }
    getX() { return this.x; }
    getY() { return this.y; }

    getZoom() { return this.zoom; }
    setZoom(z) { this.zoom = z; }

}

function ctxbeginPath() { ctx.beginPath(); }
function ctxstroke() { ctx.stroke(); }
function ctxclosePath() { ctx.closePath(); }

function ctxmoveTo(x, y) { 
    ctx.moveTo(camera.projectX(x), camera.projectY(y)); 
}

function ctxlineTo(x, y) {
    ctx.lineTo(camera.projectX(x), camera.projectY(y));
}

function ctxbezierCurveTo(x0, y0, x1, y1, x2, y2) {
    ctx.bezierCurveTo(camera.projectX(x0), camera.projectY(y0), camera.projectX(x1), camera.projectY(y1), camera.projectX(x2), camera.projectY(y2));
}

function ctxarc(x, y, radius, startAngle, endAngle, anticlockwise=false) {
    ctx.arc(camera.projectX(x), camera.projectY(y), camera.getZoom()*radius, startAngle, endAngle, anticlockwise);
}

