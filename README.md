# Space Invaders Code: my Analysis #

## Adriano Gratani, 2024 ##

### About this Game ###

The original Space Invaders game was created in 1978 by Taito. Since then, is widely regared as one of the most iconic games.
It's a single player game. In the outer space. the player has to move his starship to avoid the projectiles of the invaders.
Invaders move in group, player can shoot and destroy them. It's a survival game, so there is no winning condition, only the final score matters.

My version of this classic game is made using Canvas and JavaScript. Canvas is a very user-friendly library for drawing and creating animations within HTML pages. 
I followed Object Oriented Programming principals for the logic of the game, and used sprites to render both the starship and the invaders. 
This game is definitely more advanced than Pacman in terms of loops, randomization and animations (explosion)

### Code ###

( Important:
  - In my analysis of Pong (README.md) I thoroughly explained: Classes, instances of Classes, methods and Canvas ContextAPI in general, and for Pacman I also explained Timeouts and Collision conditionals and javaScript in general.
I think It's not necesessary to repeat these concepts.

  - For Space invaders, I will focus more on explaining in details:
      - sprite rendering (generating Images, instead of drawing Canvas shapes)
      - how the garbage collector is made, and its purpose;
      - how the invaders' grid is randomly generated;
      - the logic behind the invaders' random shots;
   
  - The garbage colletion:
      Invaders and their grids, Invaders Projectiles, Player projectiles, exploding particles... we generate instances of each of them to be rendered on the screen. In order to access          their classes, initialize each of their properties (position and velocity for both axes, colors and sizes etc..) each frame, it costs MEMORY and COMPUTATION TIME. But when the            invader die or their projectiles falls out of the screen, or their exploding particles definitely fade away, what happens? Actually, we can't see them anymore, but each of these          things are still running in memory and performing tasks, and, most important, they STILL consume precious CPU memory.
      Over time, the array instances can grow really big as new instances get generated on random intervals, which means that the memory consumed gets bigger in size, this can make our         game running slower, so is better to definitely eliminate them from memory.
      We need some form of garbage collection. Garbage collection is a Memory management praxis, and in many languages such as Java is performed automatically. Also JavaScript periodically checks objects and variables which are no longer referenced in memory, and deallocates them from memory. But our situation is a bit different: we are using Canvas, and even though those instance disappeared and became 'useless', they are still referenced so JavaScript cannot detect them as 'garbage'. That's why we have to explicitly set the memory management for instances deallocation. 



