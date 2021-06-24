class GuiFrame extends Instance {
    constructor() {
        super();

        this.bgColor = color(200);
        this.borderColor = color(0);
        this.borderSize = 2;
    }

    updateThis() {
        
    }

    drawThis() {
        push();
        fill(this.bgColor);
        stroke(this.borderColor);
        strokeWeight(this.borderSize);
        rect(this.x, this.y, this.w, this.h);
        pop();
    }
}