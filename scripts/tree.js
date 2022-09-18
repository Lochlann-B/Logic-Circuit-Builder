class Node {
    constructor(value) {
        this.value = value;
        this.parent = null;
        this.children = [];
        this.height = 0;
    }

    setHeight() {
        let maxHeight = 0;
        for(let child in this.children) {
            maxHeight = Math.max(maxHeight, this.children[child].getHeight());
        }
        this.height = maxHeight + 1;
    }

    setParent(node) {
        this.parent = node;
    }

    addChild(node) {
        this.children.push(node);
        node.setParent(this);
        this.setHeight();
    }

    removeChildByIndex(index) {
        this.children.splice(index, 1);
        this.setHeight();
    }

    removeChild(node) {
        let index = this.children.indexOf(node);
        this.children.splice(index, 1);
        this.setHeight();
    }

    getChildCount() { return this.children.length; }
    getValue() { return this.value; }
    getParent() { return this.parent; }
    getChildren() { return this.children; }
    getChild(index) { return this.children[index]; }
    getHeight() { return this.height; }
}