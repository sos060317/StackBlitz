class Sprite {
    constructor({position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {
            x:0, y:0
        },
    }) {
        this.position = position;

        this.width = 50;
        this.height = 150;

        this.image = new Image();
        this.image.src = imageSrc;

        this.scale = scale;

        this.framesMax = framesMax;

        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;

        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image,
            // 이미지 자르는 영역
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // 이미지 자르는 영역
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,

            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
            );
    }

    animateFrame() {
        this.framesElapsed++;
        if(this.framesElapsed % this.framesHold === 0) {
            if(this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            }else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrame();
    }
}

// Sprite를 상속 받음
class Fighter extends Sprite{
    constructor({position,
        velocity,
        color = "red",
        // offset,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {
            x : 0,
            y : 0,
        },
        sprites,
        attackBox = {offset : {}, width: undefined, height: undefined}
    }) {

    super({
        position,
        imageSrc,
        scale,
        framesMax,
        offset
    })
        //this.position = position;

        this.velocity = velocity;

        this.width = 50;
        this.height = 150;

        this.lastKey;

        this.attackBox = {
            width : attackBox.width,
            height : attackBox.height,
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset : attackBox.offset,
        }

        this.color = color;

        this.isAttacking;

        this.health = 100;

        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;

        this.sprites = sprites;

        for ( const sprite in sprites ) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    // draw() {
    //     c.fillStyle = this.color;
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height)

    //     if(this.isAttacking) {
    //         c.fillStyle = "green";
    //         c.fillRect(
    //             this.attackBox.position.x,
    //             this.attackBox.position.y,
    //             this.attackBox.width,
    //             this.attackBox.height
    //         )
    //     }
    // }

    update()
    {
        this.draw();
        this.animateFrame();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y ;

        // 어택박스 확인
        // c.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // )

        this.position.y += this.velocity.y;

        this.position.x += this.velocity.x;

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        }
        else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        // 공격 스프라이트 재생
        this.switcSprite('attack1');
        this.isAttacking = true;
    }

    takeHit() {
        this.switcSprite('takeHit');
        this.health -= 20;
    }

    switcSprite(sprite) {
        if(this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
            ) return;
        
        if(this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
            ) return;

        switch(sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    // 프레임 초기화
                    this.framesCurrent = 0;
                }
                break;
            case 'run' :
                if(this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    // 프레임 초기화
                    this.framesCurrent = 0;
                }
                break;
            case 'jump' :
                if(this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    // 프레임 초기화
                    this.framesCurrent = 0;
                }
                break;
            case 'fall' :
                if(this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    // 프레임 초기화
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1' :
                if(this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    // 프레임 초기화
                    this.framesCurrent = 0;
                }
                break;
            case 'takeHit' :
                if(this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    // 프레임 초기화
                    this.framesCurrent = 0;
                }
                break;
        }
    }
}