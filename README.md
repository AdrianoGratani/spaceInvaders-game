# Space Invaders Code: my Analysis #

## Adriano Gratani, 2024 ##

### About this Game ###

The original Space Invaders game was created in 1978 by Tomohiro Nishikado, for Taito. Since then, is widely regared as one of the most iconic games.
It's a single player game. In the outer space. the player has to move his starship to avoid the projectiles of the invaders.
Invaders move in group, player can shoot and destroy them. It's a survival game, so there is no winning condition, only the final score matters.
Player starship can only move towards left or right. Invaders move towards leftl-right and they advance against the player, to increase difficulty.

My version of this classic game is made using Canvas and JavaScript. Canvas is a very user-friendly library for drawing and creating animations within HTML pages. 
I followed Object Oriented Programming principals for the logic of the game, and used sprites to render both the starship and the invaders. 
This game is definitely more advanced than Pacman in terms of loops, randomization and animations (explosion)

### Code ###

Important:
  - In my analysis of Pong (README.md) I thoroughly explained: Classes, instances of Classes, methods and Canvas ContextAPI in general, and for Pacman I also explained Timeouts and Collision conditionals and javaScript in general.

  - I think It's not necesessary to repeat these concepts. For Space invaders, I will focus more on explaining in details:
      - sprite rendering (generating Images, instead of drawing Canvas shapes)
      - how the invaders' grid is randomly generated;
      - how the garbage collector is made, and its purpose;
      - the logic behind the invaders' random shots;
   
  - Sprite rendering:
      For the spaceship and invaders, we don't draw shapes (as we did for Pong and Pacman) using methods from the Canvas ContextAPI anymore. No `.restore()`, `.arc()`, `beginPath()`...
      Instead, we import an HTML `Image()` object into JavaScript and initialize its `.src` to a spefic image file in `./img`. (`Image()` can be considered just like an HTML tag, with same functionalities, but in Js.)
      Importing PNG files in our script can be 'delayed', while the code compilation goes slower, which means that in many cases our Canvas display everything but our png representation of the characters. To avoid this, we use the `image.onload` method (`image` is the const which stores the `Image().src`): this method calls an async, anonymous function, inside the scope we define the basic properties of the image, scaling, width, height etc.. Because it's async, the game 'waits' for this function for the rendering of the Canvas script.
      Important: the `update()` function, necessary to 'draw' the picture in the animation loop frame by frame, is crucial to double check if the async method effectively loaded the image: if the instance key `this.image` is true, the PNG has been loaded successfully. Only then, we can call the `draw()` function.
      `draw()` for the Starship class is different from the other games whose code I previously analysed. The Starship constructor has a special property, `rotation = 0` to add realism to Startship left-right movements. Its fallback value get changed/updated in the event listener, when the player moves in any direction.
      -  `draw()` calls `.save()` first = saves the context state, then updates `.globalAlpha` to the currenty `this.opacity` (in case the player loses: opacity goes to 0)
      - then uses `.translate()` to move the origin drawing point to the center of the player = we want to simulate the rotation.
      - at this point we can use `.translate()` to rotate the image rendering, according to the current value of `this.position` (in case a new value has been sent from event listeners, otherwise this call returns no changes at all.)
    
  - The garbage colletion:
      Invaders and their grids, Invaders Projectiles, Player projectiles, exploding particles... we generate instances of each of them to be rendered on the screen. In order to access          their classes, initialize each of their properties (position and velocity for both axes, colors and sizes etc..) each frame, it costs MEMORY and COMPUTATION TIME. But when the            invader die or their projectiles falls out of the screen, or their exploding particles definitely fade away, what happens? Actually, we can't see them anymore, but each of these          things are still running in memory and performing tasks, and, most important, they STILL consume precious CPU memory.
      Over time, the array instances can grow really big as new instances get generated on random intervals, which means that the memory consumed gets bigger in size, this can make our         game running slower, so is better to definitely eliminate them from memory.
      We need some form of garbage collection. In Computer Science, Garbage collection is a Memory management praxis, and in many languages such as Java is performed automatically. Also JavaScript periodically checks objects and variables which are no longer referenced in memory, and deallocates them from memory. But our situation is a bit different: we generate instances through Canvas, and even though those instance disappeared and became 'useless', they are still referenced, so that JavaScript cannot detect them as 'garbage'. That's why we have to explicitly set the memory management for instances deallocation. 



