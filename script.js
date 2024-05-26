const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: canvas.height,
    color: "#FFF"
};

const user = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "#FFF",
    score: 0
};

const computer = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "#FFF",
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#05EDFF"
};

const drawRect = (x, y, w, h, color) => {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
};

const drawArc = (x, y, r, color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
};

const drawText = (text, x, y, color) => {
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text, x, y);
};

const drawNet = () => {
    drawRect(net.x, net.y, net.width, net.height, net.color);
};

const render = () => {
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawNet();
    drawText(user.score, canvas.width / 4, canvas.height / 5, "#FFF");
    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, "#FFF");
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
};

const collision = (b, p) => {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
};

const resetBall = () => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
};

const update = () => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? user : computer;

    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }

    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    computer.y += ((ball.y - (computer.y + computer.height / 2))) * 0.1;
};

const game = () => {
    update();
    render();
};

const movePaddle = (event) => {
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
};

canvas.addEventListener("mousemove", movePaddle);

const fps = 50;
setInterval(game, 1000 / fps);
