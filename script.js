```javascript
/* ============================================================
   NUTRI - AVENTURA NUTRITIVA
   JOGO EDUCATIVO 2D

   Tecnologia:
   - HTML5 Canvas
   - JavaScript puro
   - CSS

   Projeto acadêmico de Nutrição
============================================================ */


/* ============================================================
   CANVAS
============================================================ */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;


/* ============================================================
   CONFIGURAÇÃO
============================================================ */

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

let scaleX = 1;
let scaleY = 1;


/* ============================================================
   REDIMENSIONAMENTO
============================================================ */

function resizeCanvas() {

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    scaleX = window.innerWidth / GAME_WIDTH;
    scaleY = window.innerHeight / GAME_HEIGHT;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* ============================================================
   ESTADO DO JOGO
============================================================ */

let gameState = "MENU";

let currentPhase = 0;

let score = 0;

let energy = 100;

let lives = 3;

let collectedFoods = 0;

let cameraX = 0;

let gameWon = false;


/* ============================================================
   TECLAS
============================================================ */

const keys = {};

window.addEventListener("keydown", event => {

    keys[event.code] = true;

    if (
        [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "Space"
        ].includes(event.code)
    ) {
        event.preventDefault();
    }

    if (
        event.code === "KeyZ" &&
        gameState === "PLAYING"
    ) {
        player.attack();
    }
});


window.addEventListener("keyup", event => {

    keys[event.code] = false;
});


/* ============================================================
   UTILITÁRIOS
============================================================ */

function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );
}


function random(min, max) {

    return Math.random() * (max - min) + min;
}


function rectsCollide(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


/* ============================================================
   FASES
============================================================ */

const phases = [

    {
        name: "Fase 1 - Café da manhã",

        theme: "morning",

        width: 5500,

        educationIcon: "🍎",

        educationTitle: "Café da manhã completo!",

        educationText:
            "Começar o dia com uma alimentação variada pode contribuir para uma rotina alimentar mais adequada. Frutas, cereais e outras opções podem fazer parte de diferentes combinações.",

        foods: [
            "apple",
            "banana",
            "egg",
            "milk",
            "carrot"
        ],

        enemies: [
            "pular"
        ]
    },

    {
        name: "Fase 2 - Rotina corrida",

        theme: "city",

        width: 6500,

        educationIcon: "⏰",

        educationTitle: "Você venceu a rotina corrida!",

        educationText:
            "Planejamento pode ajudar nas escolhas alimentares quando o dia está cheio. Ter opções variadas disponíveis facilita encontrar alternativas adequadas para diferentes momentos.",

        foods: [
            "apple",
            "banana",
            "beans",
            "rice",
            "broccoli",
            "soda",
            "cookie"
        ],

        enemies: [
            "tempo",
            "sedentarismo"
        ]
    },

    {
        name: "Fase 3 - Hora do lanche",

        theme: "park",

        width: 6000,

        educationIcon: "🥦",

        educationTitle: "Lanche concluído!",

        educationText:
            "Não existe uma única combinação perfeita para todas as pessoas. Variedade, equilíbrio e contexto são importantes para construir uma alimentação adequada.",

        foods: [
            "banana",
            "apple",
            "carrot",
            "broccoli",
            "cookie",
            "candy",
            "fries"
        ],

        enemies: [
            "ultra",
            "planning"
        ]
    },

    {
        name: "Fase 4 - Desafio final",

        theme: "night",

        width: 7000,

        educationIcon: "🏆",

        educationTitle: "Você enfrentou o Chef da Rotina Corrida!",

        educationText:
            "Manter uma alimentação adequada durante uma rotina agitada pode exigir planejamento. O objetivo não é buscar perfeição, mas construir um conjunto equilibrado de escolhas ao longo do tempo.",

        foods: [
            "apple",
            "banana",
            "beans",
            "rice",
            "egg",
            "milk",
            "broccoli",
            "burger",
            "pizza",
            "soda"
        ],

        enemies: [
            "chef"
        ]
    }
];


/* ============================================================
   ALIMENTOS
============================================================ */

const foodData = {

    apple: {
        emoji: "🍎",
        name: "Maçã",
        healthy: true,
        energy: 15,
        points: 100
    },

    banana: {
        emoji: "🍌",
        name: "Banana",
        healthy: true,
        energy: 15,
        points: 100
    },

    carrot: {
        emoji: "🥕",
        name: "Cenoura",
        healthy: true,
        energy: 12,
        points: 100
    },

    broccoli: {
        emoji: "🥦",
        name: "Brócolis",
        healthy: true,
        energy: 15,
        points: 120
    },

    rice: {
        emoji: "🍚",
        name: "Arroz",
        healthy: true,
        energy: 12,
        points: 100
    },

    beans: {
        emoji: "🫘",
        name: "Feijão",
        healthy: true,
        energy: 15,
        points: 120
    },

    egg: {
        emoji: "🥚",
        name: "Ovo",
        healthy: true,
        energy: 12,
        points: 100
    },

    milk: {
        emoji: "🥛",
        name: "Leite",
        healthy: true,
        energy: 10,
        points: 80
    },

    burger: {
        emoji: "🍔",
        name: "Hambúrguer",
        healthy: false,
        energy: -10,
        points: 30
    },

    fries: {
        emoji: "🍟",
        name: "Batata frita",
        healthy: false,
        energy: -8,
        points: 30
    },

    pizza: {
        emoji: "🍕",
        name: "Pizza",
        healthy: false,
        energy: -10,
        points: 30
    },

    soda: {
        emoji: "🥤",
        name: "Refrigerante",
        healthy: false,
        energy: -12,
        points: 20
    },

    cookie: {
        emoji: "🍪",
        name: "Biscoito recheado",
        healthy: false,
        energy: -7,
        points: 20
    },

    candy: {
        emoji: "🍬",
        name: "Doce",
        healthy: false,
        energy: -6,
        points: 20
    }
};


/* ============================================================
   PLAYER
============================================================ */

class Player {

    constructor() {

        this.x = 150;
        this.y = 400;

        this.width = 46;
        this.height = 70;

        this.velocityX = 0;
        this.velocityY = 0;

        this.speed = 0.8;
        this.maxSpeed = 7;

        this.jumpForce = -15;

        this.gravity = 0.7;

        this.grounded = false;

        this.facing = 1;

        this.crouching = false;

        this.attacking = false;

        this.attackTimer = 0;

        this.invincible = false;

        this.invincibleTimer = 0;

        this.animationTimer = 0;
    }


    update() {

        this.handleInput();

        this.velocityY += this.gravity;

        this.velocityY = Math.min(
            this.velocityY,
            18
        );

        this.x += this.velocityX;

        this.y += this.velocityY;

        this.velocityX *= 0.82;

        this.checkPlatforms();

        this.handleWorldBounds();

        if (this.attackTimer > 0) {

            this.attackTimer--;

        } else {

            this.attacking = false;
        }

        if (this.invincibleTimer > 0) {

            this.invincibleTimer--;

        } else {

            this.invincible = false;
        }

        this.animationTimer++;
    }


    handleInput() {

        const left =
            keys["ArrowLeft"] ||
            keys["KeyA"];

        const right =
            keys["ArrowRight"] ||
            keys["KeyD"];

        const down =
            keys["ArrowDown"] ||
            keys["KeyS"];

        const jump =
            keys["ArrowUp"] ||
            keys["KeyW"] ||
            keys["KeyX"] ||
            keys["Space"];


        if (left) {

            this.velocityX -= this.speed;

            this.facing = -1;
        }


        if (right) {

            this.velocityX += this.speed;

            this.facing = 1;
        }


        this.velocityX = clamp(
            this.velocityX,
            -this.maxSpeed,
            this.maxSpeed
        );


        this.crouching = down && this.grounded;


        if (
            jump &&
            this.grounded
        ) {

            this.jump();
        }
    }


    jump() {

        this.velocityY = this.jumpForce;

        this.grounded = false;
    }


    attack() {

        if (this.attacking) return;

        this.attacking = true;

        this.attackTimer = 18;
    }


    getAttackBox() {

        return {

            x:
                this.facing === 1
                    ? this.x + this.width
                    : this.x - 55,

            y: this.y + 15,

            width: 55,

            height: 35
        };
    }


    checkPlatforms() {

        this.grounded = false;

        for (const platform of platforms) {

            if (
                this.velocityY >= 0 &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height >= platform.y &&
                this.y + this.height <=
                    platform.y + platform.height + this.velocityY + 5
            ) {

                this.y =
                    platform.y -
                    this.height;

                this.velocityY = 0;

                this.grounded = true;
            }
        }
    }


    handleWorldBounds() {

        if (this.x < 0) {

            this.x = 0;

            this.velocityX = 0;
        }

        const worldWidth =
            phases[currentPhase].width;

        if (
            this.x + this.width >
            worldWidth
        ) {

            this.x =
                worldWidth -
                this.width;
        }


        if (
            this.y >
            GAME_HEIGHT + 200
        ) {

            loseLife();
        }
    }


    takeDamage(amount = 1) {

        if (this.invincible) return;

        lives -= amount;

        energy -= 15;

        this.invincible = true;

        this.invincibleTimer = 90;

        this.velocityY = -8;

        updateHUD();

        if (lives <= 0 || energy <= 0) {

            gameOver();
        }
    }


    draw() {

        if (
            this.invincible &&
            Math.floor(this.invincibleTimer / 6) % 2 === 0
        ) {
            return;
        }


        const drawX = this.x - cameraX;

        const drawY = this.y;


        /* Corpo */

        ctx.fillStyle = "#f2b48b";

        ctx.fillRect(
            drawX + 12,
            drawY + 15,
            22,
            27
        );


        /* Cabeça */

        ctx.fillStyle = "#f5c39e";

        ctx.fillRect(
            drawX + 8,
            drawY,
            30,
            25
        );


        /* Cabelo */

        ctx.fillStyle = "#3a2419";

        ctx.fillRect(
            drawX + 8,
            drawY,
            30,
            7
        );


        /* Camisa */

        ctx.fillStyle = "#2f9d65";

        ctx.fillRect(
            drawX + 10,
            drawY + 23,
            26,
            25
        );


        /* Calça */

        ctx.fillStyle = "#28507a";

        ctx.fillRect(
            drawX + 11,
            drawY + 47,
            24,
            18
        );


        /* Pernas */

        ctx.fillStyle = "#20242a";

        ctx.fillRect(
            drawX + 8,
            drawY + 62,
            13,
            8
        );

        ctx.fillRect(
            drawX + 27,
            drawY + 62,
            13,
            8
        );


        /* Olhos */

        ctx.fillStyle = "#111";

        ctx.fillRect(
            drawX +
                (this.facing === 1 ? 28 : 12),
            drawY + 10,
            4,
            4
        );


        /* Braço */

        ctx.fillStyle = "#f2b48b";

        if (this.attacking) {

            ctx.fillRect(
                drawX +
                    (this.facing === 1 ? 31 : -20),
                drawY + 25,
                30,
                9
            );

        } else {

            ctx.fillRect(
                drawX +
                    (this.facing === 1 ? 32 : 2),
                drawY + 28,
                10,
                22
            );
        }


        /* Agachado */

        if (this.crouching) {

            ctx.fillStyle = "#28507a";

            ctx.fillRect(
                drawX + 7,
                drawY + 48,
                34,
                15
            );
        }


        /* Efeito do ataque */

        if (this.attacking) {

            const attack =
                this.getAttackBox();

            ctx.strokeStyle = "#ffe680";

            ctx.lineWidth = 5;

            ctx.beginPath();

            ctx.arc(
                attack.x - cameraX +
                    (this.facing === 1 ? 0 : attack.width),
                attack.y + 18,
                24,
                -0.8,
                0.8
            );

            ctx.stroke();
        }
    }
}


/* ============================================================
   INIMIGO
============================================================ */

class Enemy {

    constructor(x, type) {

        this.x = x;

        this.type = type;

        this.width = 55;

        this.height = 55;

        this.y = 0;

        this.velocityX = 0;

        this.velocityY = 0;

        this.gravity = 0.7;

        this.speed = 1.2;

        this.hp = 2;

        this.dead = false;

        this.hitTimer = 0;

        this.name =
            this.getName();

        this.info =
            this.getInfo();
    }


    getName() {

        const names = {

            tempo: "Falta de tempo",

            ultra: "Excesso de ultraprocessados",

            sedentarismo: "Sedentarismo",

            pular: "Pular refeições",

            planning: "Falta de planejamento",

            chef: "Chef da Rotina Corrida"
        };

        return names[this.type] || "Desafio";
    }


    getInfo() {

        const infos = {

            tempo:
                "Planejamento pode ajudar a organizar as refeições mesmo em dias corridos.",

            ultra:
                "A alimentação pode incluir diferentes alimentos. O ponto principal é observar variedade, equilíbrio e frequência.",

            sedentarismo:
                "Movimentar o corpo regularmente faz parte de um estilo de vida saudável.",

            pular:
                "Uma rotina alimentar organizada pode ajudar a evitar longos períodos sem se alimentar.",

            planning:
                "Planejar compras e refeições pode facilitar escolhas alimentares variadas.",

            chef:
                "Uma rotina corrida não precisa impedir escolhas equilibradas. Organização e flexibilidade podem ajudar."
        };

        return infos[this.type] || "";
    }


    update() {

        const distance =
            player.x - this.x;


        if (Math.abs(distance) < 600) {

            this.velocityX =
                Math.sign(distance) *
                this.speed;
        }


        this.x += this.velocityX;

        this.velocityY += this.gravity;

        this.y += this.velocityY;


        for (const platform of platforms) {

            if (
                this.velocityY >= 0 &&
                this.x + this.width >
                    platform.x &&
                this.x <
                    platform.x +
                    platform.width &&
                this.y + this.height >=
                    platform.y &&
                this.y + this.height <=
                    platform.y +
                    platform.height +
                    this.velocityY + 5
            ) {

                this.y =
                    platform.y -
                    this.height;

                this.velocityY = 0;
            }
        }


        if (
            rectsCollide(
                this,
                player
            )
        ) {

            if (player.attacking) {

                this.takeDamage();

            } else {

                player.takeDamage();
            }
        }


        if (this.hitTimer > 0) {

            this.hitTimer--;
        }
    }


    takeDamage() {

        if (this.hitTimer > 0) return;

        this.hp--;

        this.hitTimer = 20;

        this.velocityX =
            -player.facing * 7;

        this.velocityY = -7;

        if (this.hp <= 0) {

            this.dead = true;

            score += 250;

            showFloatingText(
                this.x,
                this.y,
                "+250 ⭐"
            );

            setTimeout(() => {

                showEnemyInfo(
                    this.name,
                    this.info
                );

            }, 200);
        }
    }


    draw() {

        const x =
            this.x - cameraX;

        const y =
            this.y;


        let emoji = "👾";


        if (this.type === "tempo") {
            emoji = "⏰";
        }

        if (this.type === "ultra") {
            emoji = "🍔";
        }

        if (this.type === "sedentarismo") {
            emoji = "🛋️";
        }

        if (this.type === "pular") {
            emoji = "😴";
        }

        if (this.type === "planning") {
            emoji = "📋";
        }

        if (this.type === "chef") {
            emoji = "👨‍🍳";
        }


        ctx.font = "48px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            emoji,
            x + this.width / 2,
            y + 45
        );


        if (this.type === "chef") {

            ctx.fillStyle = "#ffffff";

            ctx.font = "bold 14px Arial";

            ctx.fillText(
                "CHEF",
                x + this.width / 2,
                y - 10
            );
        }


        ctx.textAlign = "left";
    }
}


/* ============================================================
   ALIMENTO
============================================================ */

class Food {

    constructor(x, y, type) {

        this.x = x;

        this.y = y;

        this.width = 42;

        this.height = 42;

        this.type = type;

        this.data =
            foodData[type];

        this.collected = false;

        this.animation = random(
            0,
            Math.PI * 2
        );
    }


    update() {

        this.animation += 0.05;

        if (
            rectsCollide(
                this,
                player
            )
        ) {

            this.collect();
        }
    }


    collect() {

        if (this.collected) return;

        this.collected = true;

        energy = clamp(
            energy + this.data.energy,
            0,
            100
        );

        score += this.data.points;

        collectedFoods++;

        showFloatingText(
            this.x,
            this.y,
            this.data.healthy
                ? `+${this.data.energy} ⚡`
                : `${this.data.energy} ⚡`
        );

        updateHUD();


        if (energy <= 0) {

            gameOver();
        }
    }


    draw() {

        if (this.collected) return;


        const x =
            this.x - cameraX;

        const y =
            this.y +
            Math.sin(this.animation) * 5;


        ctx.font = "38px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            this.data.emoji,
            x + this.width / 2,
            y + 35
        );


        ctx.textAlign = "left";
    }
}


/* ============================================================
   PLATAFORMAS
============================================================ */

let platforms = [];


function createPlatforms() {

    platforms = [];


    const worldWidth =
        phases[currentPhase].width;


    /* Chão */

    platforms.push({

        x: 0,

        y: 640,

        width: worldWidth,

        height: 100
    });


    let x = 450;


    while (
        x <
        worldWidth - 700
    ) {

        const width =
            random(180, 350);

        const y =
            random(430, 570);

        platforms.push({

            x,
            y,
            width,
            height: 25
        });

        x +=
            width +
            random(100, 280);
    }


    /* Plataformas elevadas */

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        platforms.push({

            x:
                random(
                    300,
                    worldWidth - 500
                ),

            y:
                random(
                    280,
                    450
                ),

            width:
                random(
                    120,
                    260
                ),

            height: 22
        });
    }
}


/* ============================================================
   ENTIDADES
============================================================ */

let player;

let foods = [];

let enemies = [];

let floatingTexts = [];


/* ============================================================
   CRIAR FASE
============================================================ */

function createPhase() {

    player =
        new Player();

    foods = [];

    enemies = [];

    floatingTexts = [];

    cameraX = 0;

    createPlatforms();


    const phase =
        phases[currentPhase];


    /* ========================================================
       ALIMENTOS
    ======================================================== */

    let foodX = 500;


    for (
        let i = 0;
        i < 28;
        i++
    ) {

        const type =
            phase.foods[
                Math.floor(
                    Math.random() *
                    phase.foods.length
                )
            ];


        const platform =
            platforms[
                1 +
                Math.floor(
                    Math.random() *
                    (platforms.length - 1)
                )
            ];


        foods.push(
            new Food(
                platform.x +
                platform.width / 2,

                platform.y - 50,

                type
            )
        );


        foodX += 180;
    }


    /* ========================================================
       INIMIGOS
    ======================================================== */

    let enemyX = 900;


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const type =
            phase.enemies[
                Math.floor(
                    Math.random() *
                    phase.enemies.length
                )
            ];


        enemies.push(
            new Enemy(
                enemyX,
                type
            )
        );


        enemyX +=
            random(400, 700);
    }


    /* CHEFE */

    if (currentPhase === 3) {

        enemies.push(
            new Enemy(
                phase.width - 650,
                "chef"
            )
        );

        enemies[
            enemies.length - 1
        ].width = 100;

        enemies[
            enemies.length - 1
        ].height = 100;

        enemies[
            enemies.length - 1
        ].hp = 12;

        enemies[
            enemies.length - 1
        ].speed = 2;
    }


    updateHUD();
}


/* ============================================================
   CÂMERA
============================================================ */

function updateCamera() {

    const target =
        player.x -
        GAME_WIDTH * 0.4;


    cameraX +=
        (target - cameraX) *
        0.08;


    cameraX =
        clamp(
            cameraX,
            0,
            phases[currentPhase].width -
                GAME_WIDTH
        );
}


/* ============================================================
   FUNDO
============================================================ */

function drawBackground() {

    const theme =
        phases[currentPhase].theme;


    let skyTop;
    let skyBottom;


    if (theme === "morning") {

        skyTop = "#65c9f0";
        skyBottom = "#d8f3ff";

    } else if (theme === "city") {

        skyTop = "#547eaa";
        skyBottom = "#d4dbe5";

    } else if (theme === "park") {

        skyTop = "#79d0ef";
        skyBottom = "#e4f7d5";

    } else {

        skyTop = "#111d46";
        skyBottom = "#392d5c";
    }


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            GAME_HEIGHT
        );


    gradient.addColorStop(
        0,
        skyTop
    );

    gradient.addColorStop(
        1,
        skyBottom
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /* Sol */

    if (
        theme !== "night"
    ) {

        ctx.fillStyle =
            "#ffe680";

        ctx.beginPath();

        ctx.arc(
            1050,
            120,
            65,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* Montanhas */

    ctx.fillStyle =
        theme === "night"
            ? "#242847"
            : "#6eaa89";


    ctx.beginPath();

    ctx.moveTo(0, 600);

    for (
        let x = 0;
        x <= GAME_WIDTH;
        x += 100
    ) {

        const height =
            100 +
            Math.sin(
                (x + cameraX * 0.2) *
                0.01
            ) *
            60;

        ctx.lineTo(
            x,
            600 - height
        );
    }

    ctx.lineTo(
        GAME_WIDTH,
        GAME_HEIGHT
    );

    ctx.lineTo(
        0,
        GAME_HEIGHT
    );

    ctx.closePath();

    ctx.fill();
}


/* ============================================================
   DESENHAR PLATAFORMAS
============================================================ */

function drawPlatforms() {

    for (
        const platform of platforms
    ) {

        const x =
            platform.x - cameraX;


        if (
            x +
            platform.width <
                0 ||
            x >
                GAME_WIDTH
        ) {
            continue;
        }


        /* Grama */

        ctx.fillStyle =
            "#4f9b55";

        ctx.fillRect(
            x,
            platform.y,
            platform.width,
            8
        );


        /* Terra */

        ctx.fillStyle =
            "#805633";

        ctx.fillRect(
            x,
            platform.y + 8,
            platform.width,
            platform.height - 8
        );


        /* Detalhes */

        ctx.fillStyle =
            "#63432b";

        for (
            let i = 0;
            i <
            platform.width;
            i += 30
        ) {

            ctx.fillRect(
                x + i,
                platform.y + 13,
                8,
                5
            );
        }
    }
}


/* ============================================================
   TEXTOS FLUTUANTES
============================================================ */

function showFloatingText(
    x,
    y,
    text
) {

    floatingTexts.push({

        x,

        y,

        text,

        life: 60
    });
}


function updateFloatingTexts() {

    for (
        const text of floatingTexts
    ) {

        text.y -= 1;

        text.life--;
    }


    floatingTexts =
        floatingTexts.filter(
            text =>
                text.life > 0
        );
}


function drawFloatingTexts() {

    ctx.font =
        "bold 20px Arial";

    ctx.textAlign =
        "center";


    for (
        const text of floatingTexts
    ) {

        ctx.globalAlpha =
            text.life / 60;

        ctx.fillStyle =
            "#ffffff";

        ctx.fillText(
            text.text,
            text.x - cameraX,
            text.y
        );
    }


    ctx.globalAlpha = 1;

    ctx.textAlign =
        "left";
}


/* ============================================================
   HUD
============================================================ */

function updateHUD() {

    document.getElementById(
        "lives"
    ).textContent =
        lives;


    document.getElementById(
        "energy-value"
    ).textContent =
        Math.round(energy);


    document.getElementById(
        "energy-bar"
    ).style.width =
        `${clamp(energy, 0, 100)}%`;


    document.getElementById(
        "score"
    ).textContent =
        score;


    document.getElementById(
        "food-count"
    ).textContent =
        collectedFoods;


    document.getElementById(
        "phase-name"
    ).textContent =
        phases[currentPhase].name;
}


/* ============================================================
   INICIAR JOGO
============================================================ */

function startGame() {

    gameState =
        "PLAYING";

    currentPhase = 0;

    score = 0;

    energy = 100;

    lives = 3;

    collectedFoods = 0;

    gameWon = false;

    showScreen(
        "game-screen"
    );

    createPhase();

    requestAnimationFrame(
        gameLoop
    );
}


/* ============================================================
   PRÓXIMA FASE
============================================================ */

function nextPhase() {

    currentPhase++;

    if (
        currentPhase >=
        phases.length
    ) {

        victory();

        return;
    }


    energy =
        clamp(
            energy + 20,
            0,
            100
        );


    createPhase();

    showScreen(
        "game-screen"
    );
}


/* ============================================================
   TELA EDUCATIVA
============================================================ */

function showEducation() {

    gameState =
        "EDUCATION";


    const phase =
        phases[currentPhase];


    document.getElementById(
        "education-icon"
    ).textContent =
        phase.educationIcon;


    document.getElementById(
        "education-title"
    ).textContent =
        phase.educationTitle;


    document.getElementById(
        "education-text"
    ).textContent =
        phase.educationText;


    document.getElementById(
        "education-score"
    ).textContent =
        score;


    document.getElementById(
        "education-energy"
    ).textContent =
        Math.round(energy);


    document.getElementById(
        "education-foods"
    ).textContent =
        collectedFoods;


    const button =
        document.getElementById(
            "next-phase-button"
        );


    if (
        currentPhase ===
        phases.length - 1
    ) {

        button.textContent =
            "🏆 FINALIZAR JOGO";

    } else {

        button.textContent =
            "PRÓXIMA FASE →";
    }


    showScreen(
        "education-screen"
    );
}


/* ============================================================
   GAME OVER
============================================================ */

function gameOver() {

    if (
        gameState ===
        "GAMEOVER"
    ) {
        return;
    }


    gameState =
        "GAMEOVER";


    document.getElementById(
        "gameover-score"
    ).textContent =
        score;


    showScreen(
        "gameover-screen"
    );
}


/* ============================================================
   PERDER VIDA
============================================================ */

function loseLife() {

    lives--;

    player.x =
        Math.max(
            100,
            player.x - 250
        );

    player.y = 400;

    player.velocityY = 0;

    energy -= 10;

    updateHUD();


    if (
        lives <= 0 ||
        energy <= 0
    ) {

        gameOver();
    }
}


/* ============================================================
   VITÓRIA
============================================================ */

function victory() {

    gameState =
        "VICTORY";

    gameWon = true;


    document.getElementById(
        "victory-score"
    ).textContent =
        score;


    showScreen(
        "victory-screen"
    );
}


/* ============================================================
   MOSTRAR TELA
============================================================ */

function showScreen(
    screenId
) {

    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(screen => {

            screen.classList.remove(
                "active"
            );
        });


    document
        .getElementById(
            screenId
        )
        .classList.add(
            "active"
        );
}


/* ============================================================
   INFORMAÇÃO DO INIMIGO
============================================================ */

let infoTimeout;


function showEnemyInfo(
    title,
    text
) {

    clearTimeout(
        infoTimeout
    );


    const existing =
        document.getElementById(
            "enemy-info"
        );


    if (existing) {
        existing.remove();
    }


    const box =
        document.createElement(
            "div"
        );


    box.id =
        "enemy-info";


    box.innerHTML = `
        <strong>💡 ${title}</strong>
        <p>${text}</p>
    `;


    Object.assign(
        box.style,
        {

            position: "fixed",

            left: "50%",

            bottom: "110px",

            transform:
                "translateX(-50%)",

            width:
                "min(500px, 90%)",

            padding:
                "18px",

            borderRadius:
                "15px",

            background:
                "rgba(10, 35, 26, 0.95)",

            border:
                "2px solid #ffe680",

            color:
                "#ffffff",

            zIndex:
                "100",

            textAlign:
                "center",

            boxShadow:
                "0 10px 40px rgba(0,0,0,.4)"
        }
    );


    document.body.appendChild(
        box
    );


    infoTimeout =
        setTimeout(() => {

            box.remove();

        }, 4500);
}


/* ============================================================
   CHECAR FIM DA FASE
============================================================ */

function checkPhaseEnd() {

    const worldWidth =
        phases[currentPhase].width;


    if (
        player.x >
        worldWidth - 250
    ) {

        if (
            currentPhase === 3
        ) {

            const chef =
                enemies.find(
                    enemy =>
                        enemy.type ===
                        "chef"
                );


            if (
                chef &&
                !chef.dead
            ) {

                return;
            }
        }


        showEducation();
    }
}


/* ============================================================
   UPDATE
============================================================ */

function updateGame() {

    player.update();


    foods.forEach(
        food =>
            food.update()
    );


    enemies.forEach(
        enemy =>
            enemy.update()
    );


    enemies =
        enemies.filter(
            enemy =>
                !enemy.dead
        );


    updateFloatingTexts();

    updateCamera();

    checkPhaseEnd();
}


/* ============================================================
   DRAW
============================================================ */

function drawGame() {

    drawBackground();

    drawPlatforms();


    foods.forEach(
        food =>
            food.draw()
    );


    enemies.forEach(
        enemy =>
            enemy.draw()
    );


    player.draw();

    drawFloatingTexts();
}


/* ============================================================
   GAME LOOP
============================================================ */

function gameLoop() {

    if (
        gameState !==
        "PLAYING"
    ) {
        return;
    }


    ctx.clearRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    updateGame();

    drawGame();


    requestAnimationFrame(
        gameLoop
    );
}


/* ============================================================
   BOTÕES
============================================================ */

document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById(
        "instructions-button"
    )
    .addEventListener(
        "click",
        () => {

            showScreen(
                "instructions-screen"
            );
        }
    );


document
    .getElementById(
        "back-menu-button"
    )
    .addEventListener(
        "click",
        () => {

            gameState =
                "MENU";

            showScreen(
                "menu-screen"
            );
        }
    );


document
    .getElementById(
        "restart-button"
    )
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById(
        "gameover-menu-button"
    )
    .addEventListener(
        "click",
        () => {

            gameState =
                "MENU";

            showScreen(
                "menu-screen"
            );
        }
    );


document
    .getElementById(
        "next-phase-button"
    )
    .addEventListener(
        "click",
        nextPhase
    );


document
    .getElementById(
        "victory-restart-button"
    )
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById(
        "victory-menu-button"
    )
    .addEventListener(
        "click",
        () => {

            gameState =
                "MENU";

            showScreen(
                "menu-screen"
            );
        }
    );


/* ============================================================
   CONTROLES MOBILE
============================================================ */

function setupMobileButton(
    id,
    key
) {

    const button =
        document.getElementById(
            id
        );


    button.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            keys[key] = true;
        }
    );


    button.addEventListener(
        "pointerup",
        event => {

            event.preventDefault();

            keys[key] = false;
        }
    );


    button.addEventListener(
        "pointerleave",
        () => {

            keys[key] = false;
        }
    );
}


setupMobileButton(
    "left-btn",
    "ArrowLeft"
);


setupMobileButton(
    "right-btn",
    "ArrowRight"
);


setupMobileButton(
    "jump-btn",
    "Space"
);


document
    .getElementById(
        "attack-btn"
    )
    .addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            if (
                gameState ===
                "PLAYING"
            ) {

                player.attack();
            }
        }
    );


/* ============================================================
   PREVENIR ZOOM POR TOUCH
============================================================ */

document.addEventListener(
    "gesturestart",
    event => {

        event.preventDefault();
    }
);


/* ============================================================
   INICIALIZAÇÃO
============================================================ */

showScreen(
    "menu-screen"
);
```

