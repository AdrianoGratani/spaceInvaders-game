const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas');    const c = canvas.getContext('2d');   canvas.width = 1024;   canvas.height = 576
let game = {  over: false,  active: true  };    let score = 0;

//////////// CLASSES for player and projectile;   invaderProjectile invader and grid;
class Player {  constructor() { this.velocity = { x: 0, y: 0 };  this.rotation = 0;  this.opacity = 1;
        const image = new  Image();  image.src = './img/spaceship.png';
        image.onload = () => {      
            const scale = .15;  this.image = image;  this.width = image.width * scale;  this.height = image.height * scale;
            this.position = {  x: canvas.width / 2 - this.width / 2,  y: canvas.height - this.height * 2  }
        }
    }
    draw() {  c.save();   c.globalAlpha = this.opacity;   
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate( this.rotation)
        c.translate(- player.position.x - player.width / 2, -player.position.y - player.height / 2)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }
    update() {  if (this.image) { this.draw(); this.position.x += this.velocity.x; }  }  // update player's image rendering and position based on movement
}

class Projectile {  constructor({position, velocity}) {  this.position = position;  this.velocity = velocity;  this.radius = 2;  }
    draw() {  c.beginPath();  c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);  c.fillStyle = 'red';  c.fill();  c.closePath(); }
    update() {  this.draw();   this.position.x += this.velocity.x;   this.position.y += this.velocity.y;  }
}

class InvaderProjectile {   constructor({position, velocity}) { this.position = position; this.velocity = velocity; this.width = 3; this.height = 10; } 
draw() { c.fillStyle = 'white'; c.fillRect(this.position.x, this.position.y, this.width, this.height)}
update() { this.draw(); this.position.x += this.velocity.x; this.position.y += this.velocity.y }
}

class Particle {  constructor({position, velocity, radius, color, fades}) {
        this.opacity = 1; this.position = position; this.velocity = velocity;  this.radius = radius; this.color = color; this.fades = fades; }
    draw() {  c.save();  c.globalAlpha = this.opacity;   c.beginPath();  c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);  c.fillStyle = this.color;  c.fill();  c.closePath();  c.restore();  }
    update() {  this.draw();  this.position.x += this.velocity.x;  this.position.y += this.velocity.y;   if (this.fades) {  this.opacity -= 0.01  }  }
}

class Invader{  constructor({position}) {  this.velocity = {  x: 0,  y: 0 };  // velocity set to 0 = invader doesn't moved, it 'gets moved' by its grid container.
        const image = new  Image();  image.src = './img/invader.png'; 
        image.onload = () => {  const scale = 1;  this.image = image;  this.width = image.width * scale;  this.height = image.height * scale;
            this.position = {  x: position.x,  y: position.y  };
        }
    }
    draw() {  c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)  }
    // each invader moves in sync with the grid container. so the instance inherits the grid velocity as argument.
    update({velocity}) {  if (this.image) {  this.draw();  this.position.x += velocity.x;  this.position.y += velocity.y;  };  };
    shoot(invaderProjectiles) {  invaderProjectiles.push(new InvaderProjectile({  position: {  x: this.position.x + this.width / 2,  y: this.position.y + this.height},  velocity: {  x: 0, y: 5 }  })) }
}

// the Grid class is a container for invaders. position 0 on both axis: it starts always at the beginning of our Canvas. 
// random row-cols size, random velocity on x-axis: the y-axis gets updated on conditional boundary detection only, not from constructor.
class Grid {    constructor() {  this.position = {  x: 0, y: 0  };  this.velocity = { x: (Math.random() * 3) + 1.5, y: 0 }
// the grid class ITSELF generates the instance array for the invaders. 
    this.invaders = [];     const columns = Math.floor(Math.random() * 10 + 3);      const rows = Math.floor(Math.random() * 7 + 3);      
    this.width = columns * 30
        for (let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){     this.invaders.push(new Invader({  position: {  x: i * 30,  y: j * 30 }}))   }
        }
    }
    update() {      this.position.x += this.velocity.x;    this.position.y += this.velocity.y;    this.velocity.y = 0;
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {   this.velocity.x = -this.velocity.x;   this.velocity.y = 30;  }
    }
}

/////////////// class instances, arrays for instances, frame counter, key check
const player = new Player();    const projectiles = [];    const grids = [];    const invaderProjectiles = [];    const particles = [];  // invaders instance container is managed within the Grid class.
let frames = 0
let randomInterval =  Math.floor(Math.random() * 400) + 250
const keys = {  a: { pressed: false },  d: { pressed: false }  }

// logic for stars as background animation, use particles:
for (let i = 0; i < Math.floor(Math.random() * 500 + 350); i++) {
    particles.push(new Particle({  position: { x: Math.random() * canvas.width, y: Math.random() * canvas.height},    velocity: { x: Math.random() * 0.1, y: Math.random() - 0.5},  radius: Math.random() * 1.1,  color: 'white'}))
}

// logic for explosion animations, both ship and invaders, object is the instance exploded, you send it as arg and you can use its position to locat the explosion:
function createParticles({object, color, fades}) {
    for (let i = 0; i < Math.floor(Math.random() * 10 + 2); i++) {
        particles.push(new Particle({   position: {  x: object.position.x + object.width / 2,  y: object.position.y + object.height / 2  },  velocity: {  x: Math.random() - 0.3,  y: Math.random() - 0.3  },
            radius: Math.random() * 3,  color: color || '#baa0de',  fades: fades}))
    }
}

/////////////////
// ANIMATION LOOP   losing condition, rendering particles, stars, ship, bullets, garbage collection etc
// Canvas renders the black background space in the animation loop.
function animate() {    if (!game.active) return;    
    window.requestAnimationFrame(animate);     c.fillStyle = 'black';    c.fillRect(0, 0, canvas.width, canvas.height);    //canvas color;
    player.update();     // player instance rendering;
    particles.forEach((particle, i) => {   // we need second argument `i` to position each particle in the canvas 
                                           // particles rendering: works for BOTH stars and explosions;
        if (particle.position.y - particle.radius >= canvas.height){  particle.position.x = Math.random() * canvas.width;  particle.position.y = -particle.radius;  }   // stars reappearence position logic
        else if (particle.position.y + particle.radius <= 0){  particle.position.x = Math.random() * canvas.width;  particle.position.y = canvas.height + particle.radius; }

            // opacity gets updated only for explosion particles, the starts only have opacity = 1
        if (particle.opacity <= 0){ setTimeout(() => { particles.splice(i, 1)}, 0)}   else { particle.update() }        // garbage collect || update based on instance opacity
    })     // console.log(particles)

    invaderProjectiles.forEach((invaderProjectile, invProIndex) => {   if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {  invaderProjectiles.splice(invProIndex, 1)  }, 0)    // garbage collect invader projectiles out of the screen;
        } else {  invaderProjectile.update()  }
        
        if (  invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width ) 
            {   // GAME LOST
                createParticles({   object: player,  color: 'white',  fades: true  })
                setTimeout(() => {   invaderProjectiles.splice(invProIndex, 1);  player.opacity = 0;  game.over = true;  }, 0)
                setTimeout(() => {   game.active = false;  if (score <= 1000) {  scoreEl.innerHTML = score + ', well... try again!'} else if (score > 1000 && score <= 3000) {  scoreEl.innerHTML = score + ', nice!!!'} else if (score > 3000 && score <= 10000){  scoreEl.innerHTML = score + ', ACE gamer!!!'} else if (score > 10000 && score <= 50000) {  scoreEl.innerHTML = score + ', the KING of the space!!!'} else if (score >= 100000) {  scoreEl.innerHTML = score + ', the CHAMP: more than 1000 killings!!!!!!!!!!'}  }, 2000)
            }
        })// console.log(invaderProjectiles)

    projectiles.forEach((projectile, index) => {  if (projectile.position.y + projectile.radius <= 0) {  setTimeout(() => {  projectiles.splice(index, 1)  }, 0)}    else {projectile.update()}  })       // projectile - rendering / garbage collector for your ship projectiles[]

    // rendering for invaders - grid - projectiles / shooting / collision / particles - garbage collectors;   STRUCTURE: (grids>>invaders>>projectiles)
    grids.forEach((grid, i) => {  grid.update()
        if (frames % Math.floor((Math.random() * 20) + 30) === 0 && grid.invaders.length > 0) {        // invader projectile SHOOTING animation
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)  }

        // invader and playerProjectile rendering, etc.
        grid.invaders.forEach((invader, j) => {  invader.update({velocity: grid.velocity})
            projectiles.forEach((projectile, index) => {
                 if (  projectile.position.y - projectile.radius <= invader.position.y + invader.height &&  projectile.position.x - projectile.radius >= invader.position.x &&
                    projectile.position.x + projectile.radius <= invader.position.x + invader.width &&  projectile.position.y + projectile.radius >= invader.position.y  )
                    {  // projectile - invader collision conditional:
                        setTimeout(() => {  
                            const invaderFound = grid.invaders.find((invader2) => {  return invader2 === invader;  })
                            const projectileFound = projectiles.find((projectile2) => {  return projectile2 === projectile;  })

                            if(invaderFound && projectileFound) {
                                createParticles({   object: invader,   fades: true  })
                                grid.invaders.splice(j, 1); 
                                projectiles.splice(index, 1);
                                
                                if (grid.invaders.length > 0) {   // grid resizing or garbage-collection;
                                    const firstInvader = grid.invaders[0];
                                    const lastInvader = grid.invaders[grid.invaders.length - 1];
                                    grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                    grid.position.x = firstInvader.position.x;
                                } else {   grids.splice(i, 1)   }

                                score += 100;   scoreEl.innerHTML = score;
                            }
                        }, 0)
                    }
            })
        })
    })
    ///// player MOVEMENT
    if (keys.a.pressed && player.position.x >= 0) { player.velocity.x = -7; player.rotation = -.15;} 
    else if (keys.d.pressed && player.position.x + player.width <= canvas.width) { player.velocity.x = 7; player.rotation = .15} 
    else { player.velocity.x = 0; player.rotation = 0 }

    if (frames % randomInterval === 0) {  grids.push(new Grid());  randomInterval =  Math.floor(Math.random() * 400) + 250;   frames = 0;  }    // grid randomizer
    frames++
}
animate()

window.addEventListener('keydown', ({key}) => {      if (game.over) return;       // event listener for player movements and shooting
    switch(key) {
        case 'a': keys.a.pressed = true; break;
        case 'd': keys.d.pressed = true; break;
        case ' ': break;
    }
})
window.addEventListener('keyup', ({key}) => {
    switch(key) {
        case 'a': keys.a.pressed = false; break;
        case 'd': keys.d.pressed = false; break;
        case ' ': projectiles.push(new Projectile({  position: { x: player.position.x + player.width / 2, y: player.position.y },  velocity: { x: 0, y: -30 }  }));  break;  // console.log(projectiles)
    }
})
