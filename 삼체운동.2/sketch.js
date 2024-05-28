let bodies = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  bodies.push(new Body(300, 300, 1, -1.5, 10, color(255, 0, 0)));
  bodies.push(new Body(500, 300, -1, 1.5, 10, color(0, 255, 0)));
  bodies.push(new Body(400, 500, 1.5, 1, 10, color(0, 0, 255)));
}

function draw() {
  for (let body of bodies) {
    body.update();
    body.checkEdges();
    body.show();
  }
}

class Body {
  constructor(x, y, vx, vy, mass, col) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.mass = mass;
    this.col = col; // 각 천체의 색상
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  update() {
    this.acc.set(0, 0);
    for (let other of bodies) {
      if (other !== this) {
        let force = this.attract(other);
        this.applyForce(force);
      }
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  attract(other) {
    let G = 0.9; // 중력 상수 조정
    let r = p5.Vector.dist(this.pos, other.pos);
    r = constrain(r, 5, 25); // 최소 및 최대 거리 제한
    let strength = (G * this.mass * other.mass) / (r * r);
    let force = p5.Vector.sub(other.pos, this.pos);
    force.setMag(strength);
    return force;
  }

  checkEdges() {
    // 벽에 부딪히면 반사하도록 설정
    if (this.pos.x > width || this.pos.x < 0) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      this.vel.y *= -1;
    }
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  show() {
    stroke(this.col);
    strokeWeight(this.mass);
    point(this.pos.x, this.pos.y);
  }
}
