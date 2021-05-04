'use strict'
const global = {
    scoreDiv: document.querySelector("em"),
    recordDiv: document.querySelector("span"),
    Bar: document.querySelector(".bar"),
    overlayItem: document.querySelector('.overlay'),
    point: 0,
    record: 0,
    storage: JSON.parse(localStorage.getItem('highestScore')),
    barometer: 0,
    gamepause: false,
    overlay(text){
        this.overlayItem.style.visibility = this.gamepause ? "visible" : "hidden";
        this.overlayItem.querySelector("h1").innerHTML = text
    },
    pause(text){
        this.gamepause = !this.gamepause
        this.overlay(text)
        enemy.obs.style.animationPlayState= this.gamepause ? "paused" : "running"
    },
    collide(obj,a ,b,c,d) {
        return (
            obj.posTop(a) > player.up &&
            obj.posTop(b) < player.up &&
            obj.posLeft(c) > player.left &&
            obj.posLeft(d) < player.left
        );
    },
    setStorage(item) {
        localStorage.setItem('highestScore', JSON.stringify(item))
    },
    gameOver(text) {
        // alert("GAME OVER");
        this.pause(text)
        this.printScore(false);
        player.rest();
        this.barometer = 0
        this.overlay('Game Over')
    },
    getStorage() {
        if (this.storage != 0) {
            this.record = this.storage
            this.recordDiv.innerHTML = this.record;
        }
    },
    printScore(e) {

        if (e) {
            ++this.point;
        } else {
            this.point = 0;
        }
        if (this.record <= this.point) {
            this.record = this.point
            this.setStorage(this.record)
        }

        this.scoreDiv.innerHTML = this.point;
        this.recordDiv.innerHTML = this.record;


    },
    carotBar(timer) {
        setInterval(() => {
            if(global.gamepause){
                return;
            }
            if (this.barometer == 150) {
                this.gameOver()
            } else {
                if (this.barometer > 55 && this.barometer < 100 ){
                    this.Bar.style.background = "yellow"
                } else if(this.barometer > 80) {
                    this.Bar.style.background = "red"
                } else {
                    this.Bar.style.background = "white"
                }
                this.barometer = this.barometer + timer
                document.documentElement.style.setProperty('--Bar', `${this.barometer}px`);
            }
        }, 500)

    }

};

const enemy = {
    obs: document.querySelector(".obs01"),
    posTop(num = 0) {
        return this.obs.offsetTop + num;
    },
    posLeft(num = 0) {
        return this.obs.offsetLeft + num;
    },
};

const player = {
    box: document.querySelector(".box"),
    left: 200,
    up: 200,
    moveRight() {
        this.left = this.left + 50;
        this.box.style.left = this.left + "px";
    },
    moveLeft() {
        this.left = this.left - 50;
        this.box.style.left = this.left + "px";
    },
    moveUp() {
        this.up = this.up - 50;
        this.box.style.top = this.up + "px";
    },
    moveDown() {
        this.up = this.up + 50;
        this.box.style.top = this.up + "px";
    },
    rest() {
        this.left = 200;
        this.up = 200;
        this.box.style.left = "200px";
        this.box.style.top = "200px";
    }
};

const item = {
    coin: document.querySelector(".coin"),
    availability: true,
    prevValue: 0,
    value: 0,
    randomValue() {
        do {
            this.value = parseInt((parseInt(Math.random() * 10) * 5000) / 90);
        } while (
            this.value != this.prevValue &&
            +(this.value > this.prevValue + 100) + +(this.value < this.prevValue - 100) != 1
        );
    },
    placment() {
        if(global.gamepause){
            return;
        }
        this.randomValue()
        this.prevValue = this.value
        this.coin.style.top = this.value + "px";
        console.log(`value is ${this.value}
preval is ${this.prevValue}`);



    },
    posTop(num = 0) {
        return this.coin.offsetTop + num;
    },
    posLeft(num = 0) {
        return this.coin.offsetLeft + num;
    },
};

window.addEventListener("keydown", (event) => {
    if(global.gamepause){
            return;
        }
    if (
        event.code === "ArrowRight" &&
        player.left <= 1000
    ) {
        player.moveRight();
    }
});

window.addEventListener("keydown", (event) => {
    if(global.gamepause){
            return;
        }
    if (event.code === "ArrowLeft" && player.left != 0) {
        player.moveLeft();
    }
});

window.addEventListener("keydown", (event) => {
    if(global.gamepause){
            return;
        }
    if (event.code === "ArrowUp" && player.up != 0) {
        player.moveUp();
    }
});

window.addEventListener("keydown", (event) => {
    if(global.gamepause){
            return;
        }
    if (event.code === "ArrowDown" && player.up <= 400) {
        player.moveDown();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.code === 'Space' || event.code === 'Enter') {
        global.pause("Pause")
    }
});

global.getStorage()
global.carotBar(10)

let itemPlacment = setInterval(() => {
    item.placment();
}, 5000);

setInterval(() => {
    if (global.collide(enemy,50,-100,100,-100)) {
        global.gameOver("Game Over")
    }
    if (global.collide(item, 50,-100,0,-50)) {
        console.log("you get a point");
        global.printScore(true);
        item.placment();
        clearInterval(itemPlacment);
        global.barometer = 0
        itemPlacment = setInterval(() => {
            item.placment();
        }, 5000);
    }
}, 50);

global.pause("Welcome")