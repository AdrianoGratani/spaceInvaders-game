# Space Invaders Code: my Analysis #

## Adriano Gratani, 2024 ##

### About this Game ###

The original Space Invaders game was created in 1978 by Taito. Since then, is widely regared as one of the most iconic games.
It's a single player game. In the outer space. the player has to move his starship to avoid the projectiles of the invaders.
Invaders move in group, player can shoot and destroy them. It's a survival game, so there is no winning condition, only the final score matters.

### Code ###

( Important:
  - In my analysis of Pong (README.md) I thoroughly explained: Classes, instances of Classes, methods and Canvas ContextAPI in general, and for Pacman I also explained Timeouts and Collision conditionals and javaScript in general.
I think It's not necesessary to repeat these concepts.

  - For Space invaders, I will focus more on explaining in details:
      - sprite rendering (generating Images, instead of drawing Canvas shapes)
      - how the garbage collector is made and its purpose);
      - how the invaders' grid is randomly generated;
      - the logic behind the invaders' random shots;

My version of this classic game is made using Canvas and JavaScript. Canvas is a very user-friendly library for drawing and creating animations within HTML pages. 
I followed Object Oriented Programming principals for the logic of the game, and used sprites to render both the starship and the invaders. 
This game is definitely more advanced than Pacman in terms of loops, randomization and animations (explosion)
