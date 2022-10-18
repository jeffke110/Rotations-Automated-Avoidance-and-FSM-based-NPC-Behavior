/**Project: Project 3 - Rotations, Automated Avoidance, and FSM-based NPC Behavior
 * Name: Jeffrey Kedda
 * Description: this is a simple tile map game of size 800x800 displayed on
 * a 400x400 canvas with 1 main character,
 * 20 prizes to collect, 50 rocks, and 6 enemies (with FSM mechanics). Each size of each object is 20 pixels
 * The main character (tank) must collect all 20 prizes (chests) to complete the game without getting touched
 * by the enemies (ninjas). The rocks provide a bouncing mechanism where each the enemy and main character
 * must move around the rocks. The main character can also use missiles shoot the enemies.
 * Controls: 
   Use the arrow keys to move
   - right arrow to turn right
   - left arrow to turn left
   - up arrow to move forward
   - down arrow to move downward
   - space bar to shoot missile
 */
//main character class
class player { 
    constructor(x, y, s) {
        this.x = x;
        this.y = y;
        this.speed = s;
        this.currentSpeed = s;
        this.position = new p5.Vector(x, y);
    }
    draw() {
        push();
        translate(this.x, this.y);
        rotate(angle);
        //represents a tank
        fill(0, 0, 255);
        noStroke();
        rect(0, -2, 20, 4);
        rect(-10, -10, 20, 20);
        fill(0);
        rect(-10, -10, 20, 4);
        rect(-10, 6, 20, 4);
        pop();
    }
    move() {
        if (angle > PI) {
            this.angle = -this.angle;
        }
        if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) {
            if (angle > 2 * PI) {
                angle = 0;
            }
            if (angle < 0) {
                angle = 2 * PI
            }
            if (keyIsDown(LEFT_ARROW)) {
                angle = angle - twoDegrees * 3;
                this.currentSpeed = 0;
            }
            if (keyIsDown(RIGHT_ARROW)) {
                angle = angle + twoDegrees * 3;
                this.currentSpeed = 0;
            }
            if (keyIsDown(UP_ARROW)) {
                this.x += 2 * cos(angle);
                this.y += 2 * sin(angle);
                this.currentSpeed = -1;
            }
            if (keyIsDown(DOWN_ARROW)) {
                this.x -= 2 * cos(angle);
                this.y -= 2 * sin(angle);
                this.currentSpeed = 1;
            }

        } else {
            this.currentSpeed = 0;
        }
    }
    checkCollision() {
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].obj == 1) { //border
                if (dist(this.x, this.y, game.objects[i].x, game.objects[i].y) < 23 && game.objects[i].x < 30) {
                    this.x += 2;
                    game.xCor -= 2;
                } else if (dist(this.x, this.y, game.objects[i].x, game.objects[i].y) < 23 && game.objects[i].y > 760) {
                    this.y -= 2;
                    game.yCor += 2;
                } else if (dist(this.x, this.y, game.objects[i].x, game.objects[i].y) < 23 && game.objects[i].x > 760) {
                    this.x -= 2;
                    game.xCor += 2;
                } else if (dist(this.x, this.y, game.objects[i].x, game.objects[i].y) < 23 && game.objects[i].y < 30) {
                    this.y += 2;
                    game.yCor -= 2;
                }
            } else if (game.objects[i].obj == 2 && game.objects[i].hit == 0) { //rock 
                if (dist(this.x, this.y, game.objects[i].x, game.objects[i].y) < 20) {
                    if (this.x - game.objects[i].x > 0) {
                        this.x += 2;
                        game.xCor -= 2;
                    }
                    if (this.y - game.objects[i].y > 0) {
                        this.y += 2;
                        game.yCor -= 2;
                    }
                    if (this.x - game.objects[i].x < 0) {
                        this.x -= 2;
                        game.xCor += 2;
                    }
                    if (this.y - game.objects[i].y < 0) {
                        this.y -= 2;
                        game.yCor += 2;
                    }
                }
            } else if (game.objects[i].obj == 3) { //chest
                if (dist(this.x, this.y, game.objects[i].x, game.objects[i].y) < 20 && game.objects[i].hit == 0) {
                    game.objects[i].hit = 1;
                    chestCount++;
                }
            }
        }
    }
}
//enemy class
class enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.currState = 0;
        this.angle = 0;
        this.state = [new wanderState(), new chaseState(), new avoidRockState(), new avoidMissileState()];
        this.position = new p5.Vector(x, y);
        this.firstHit = 0;
        this.secondHit = 0;
    }
    changeState(x) {
        this.currState = x;
    }
    draw() {

        //draw enemy based on hit
        if (this.firstHit == 0 && this.secondHit == 0) {
            push();
            translate(this.position.x, this.position.y);
            rotate(this.angle);
            fill(255);
            rect(-10, -10, 20, 20);
            fill(0);
            rect(-10, -10, 20, 5);
            fill(255, 0, 0);
            rect(-5, -4, 3, 3);
            rect(3, -4, 3, 3);
            fill(0);
            rect(-10, 0, 20, 10);
            pop();
        }
        else if (this.firstHit == 1 && this.secondHit == 0) {
            push();
            translate(this.position.x, this.position.y);
            rotate(this.angle);
            fill(255, 0, 0);
            rect(-10, -10, 20, 20);
            fill(0);
            rect(-10, -10, 20, 5);
            fill(255, 255, 255);
            rect(-5, -4, 3, 3);
            rect(3, -4, 3, 3);
            fill(0);
            rect(-10, 0, 20, 10);
            pop();
        }
    }
    checkCollision() {
        if (dist(this.position.x, this.position.y, myPlayer.x, myPlayer.y) < 20 && this.secondHit != 1) {
            game.gameOver = 1;
        }
        for (var i = 0; i < missiles.length; i++) {
            if (dist(this.position.x, this.position.y, missiles[i].x, missiles[i].y) < 12 && this.firstHit == 0 && this.secondHit == 0 && missiles[i].hit == 0) {
                this.firstHit = 1;
                missiles[i].hit = 1;
            } else if (dist(this.position.x, this.position.y, missiles[i].x, missiles[i].y) < 12 && this.firstHit == 1 && this.secondHit == 0 && missiles[i].hit == 0) {
                this.secondHit = 1;
                missiles[i].hit = 1;

            }
        }
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].obj == 1) { //border
                if (dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y) < 23 && game.objects[i].x < 30) {
                    this.position.x += 4;
                } else if (dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y) < 23 && game.objects[i].y > 760) {
                    this.position.y -= 4;
                } else if (dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y) < 23 && game.objects[i].x > 760) {
                    this.position.x -= 4;
                } else if (dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y) < 23 && game.objects[i].y < 30) {
                    this.position.y += 4;
                }
            } else if (game.objects[i].obj == 2 && game.objects[i].hit == 0) { //rock 
                if (dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y) < 20) {
                    if (this.position.x - game.objects[i].x > 0) {
                        this.position.x += 1;
                    }
                    if (this.position.y - game.objects[i].y > 0) {
                        this.position.y += 1;
                    }
                    if (this.position.x - game.objects[i].x < 0) {
                        this.position.x -= 1;
                    }
                    if (this.position.y - game.objects[i].y < 0) {
                        this.position.y -= 1;
                    }
                }
            } else if (game.objects[i].obj == 3) { //chest

            }
        }

    }
}
//4 states: wander, chase player, avoid rock, avoid missile
class wanderState {
    constructor() {
        this.angle = 0;
    }
    execute(me) {
        //wander mechanics
        if (second() % 2 == 0) {
            me.position.x = 1 + me.position.x;
        } else  {
            me.position.y = -1 + me.position.y;
        }
        //if player is within distance
        if (dist(me.position.x, me.position.y, myPlayer.x, myPlayer.y) < 200) {
            me.changeState(1); // go to chase state
        }
    }
}
class chaseState {
    constructor() {
        this.angle = 0;
        this.angleDir = 0;
        this.vec = new p5.Vector(0, 0);
        this.step = new p5.Vector(0, 0);
    }
    execute(me) {
        this.vec.set(myPlayer.x - me.position.x, myPlayer.y - me.position.y);
        this.angle = this.vec.heading(); 
        var angleDiff = abs(this.angle - me.angle);
        //check rock
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].obj == 2) {
                if (dist(game.objects[i].x, game.objects[i].y, me.position.x, me.position.y) < 25 && game.objects[i].hit == 0) {
                    //move to avoid rock state
                    rockObject = game.objects[i];
                    me.changeState(2);
                }
            }
        }
        //check missile
        for (var i = 0; i < missiles.length; i++) {
            if (missiles[i].fire === 1 && dist(missiles[i].x, missiles[i].y, me.position.x, me.position.y) < 30) {
                //move to avoid missile state
                missileObject = missiles[i];
                me.changeState(3);
            }
        }
        //turn according to the player
        if (angleDiff > twoDegrees) {
            if (this.angle > me.angle) {
                this.angleDir = oneDegree * 2;
            } else {
                this.angleDir = -oneDegree * 2;
            }
            if (angleDiff > PI) {
                this.angleDir = -this.angleDir;
            }
            me.angle += this.angleDir;
            if (me.angle > PI) {
                me.angle = -angle179;
            } else if (me.angle < -PI) {
                me.angle = angle179;
            }
        //move within reach of the player    
        } else if (dist(myPlayer.x, myPlayer.y, me.position.x, me.position.y) < 200) {
            this.step.set(myPlayer.x - me.position.x, myPlayer.y - me.position.y);
            this.step.normalize();
            me.position.add(this.step);
            me.position.add(this.step);
        }
    }

}
class avoidRockState {
    constructor() {
        this.angle = 0;
        this.angleDir = 0;
        this.vec = new p5.Vector(0, 0);
        this.step = new p5.Vector(0, 0);
    }
    execute(me) {
        this.vec.set(rockObject.x - me.position.x, rockObject.y - me.position.y);
        this.angle = this.vec.heading(); 
        var angleDiff = abs(this.angle - me.angle);
        //turn and move backward according to the rock
        if ( dist(rockObject.x, rockObject.y, me.position.x, me.position.y) < 30) {
            this.step.set(rockObject.x - me.position.x, rockObject.y - me.position.y);
            this.step.normalize();
            me.position.sub(this.step);
            if (this.angle > me.angle) {
                this.angleDir = oneDegree * 3;
            } else {
                this.angleDir = -oneDegree * 3;
            }
            if (angleDiff > PI) {
                this.angleDir = -this.angleDir;
            }
            me.angle -= this.angleDir;
            if (me.angle > PI) {
                me.angle = -angle179;
            } else if (me.angle < -PI) {
                me.angle = angle179;
            }
        } else {
            me.changeState(0);
        }
    }
}
class avoidMissileState {

    constructor() {
        this.angle = 0;
        this.angleDir = 0;
        this.vec = new p5.Vector(0, 0);
        this.step = new p5.Vector(0, 0);
    }
    execute(me) {
        this.vec.set(missileObject.x - me.position.x, 0);
        this.angle = this.vec.heading();
        var angleDiff = abs(this.angle - me.angle);
        if (dist(missileObject.x, missileObject.y, me.position.x, me.position.y) < 30 && missileObject.hit == 0) {
            this.step.set(missileObject.x - me.position.x, missileObject.y - me.position.y);
            this.step.normalize();
            me.position.sub(this.step)
            if (this.angle > me.angle) {
                this.angleDir = oneDegree * 2;
            } else {
                this.angleDir = -oneDegree * 2;
            }
            if (angleDiff > PI) {
                this.angleDir = -this.angleDir;
            }
            me.angle += this.angleDir;
            if (me.angle > PI) {
                me.angle = -angle179;
            } else if (me.angle < -PI) {
                me.angle = angle179;
            }
        } else {
            me.changeState(0);
        }
    }
}
//draw border 
class border {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    draw(x, y) {
        this.x = x;
        this.y = y;
        //supposed to be a dirt border with black points
        fill(150, 75, 0);
        rect(this.x - 10, this.y - 10, 20, 20);
        fill(0, 0, 0);
        rect(this.x, this.y, 1, 1);
        rect(this.x + 5, this.y + 4, 1, 1);
        rect(this.x - 5, this.y - 3, 1, 1);
        rect(this.x + 6, this.y + 1, 1, 1);
        rect(this.x + 6, this.y - 5, 1, 1);
        rect(this.x + 1, this.y + 7, 1, 1);
    }
} // ONE
class rock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hit = 0;
    }
    draw(x, y) {
        //represent a grey rock with black points
        this.x = x;
        this.y = y;
        fill(128, 128, 128);
        rect(this.x - 10, this.y - 10, 20, 20);
        fill(0, 0, 0);
        rect(this.x, this.y, 1, 1);
        rect(this.x + 5, this.y + 4, 1, 1);
        rect(this.x - 5, this.y - 3, 1, 1);
        rect(this.x + 6, this.y + 1, 1, 1);
        rect(this.x + 6, this.y - 5, 1, 1);
        rect(this.x + 1, this.y + 7, 1, 1);

    }
} // TWO
class chest {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.hit = 0;
    }
    draw(x, y) {
        this.x = x;
        this.y = y;
        //load character
        imageMode(CENTER);
        image(this.img, this.x, this.y, 20, 20);

    }
} // THREE
class collisionObj {
    //for colliding with game objects
    constructor(x, y, o) {
        this.x = x;
        this.y = y;
        this.obj = o;
        this.hit = 0;
    }
    //if hit draw a green square to match the background
    draw() {
        fill(107, 156, 88);
        rect(this.x - 11, this.y - 11, 22, 22);
    }
}
class missile {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.position = new p5.Vector(0, 0);
        this.hit = 0
        this.fire = 0;
        this.fireAngle = 0;
        this.playerX = 0;
        this.playerY = 0;
    }
    draw() {
        if (this.fire == 1 && this.hit == 0) {
            //draw small missile
            push();
            fill(255, 0, 0);
            rect(this.x, this.y, 2, 2);
            pop();
            this.x += 3 * cos(this.fireAngle);
            this.y += 3 * sin(this.fireAngle);
        }
    }
    checkRock() {
        //check collision with rock
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].obj === 2) {
                if (dist(game.objects[i].x, game.objects[i].y, this.x, this.y) < 12) {
                    game.objects[i].hit = 1;
                    this.hit = 1;
                }
            }
        }
    }


}
class gameObj {
    constructor() {
        this.tilemap = [
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
            "w                                 r    w",
            "w       c               c              w",
            "w                                      w",
            "w        rrrr               rr       c w",
            "w   c                                  w",
            "w                                      w",
            "w            rrr                     r w",
            "w                                      w",
            "w           c             r            w",
            "w                       rrrrrrr        w",
            "w       rrrr                   c       w",
            "w          rr                          w",
            "w                                      w",
            "w            c    r             c      w",
            "w                                      w",
            "w                                      w",
            "w                                      w",
            "w       c                   c          w",
            "w                  c                   w",
            "w                          r           w",
            "w                                      w",
            "w                                  c   w",
            "w                   rrrrr              w",
            "w       c                              w",
            "w                                      w",
            "w       r          c         rr    c   w",
            "w                                      w",
            "w               rrrr             c     w",
            "w                                      w",
            "w                                      w",
            "w       c            rrrrr             w",
            "w                               c      w",
            "w                                      w",
            "w                                      w",
            "w               c                      w",
            "w                                 c    w",
            "w      rr             rrrr             w",
            "w                                      w",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",

        ];
        this.gameOver = -1;
        this.score = 0;
        this.currFrame = 0;
        this.yCor = -300;
        this.xCor = 0;
        this.objects = [];

    } // gameObj constructor
    initialize() {
        for (var i = 0; i < this.tilemap.length; i++) {
            for (var j = 0; j < this.tilemap[i].length; j++) {
                switch (this.tilemap[i][j]) {
                    case 'w':
                        this.objects.push(new collisionObj(j * 20, i * 20, 1));
                        break;
                    case 'r':
                        this.objects.push(new collisionObj(j * 20, i * 20, 2));
                        rockCount++;
                        break;
                    case 'c':
                        this.objects.push(new collisionObj(j * 20, i * 20, 3));
                        break;
                }
            }
        }
    }
    drawBackground() {
        for (var i = 0; i < this.tilemap.length; i++) {
            for (var j = 0; j < this.tilemap[i].length; j++) {
                switch (this.tilemap[i][j]) {
                    case 'w':
                        borders.draw(j * 20, i * 20);
                        break;
                    case 'c':
                        chests.draw(j * 20, i * 20);
                        break;
                    case 'r':
                        rocks.draw(j * 20, i * 20);
                        break;
                }
            }
        }
        if (myPlayer.currentSpeed > 0 && myPlayer.x < 760) { //760
            this.xCor += 2 * cos(angle);
            this.yCor += 2 * sin(angle);
        }
        if (myPlayer.currentSpeed < 0 && myPlayer.x > 20) { //20
            this.xCor -= 2 * cos(angle);
            this.yCor -= 2 * sin(angle);
        }
    }
}

//GAME VARIABLES
var game;
var myPlayer;
var rocks;
var borders;
var chests;
var enemies = [];
var images = [];
var chestCount = 0;
var keyArray = [];

// ROTATION AND ANGLE
var angle;
var twoDegrees;
var oneDegree;
var angle179;

//MISSILES VARIABLES
var missileIndex = 0;
var missiles;
var currentFrameCount = 0;
var rockObject;
var missileObject;
var rockCount = 0;

function keyPressed() {
    keyArray[keyCode] = 1;
}

function keyReleased() {
    keyArray[keyCode] = 0;
}

function checkFire() {
    if (keyArray[32] === 1) {
        if (currentFrameCount < (frameCount - 10)) {
            currentFrameCount = frameCount;
            missiles[missileIndex].hit = 0;
            missiles[missileIndex].fire = 1;
            missiles[missileIndex].fireAngle = angle;
            missiles[missileIndex].x = myPlayer.x;
            missiles[missileIndex].y = myPlayer.y - 2;
            missiles[missileIndex].playerX = myPlayer.x;
            missiles[missileIndex].playerY = myPlayer.y - 2;
            missileIndex++;
            if (missileIndex > 7) {
                missileIndex = 0;
            }

        }
    }
}
//char creation
function chestChar() {
    //outer layer of chest
    fill(139, 69, 19);
    rect(0, 0, 400, 400);
    //inner layer of ches
    fill(205, 133, 63);
    rect(50, 50, 300, 300);
    //gold band of chest
    fill(255, 215, 0);
    rect(0, 150, 400, 50);
    //silver lock of chest
    fill(192, 192, 192);
    rect(175, 130, 50, 115);

    images.push(get(0, 0, width, height));

    //outer layer of chest
    fill(107, 156, 88);
    rect(0, 0, 400, 400);
    noStroke();
    images.push(get(0, 0, width, height));
}

function setup() {
    createCanvas(400, 400);
    chestChar();
    frameRate(20);
    angleMode(RADIANS);
    //initialize variables
    angle = 0;
    twoDegrees = PI / 90;
    oneDegree = PI / 180;
    angle179 = PI - oneDegree;
    game = new gameObj();
    myPlayer = new player(200, 500, 3);
    rocks = new rock(0, 0);
    borders = new border(0, 0);
    chests = new chest(10000, 10000, images[0]);
    enemies.push(new enemy(50, 750));
    enemies.push(new enemy(100, 200));
    enemies.push(new enemy(200, 750));
    enemies.push(new enemy(500, 100));
    enemies.push(new enemy(30, 300));
    enemies.push(new enemy(500, 500));
    missiles = [new missile(), new missile(), new missile(), new missile(), new missile(), new missile(), new missile(), new missile()];
    game.initialize();
    console.log(rockCount);

}

function draw() {

    //before game start
    if (game.gameOver === -1) {
        fill(255, 255, 255);
        text("Press space bar to play", 125, 200);
        if (keyArray[32] === 1) {
            game.gameOver = 0;
        }
        //game    
    } else if (game.gameOver === 0) {
        background(107, 156, 88);
        push();
        translate(game.xCor, game.yCor);
        game.drawBackground();
        checkFire();
        //draw missiles
       
        //chest and rocks check hit by player or missile
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].hit == 1) { 
                game.objects[i].draw();
            }
        }
        //check and draw each enemy
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].draw();
            enemies[i].checkCollision();
            enemies[i].state[enemies[i].currState].execute(enemies[i]);
        }

        for (var i = 0; i < missiles.length; i++) {
            if (missiles[i].fire === 1) {
                missiles[i].draw();
                missiles[i].checkRock();
            }
        }
        //move and draw main character
        myPlayer.draw();
        myPlayer.move();
        myPlayer.checkCollision();
        pop();
        fill(255, 255, 255);
        text("prizes collected: " + chestCount, 200, 10);
        if (chestCount == 20) {
            game.gameOver = 2;
        }
        //Game Lost    
    } else if (game.gameOver == 1) {
        fill(255, 0, 0);
        textSize(40);
        text("You Lose", 100, 200);
        //Game Won    
    } else if (game.gameOver == 2) {
        fill(255, 0, 0);
        textSize(40);
        text("You Win", 125, 200);
    }
}