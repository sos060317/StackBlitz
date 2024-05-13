const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.8;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc : "/first/img/background.png",
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc : "/first/img/shop.png",
    scale : 2.75,
    framesMax : 6,
});

c.fillRect(0, 0, canvas.width, canvas.height);
// 사각형으로 채워라


const player = new Fighter({
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
   },
   imageSrc: "/first/img/1p/Idle.png",
   framesMax: 8,
   scale: 2.5,

   offset : {
        x : 215,
        y : 157
   },

   sprites : {
        idle : {
            imageSrc: "/first/img/1p/Idle.png",
            framesMax: 8,
        },
        run : {
            imageSrc: "/first/img/1p/Run.png",
            framesMax: 8,
        },
        jump : {
            imageSrc: "/first/img/1p/Jump.png",
            framesMax: 2,
        },
        fall : {
            imageSrc: "/first/img/1p/Fall.png",
            framesMax: 2,
        },
        attack1 : {
            imageSrc: "/first/img/1p/Attack1.png",
            framesMax: 6,
        }
   },

   // 어택박스 오프셋 설정
   attackBox : {
      offset : {
        x: 100,
        y: 50
      },
      width : 160,
      height : 50,
   }
});

const enemy = new Fighter({
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
   },
   imageSrc: "/first/img/2p/Idle.png",
   framesMax: 4,
   scale: 2.5,

   offset : {
        x : 215,
        y : 167
   },

   sprites : {
        idle : {
            imageSrc: "/first/img/2p/Idle.png",
            framesMax: 4,
        },
        run : {
            imageSrc: "/first/img/2p/Run.png",
            framesMax: 8,
        },
        jump : {
            imageSrc: "/first/img/2p/Jump.png",
            framesMax: 2,
        },
        fall : {
            imageSrc: "/first/img/2p/Fall.png",
            framesMax: 2,
        },
        attack1 : {
            imageSrc: "/first/img/2p/Attack1.png",
            framesMax: 4,
        }
   },
   attackBox : {
      offset : {
        x: -170,
        y : 50,
      },
      width : 170,
      height : 50,
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



decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();

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
    //player.image = player.sprites.idle.image;
    //player.switcSprite('idle');

    if(keys.a.pressed && player.lastKey === "a") {
        //player.image = player.sprites.run.image;
        player.velocity.x = -6;
        player.switcSprite('run');
    }
    else if(keys.d.pressed && player.lastKey === "d") {
        //player.image = player.sprites.run.image;
        player.velocity.x = +6;
        player.switcSprite('run');
    } else {
        player.switcSprite('idle');
    }

    if(player.velocity.y < 0) {
        player.switcSprite('jump');
    } else if(player.velocity.y > 0) {
        player.switcSprite('fall')
    }

    if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -6;
        enemy.switcSprite('run');
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = +6;
        enemy.switcSprite('run');
    } else {
        enemy.switcSprite('idle');
    }

    if(enemy.velocity.y < 0) {
        enemy.switcSprite('jump');
    } else if(player.velocity.y > 0) {
        enemy.switcSprite('fall')
    }

    if(rectangularColision({rectangle1:player, rectangle2:enemy}) &&
       player.isAttacking && player.framesCurrent === 4)
    {
        console.log("hit");
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    }

    // 공격이 실패했을 때
    if(player.isAttacking && player.framesCurrent === 4) {
       player.isAttacking = false;
    }

    if(rectangularColision({rectangle1:enemy, rectangle2:player}) &&
       enemy.isAttacking && enemy.framesCurrent === 2)
    {
        console.log("enemy attack");
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + "%";
    }

    // 공격이 실패했을 때
    if(enemy.isAttacking && enemy.framesCurrent === 4) {
        enemy.isAttacking = false;
     }

    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerID});
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
            player.velocity.y = -15;
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
            enemy.velocity.y = -15;
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