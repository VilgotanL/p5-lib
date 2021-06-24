// Instance is the base for all objects
// draw() is for drawing an object and all of it's children
// drawThis() is for rendering only this object, drawThis() is called from draw
// Same thing goes for update() and updateThis()

//offset is in pixels, scale is 0 to 1, actual value is calculated by parent_x + xscale*width + xoff
//By width i mean the parent width, and the parent height for y/height
//If there is no parent, it uses the canvas width and height
//This is basically the same as in roblox's gui system

class Instance {
	constructor() {
		this._xscale = 0;
		this._xoff = 0;
		this._yscale = 0;
		this._yoff = 0;
		this._wscale = 0;
		this._woff = 0;
		this._hscale = 0;
		this._hoff = 0;
		this._x = 0;
		this._y = 0;
		this._w = 0;
		this._h = 0;

		this.className = this.constructor.name; //"Instance" for a pure Instance
		this.children = []; //SHOULD NOT BE SET outside this library, _internalParent must be set to null for each child removed
		this._internalParent = null; //internal parent instance
		this.name = this.className; //can be changed
	}
	toString() {
		return `"${this.name}" (${this.className})`;
	}
	
	get xscale() { return this._xscale; } //recalculating bounds when setting is efficient than recalculating it each time accessed
	set xscale(val) { this._xscale = val; this.recalculateBounds(); }
	get xoff() { return this._xoff; }
	set xoff(val) { this._xoff = val; this.recalculateBounds(); }
	
	get yscale() { return this._yscale; }
	set yscale(val) { this._yscale = val; this.recalculateBounds(); }
	get yoff() { return this._yoff; }
	set yoff(val) { this._yoff = val; this.recalculateBounds(); }
	
	get wscale() { return this._wscale; }
	set wscale(val) { this._wscale = val; this.recalculateBounds(); }
	get woff() { return this._woff; }
	set woff(val) { this._woff = val; this.recalculateBounds(); }
	
	get hscale() { return this._hscale; }
	set hscale(val) { this._hscale = val; this.recalculateBounds(); }
	get hoff() { return this._hoff; }
	set hoff(val) { this._hoff = val; this.recalculateBounds(); }

	recalculateBounds() {
		const parent = this._internalParent;
		const parentBounds = parent ? {x: parent.x, y: parent.y, w: parent.w, h: parent.h} : {x: 0, y: 0, w: width, h: height};
		this._x = parentBounds.x + this.xscale*parentBounds.w + this.xoff;
		this._y = parentBounds.y + this.yscale*parentBounds.h + this.yoff;
		this._w = this.wscale*parentBounds.w + this.woff;
		this._h = this.hscale*parentBounds.h + this.hoff;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	get w() {
		return this._w;
	}
	get h() {
		return this._h;
	}

	get parent() { //we need a getter and setter for parent since children and parent wont sync otherwise
		return this._internalParent;
	}
	set parent(instance) {
		if(!(instance instanceof Instance)) throw new Error("Cannot set parent of "+this+" to non-instance");
		instance.add(this); //make the parent add this
	}
	add(instance) {
		if(!(instance instanceof Instance)) throw new Error("Cannot add non-instance to "+this);
		if(instance._internalParent) { //if it already has a parent, make that parent remove it as its child
			instance._internalParent.remove(instance);
		}
		instance._internalParent = this;
		this.children.push(instance);
	}
	remove(instance) { //returns true if found, otherwise false, removes a child
		let index = this.children.indexOf((child) => child === instance);
		if(index === -1) return false; //didnt find it
		this.children.splice(index, 1); //remove it from children
		instance._internalParent = null; //set parent of it to null
	}
	findFirstChild(name) { //find child by name
		return this.children.find((child) => child.name === name);
	}

	setPosition(xscale, xoff, yscale, yoff) { //more efficient than setting individual properties, since recalculateBounds is only called once here
		this._xoff = xoff;
		this._xscale = xscale;
		this._yoff = yoff;
		this._yscale = yscale;
		this.recalculateBounds();
	}
	setSize(wscale, woff, hscale, hoff) { //more efficient than setting individual properties, since recalculateBounds is only called once here
		this._wscale = wscale;
		this._woff = woff;
		this._hscale = hscale;
		this._hoff = hoff;
		this.recalculateBounds();
	}

	updateThis() { //to be overridden
		
	}
	update() {
		//Update this first
		this.updateThis();

		//Then update children
		for(let i=0; i<this.children.length; i++) {
			this.children[i].update();
		}
	}
	drawThis() { //to be overridden
		
	}
	draw() { //to be overridden
		//Draw this first
		this.drawThis();

		//Then draw children ontop
		for(let i=0; i<this.children.length; i++) {
			this.children[i].draw();
		}
	}

	// Intersection functions and others
	intersects(other) {
		return other.x < this.x+this.w && other.y < me.y+this.h && 
			other.x+other.w > this.x && other.y+other.h > this.y;
	}
	intersectsPoint(x, y) {
		return x > this.x && y > this.y && x < this.x+this.w && y < this.y+this.h;
	}
}