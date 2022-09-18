class Stack {
    constructor() {
        this.stack = []
        this.top_pointer = -1;
    }

    push(element) {
        this.top_pointer++;
        this.stack.push(element);
    }

    isEmpty() {
        return this.top_pointer < 0;
    }

    pop() {
        if(this.top_pointer < 0) {
            throw "Stack empty";
        }
        this.top_pointer--;
        return this.stack.pop();
    }

    peek() {
        if(this.top_pointer < 0) {
            throw "Stack empty";
        }
        return this.stack[this.top_pointer];
    }
}