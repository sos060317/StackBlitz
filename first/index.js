const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.3;

c.fillRect(0, 0, canvas.width, canvas.height);
// 사각형으로 채워라

class Sprite {
    constructor({position, velocity, color = "red", offset})
    {
        this.position = position;

        this.velocity = velocity;

        this.width = 50;
        this.height = 150;

        this.lastKey;

        this.attackBox = {
            width : 100,
            height : 50,
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset,
        }

        this.color = color;

        this.isAttacking;

        this.health = 100;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        if(this.isAttacking) {
            c.fillStyle = "green";
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
        
    }

    update()
    {
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y;

        this.position.x += this.velocity.x;

        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        }
        else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
        // 공격 딜레이 걸기
    }
}

const player = new Sprite({
    position: {
        x :0,
        y :0,
    },
   velocity: {
        x :0,
        y :10,
   },
   offset: {
        x :0,
        y :0,
   }
});

const enemy = new Sprite({
    position: {
        x :400,
        y :100,
    },
   velocity: {
        x :0,
        y :10,
   },
   color : "blue",
   offset: {
        x :-50,
        y :0,
   }
});

console.log(player);

const keys = {
    a: {
        pressed : false,
    },
    d: {
        pressed : false,
    },
    w: {
        pressed : false,
    },

    ArrowRight: {
        pressed : false,
    },
    ArrowLeft: {
        pressed : false,
    },
    ArrowUp: {
        pressed : false,
    }
}

function rectangularColision({rectangle1, rectangle2}) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.isAttacking
        )
}

// player.draw();
// enemy.draw();

//let lastKey;

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // if(keys.a.pressed) {
    //     player.velocity.x  = -1;
    // }
    // else if(keys.d.pressed) {
    //     player.velocity.x = +1;
    // }

    if(keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -2;
    }
    else if(keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = +2;
    }

    if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -2;
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = +2;
    }

    if(rectangularColision({rectangle1:player, rectangle2:enemy}) &&
       player.isAttacking)
    {
        console.log("hit");
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    }

    if(rectangularColision({rectangle1:enemy, rectangle2:player}) &&
       enemy.isAttacking)
    {
        console.log("enemy attack");
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + "%";
    }
}

animate();

window.addEventListener("keydown", (event) => {
    console.log(event.key);

    switch(event.key) {
        case "d":
            keys.d.pressed = true;
            player.lastKey = "d";
            break;
        case "a":
            keys.a.pressed = true;
            player.lastKey = "a";
            break;
        case "w":
            player.velocity.y = -10;
            break;
        // 공격 키 추가
        case " ":
            player.attack();
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;
        case "ArrowUp":
            enemy.velocity.y = -10;
            break;
        case "ArrowDown":
            enemy.attack();
            break;
    }
})

window.addEventListener("keyup", (event) => {
    console.log(event.key);

    switch(event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
})