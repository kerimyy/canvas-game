const c = document.querySelector("canvas");
const ctx = c.getContext("2d");

c.width = document.body.clientWidth; //document.width is obsolete
c.height = document.body.clientHeight; //document.height is obsolete

const scoreP = document.querySelector("p");
const menu = document.querySelector(".container");
const button = document.querySelector("#buton");
const bigScore = document.querySelector("#score");
let score = 0;
class Player {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;

        this.velocity = {
            x: 0,
            y: 0
        }

        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.vel = 5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

    }



    update() {
        if (this.up) this.velocity.y = -this.vel;
        else if (!this.down) this.velocity.y = 0;

        if (this.down) this.velocity.y = this.vel;
        else if (!this.up) this.velocity.y = 0;

        if (this.left) this.velocity.x = -this.vel;
        else if (!this.right) this.velocity.x = 0;

        if (this.right) this.velocity.x = this.vel;
        else if (!this.left) this.velocity.x = 0;




        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }



}

class Enemy {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.vel = 4
        this.velocity = {
            x: Math.cos(this.angle) * this.vel,
            y: Math.sin(this.angle) * this.vel
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }

}

class Bullet {
    constructor(angle) {
        this.x = player.x;
        this.y = player.y;
        this.size = 10;
        this.color = 'white';
        this.angle = angle;
        this.vel = 10;
        this.velocity = {
            x: Math.cos(this.angle) * this.vel,
            y: Math.sin(this.angle) * this.vel
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}



let animation;
function animate() {
   animation = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, c.width, c.height);
    player.update();
    bullets.forEach((bullet,index) => {
        bullet.update();
        if(bullet.x-bullet.size > c.width || bullet.x+bullet.size < 0 || bullet.y-bullet.size > c.height || bullet.y+bullet.size < 0){
            bullets.splice(index,1);
        }
    })
    enemies.forEach((enemy,eIndex) => {
        enemy.update();
        if(enemy.x-enemy.size > c.width || enemy.x+enemy.size < 0 || enemy.y-enemy.size > c.height || enemy.y+enemy.size < 0){
            enemies.splice(eIndex,1);
        }
        var pDist = Math.hypot(player.x-enemy.x,player.y-enemy.y);
        if(pDist-enemy.size-player.size <= 0){
            cancelAnimationFrame(animation);
            menu.style.display="flex";
            bigScore.innerHTML = score;
        }
        bullets.forEach((bullet,bIndex) => {
            var dist = Math.hypot(bullet.x-enemy.x,bullet.y-enemy.y);
            if(dist-enemy.size-bullet.size <= 0){
                enemies.splice(eIndex,1);
                bullets.splice(bIndex,1);
                score++;
                scoreP.innerHTML ="puan: "+score;
            }
        })
    });
console.log(enemies.length);
console.log(bullets.length);
}
function spawnEnemy() {
    let x;
    let y;
    let size = 30;
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? -size : c.width + size;
        y = Math.random() * c.height;
    } else {
        y = Math.random() < 0.5 ? -size : c.height + size;
        x = Math.random() * c.width;
    }

    var e = new Enemy(x, y, size, 'black');
    enemies.push(e)
}


document.addEventListener('keydown', (event) => {
    var name = event.key;
    switch (name) {
        case "w":
            player.up = true;
            break;
        case "d":
            player.right = true
            break;
        case "a":
            player.left = true
            break;
        case "s":
            player.down = true
            break;

    }


    console.log(`Key pressed ${name}`);
}, false);

document.addEventListener('keyup', (event) => {
    var name = event.key;
    switch (name) {
        case "w":
            player.up = false
            break;
        case "d":
            player.right = false
            break;
        case "a":
            player.left = false
            break;
        case "s":
            player.down = false
            break;

    }

}, false);

c.addEventListener("click", (e) => {
    var angle = Math.atan2(e.y - player.y, e.x - player.x);
    bullets.push(new Bullet(angle));
})

button.addEventListener("click",()=>{
    menu.style.display="none";
    enemies = []
    bullets = []
    score = 0;
    scoreP.innerHTML ="puan: "+score;
    animate();
})



const player = new Player(500, 400, 50, 'rgb(53, 65, 105)');
const enemy = new Enemy(500, 400, 50, 'black');
var enemies = []
var bullets = []

animate();
setInterval(spawnEnemy,500);