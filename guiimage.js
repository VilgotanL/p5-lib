class GuiImage extends Instance {
    constructor(p5image) {
        super();

        this.borderColor = color(0);
        this.borderSize = 2;

        this.image = p5image;
    }

    drawThis() {
        push();
        image(this.image, this.x, this.y, this.w, this.h);
        noFill();
        stroke(this.borderColor);
        strokeWeight(this.borderSize);
        rect(this.x, this.y, this.w, this.h);
        pop();
    }
}