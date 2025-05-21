import { updateHighestScore, getHighestScore } from './js/scores.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let Score = 0;
let score = document.querySelector('.score') 
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
      // You can access user.uid or other user details here
    } else {
      console.log("No user is signed in.");
      // Redirect to login page if no user is signed in
      window.location.href = "index.html";
    }
  });

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

const friction = 0.99

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();

    }

    update() {
        this.draw();
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

//create new player
const player = new Player(x,y, 20,'white');



//draws player
player.draw();

//arrays
const projectiles = [];
const enemies = [];
const particles = [];

let enemySpawnInterval
//spawn enemies 
function spawnEnemies() {
    clearInterval(enemySpawnInterval);
    enemySpawnInterval = setInterval(() => {
        const radius = Math.random() * (30 - 8) + 8;

        let x;
        let y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }else{
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        );
    
        const velocity = {
            x: Math.cos(angle) * 2,
            y: Math.sin(angle) * 2
        }
        enemies.push(new Enemy(x, y, radius, color, velocity));


    }, 1000);
}

function gameEnd(){
    cancelAnimationFrame(animationId);
    enemies.length = 0;
    projectiles.length = 0;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid; // Get the user's unique ID

            // Retrieve the current highest score for the user
            getHighestScore(uid).then((highestScore) => {
                if (highestScore === null || Score > highestScore) {
                    // Update the database if the current score is higher
                    updateHighestScore(uid, Score);
                    document.querySelector('.HIGH').innerHTML = "HIGHEST SCORE: " + Score;
                } else {
                    document.querySelector('.HIGH').innerHTML = "HIGHEST SCORE: " + highestScore;
                }
            });
        } else {
            console.error("No user is signed in.");
        }
    });

    document.querySelector('.POINTS').innerHTML = Score;
    document.querySelector('.result').style.display = 'flex';
    

}

let animationId 

//animate
function animate() {
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0){
            particles.splice(particleIndex, 1)
        } else{
        particle.update()
        }
    })
    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update();

        if (projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ){
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1)
            }, 0);
        }
    })
    enemies.forEach((enemy, index) => {
        enemy.update();
        const dist = Math.hypot(
            player.x - enemy.x,
            player.y - enemy.y
        )

        //enemy touches player
        if (dist - enemy.radius - player.radius < 1){
            gameEnd()
        }



        projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(
                projectile.x - enemy.x,
                projectile.y - enemy.y
            )

            //projectile hits enemy
            if (dist - enemy.radius - projectile.radius < 1 ){

                //creates explosion
                for(let i = 0; i < enemy.radius * 2; i++){
                    particles.push(new Particle(
                        projectile.x, 
                        projectile.y, 
                        Math.random() * 2, 
                        enemy.color,
                        {
                            x:Math.random() - (0.5) * (Math.random() * 6),
                            y:Math.random() - (0.5) * (Math.random() * 6)
                        }
                    ))
                }

                if(enemy.radius - 10 > 5){
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0);
                } else{
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0);
                }
              
                Score += Math.floor(enemy.radius)
                score.innerHTML = "Score: " + Score


            }
        })

       
    })

    
}

addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    );

    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5,
        'white',
        velocity
    ));

    
})

gameEnd();

document.getElementById("Start").addEventListener('click', function(){

    document.querySelector('.result').style.display = 'none';
    Score = 0;
    score.innerHTML = "Score: " + Score;
    enemies.length = 0;
    projectiles.length = 0;
    spawnEnemies();
    animate();
})


