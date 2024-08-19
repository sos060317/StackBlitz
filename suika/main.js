import { FRUITS } from "./fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    // 과일 조작을 위해 Body 선언
    Body = Matter.Body,
    // 과일 합치는 이벤트
    Events = Matter.Events;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
    engine,
    element : document.body,
    options : {
        wireframes : false,
        background : '#F7F4C8',
        width : 620,
        height : 850,
    },
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic : true,
    //고정시켜주는 옵션
    render : { fillStyle : '#E6B143'}
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic : true,
    //고정시켜주는 옵션
    render : { fillStyle : '#E6B143'}
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic : true,
    //고정시켜주는 옵션
    render : { fillStyle : '#E6B143'}
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic : true,
    isSensor : true,
    //고정시켜주는 옵션
    render : { fillStyle : '#E6B143'}
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
// 키 조작을 제어하는 변수
let disableAction = false;

function addFruit() {
    const index = Math.floor(Math.random() * 5);
    // 굉장히 낮은 수가 나오기 때문에 곱하기 5를 해준다.
    console.log(index);
    const fruits = FRUITS[index];

    const body = Bodies.circle(300, 50, fruits.radius, {
        index : index,
        isSleeping : true,
        render : {
            sprite : { texture : `${fruits.name}.png`},
            // sprite : { texture : fruits.name + '.png'},
        },

        // 튀어오르는 강도
        restitution : 0.5,
    })

    currentBody = body;
    currentFruit = fruits;

    World.add(world, body);
}

window.onkeydown = (event) => {
    if(disableAction)
        return;

    switch(event.code) {
        case "KeyA":
            if(currentBody.position.x - currentFruit.radius > 30)
            Body.setPosition(currentBody, {
                x : currentBody.position.x - 10,
                y : currentBody.position.y,
            });
            break;
        case "KeyD":
            if(currentBody.position.x + currentFruit.radius < 590)
            Body.setPosition(currentBody, {
                x : currentBody.position.x + 10,
                y : currentBody.position.y,
            });
            break;
        case "KeyS":
            currentBody.isSleeping = false;
            disableAction = true;
            // 1/1000초만큼 대기한 후 실행
            setTimeout(() => {
                addFruit();
                disableAction = false;
            }, 1000)
            break;
    }
}

Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        // 같은 과일일 경우
        if(collision.bodyA.index == collision.bodyB.index) {
            // 기존 과일값 저장
            const index = collision.bodyA.index;

            // 수박끼리 부딪힐 경우 예외처리
            if(index === FRUITS.length - 1)
                return;

            // 과일 제거
            World.remove(world, [collision.bodyA, collision.bodyB]);

            const newFruit = FRUITS[index + 1];
            const newBody = Bodies.circle(
                // 부딪힌 지점의 x, y값을 가져온다.
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    // index 값 1 증가
                    index : index + 1,
                    // 과일 이미지 렌더링
                    render : { sprite : { texture : `${newFruit.name}.png`}},
                }
            );
            // 생성된 과일을 월드에 추가
            World.add(world, newBody);
        }
    });
})

addFruit();