# Space Invaders Code: my Analysis #

## Adriano Gratani, 2024 ##

### About this Game ###

The original Space Invaders game was created in 1978 by Tomohiro Nishikado, for Taito. Since then, is widely regared as one of the most iconic games.
It's a single player game. In the outer space. the player has to move his starship to avoid the projectiles of the invaders.
Invaders move in group, player can shoot and destroy them. It's a survival game, so there is no winning condition, only the final score matters.
Player starship can only move towards left or right. Invaders move towards leftl-right and they advance against the player, to increase difficulty.

My version of this classic game is made using Canvas and JavaScript. Canvas is a very user-friendly library for drawing and creating animations within HTML pages. 
I followed Object Oriented Programming principals for the logic of the game, and used sprites to render both the starship and the invaders. 
This game is definitely more advanced than Pacman in terms of iits use of Canvas, loops, randomization and animations (for explosion).

### Code ###

Important:
  - In my analysis of Pong (README.md) I thoroughly explained: Classes, instances of Classes, methods and Canvas ContextAPI in general, and for Pacman I also explained Timeouts and Collision conditionals and javaScript in general.

  - I think It's not necesessary to repeat these concepts. For Space invaders, I will focus more on explaining in details:
      - sprite rendering (generating Images, instead of drawing Canvas shapes)
      - how the invaders' grid is randomly generated;
      - how the garbage collector is made, and its purpose;
      - the logic behind the invaders' random shots;
   
  - Sprite rendering
      For the spaceship and invaders, we don't draw shapes (as we did for Pong and Pacman) using methods from the Canvas ContextAPI anymore. No `.restore()`, `.arc()`, `beginPath()`...
      Instead, we import an HTML `Image()` object into JavaScript and initialize its `.src` to a spefic image file in `./img`. (`Image()` can be considered just like an HTML tag, with same functionalities, but in Js.)
      Importing PNG files in our script can be 'delayed', while the code compilation goes slower, which means that in many cases our Canvas display everything but our png representation of the characters. To avoid this, we use the `image.onload` method (`image` is the const which stores the `Image().src`): this method calls an async, anonymous function, inside the scope we define the basic properties of the image, scaling, width, height etc.. Because it's async, the game 'waits' for this function for the rendering of the Canvas script.
      Important: the `update()` function, necessary to 'draw' the picture in the animation loop frame by frame, is crucial to double check if the async method effectively loaded the image: if the instance key `this.image` is true, the PNG has been loaded successfully. Only then, we can call the `draw()` function.
      `draw()` for the Starship class is different from the other games whose code I previously analysed. The Starship constructor has a special property, `rotation = 0` to add realism to Startship left-right movements. Its fallback value get changed/updated in the event listener, when the player moves in any direction.
      -  `draw()` calls `.save()` first = saves the context state, then updates `.globalAlpha` to the currenty `this.opacity` (in case the player loses: opacity goes to 0)
      - then uses `.translate()` to move the origin drawing point to the center of the player = we want to simulate the rotation.
      - at this point we can use `.translate()` to rotate the image rendering, according to the current value of `this.position` (in case a new value has been sent from event listeners, otherwise this call returns no changes at all.)
      - we previously translated the origin point to the center of player instance, now it's time to render the image using `.drawImage()`, but before we translate the origin point back to `this.position` on x and y axis.
        (imagine `.translate()` like a pen, you just moved the pen from the center of the player (you were there to simulate the rotation), back to the origin point (to draw the image). If you try to use `drawImage()` WITHOUT translating back to the previous position, the image would be offset by half of its size.)
      - now `restore()` the state of the context. After translating the rotation, drawing image etc. we go back to the saved state. Next frame, `update()` is called again, and the restored stated is ready to be saved again, in loop...
      (the necessity of using `save()`, and `restore()` to the saved state after some modifications, can be tricky. Imagine using a Miyazaki movie, where everything is created on paper.
       the context is the white paper and the tools to draw are Context methods. after drawing the first frame of the animation, you cannot draw the next frame over the previous one, instead, you 'clean', or 'restore' the context, by taking a new piece of paper, which means you restore the state of the paper to the initial context.)

  - Grids: Invaders container:
    - The original game generates multiple opponents, which are distributed across rows and columns. As a result,the movement for each of them appears highly sinchronized.
    - Instead of instantiating each invader separately, we create a class `Grid`, with random position, velocity, and rows and columns,    and we generate the Invader instance array INSIDE the grid.
      A grid is basically a 2D array, we use nested loops to push the Invaders inside it. (positioning of each invaders is quite straightforward. Nested loop uses two iterators `i` (outer = rows) and `j` (inner = cols), to render each one we just multiply fallback width and height for these values )

  - Invader shooting logic:
    - `shoot()` method pushes a projectile instance in the projectiles arrays. By default a projectiles takes the position of the invaders which shoots, and can move only towards negative-y.
    - The shooter is randomly chosen from the invaders array,
    Here a semplified verion in pseudo-code
    - Animation() --> Grids intance array forEach(grid): random shooter method --> single Grid instance: update() invader rendering. 
    
  - The garbage collection:
      - Invaders and their grids, Invaders Projectiles, Player projectiles, exploding particles... we generate instances of each of them to be rendered on the screen. In order to access          their classes, initialize each of their properties (position and velocity for both axes, colors and sizes etc..) each frame, it costs MEMORY and COMPUTATION TIME. But when the            invader die or their projectiles falls out of the screen, or their exploding particles definitely fade away, what happens? Actually, we can't see them anymore, but each of these things are still running in memory and performing tasks, and, most important, they STILL consume precious CPU memory.
      - Over time, the array instances can grow really big as new instances get generated on random intervals, which means that the memory consumed gets bigger in size, this can make our         game running slower, so is better to definitely eliminate them from memory.
      - We need some form of garbage collection. In Computer Science, Garbage collection is a Memory management praxis, and in many languages such as Java is performed automatically. Also JavaScript periodically checks objects and variables which are no longer referenced in memory, and deallocates them from memory. But our situation is a bit different: we generate instances through Canvas, and even though those instance disappeared and became 'useless', they are still referenced, so that JavaScript cannot detect them as 'garbage'. That's why we have to explicitly set the memory management for instances deallocation. 
