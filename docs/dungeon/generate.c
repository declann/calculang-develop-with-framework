// DN this one with added comments is what I used as a nice reference, by Joker-vD taken from:
// https://gist.githubusercontent.com/Joker-vD/cc5372a349559b9d1a3b220d5eaf2b01/raw/1d6d2b33ef973ba4430c7afa2d91304b3b767f31/generate.c
// rest is that file:

// Uncompressed version of
// https://gist.github.com/munificent/b1bcd969063da3e6c298be070a22b604

#include <time.h>    // Robert Nystrom
#include <stdio.h>   // @munificentbob
#include <stdlib.h>  //      for Ginny
#include <stdbool.h> //      2008-2019

const int HEIGHT = 40;
const int WIDTH = 80;
int FIELD[40][80];

#define IN_BOX(top, bottom, left, right) \
    for (int y = top; y < bottom; y++) \
        for (int x = left; x < right; x++)

int randInt(int upperBound) {
    return rand() % upperBound;
}

#define TILE_VOID           ' '
#define TILE_FLOOR          '.'
#define TILE_WALL           '#'
#define TILE_CORNER         '!'
#define TILE_OPEN_DOOR      '\''
#define TILE_CLOSED_DOOR    '+'
#define TILE_PLAYER         '@'


void cave(bool withPlayer) {
    // width, height, left and top are all inner
    // dimensions/coordinates (w/o walls)
    int width = randInt(10) + 5;    // from [5..14] range
    int height = randInt(6) + 3;    // from [3..8] range
    int left = randInt(WIDTH - width - 2) + 1;
    int top = randInt(HEIGHT - height - 2) + 1;

    // Check if the new cave (with walls) intersects with the interior of
    // any already existing cave. Touching walls/corners are okay
    IN_BOX(top - 1, top + height + 2, left - 1, left + width + 2)
        if (FIELD[y][x] == TILE_FLOOR) { return; }

    // Find a suitable place for a door
    int doorCounter = 0;
    int doorX, doorY;
    if (!withPlayer) {
        IN_BOX(top - 1, top + height + 2, left - 1, left + width + 2) {
            int atVerticalWall = (x < left) || (x > left + width);
            int atHorizontalWall = (y < top) || (y > top + height);
            int atWallButNotAtCorner = atVerticalWall ^ atHorizontalWall;

            // The door should not be created in the cave's corner or over
            // another door, or in another cave's corner. It's impossible
            // to make a cave without a door, because randInt(1) always
            // returns 0.
            if (atWallButNotAtCorner && FIELD[y][x] == TILE_WALL) {
                doorCounter++;
                if (randInt(doorCounter) == 0) {
                    doorX = x;
                    doorY = y;
                }
            }
        }

        // If the cave's walls were made completely out of corners
        // and doors, don't make such a cave
        if (doorCounter == 0) { return; }
    }

    // The cave looks okay, let's draw it. First, draw the walls and the floor
    IN_BOX(top - 1, top + height + 2, left - 1, left + width + 2) {
        bool atVerticalWall = (x < left) || (x > left + width);
        bool atHorizontalWall = (y < top) || (y > top + height);
        bool atCorner = atVerticalWall && atHorizontalWall;
        bool atWallButNotAtCorner = atVerticalWall ^ atHorizontalWall;

        // We need to somehow record corners of all caves to check
        // for intersections later, so we use a special tile for it
        FIELD[y][x] = atCorner
            ? TILE_CORNER
            : (atWallButNotAtCorner ? TILE_WALL : TILE_FLOOR);
    }

    // Now draw the door. The test is redundant, btw, because
    // of "if (doorCounter == 0) { return; }" earlier
    if (doorCounter > 0) {
        FIELD[doorY][doorX] = randInt(2) ? TILE_OPEN_DOOR : TILE_CLOSED_DOOR;
    }

    if (withPlayer) {
        // A cave with the player has only the player inside it
        FIELD[randInt(height) + top][randInt(width) + left] = TILE_PLAYER;
    }
    else {
        // A cave without the player has some random mobs and/or gold in it;
        // 1d6 of entities total, 25% chance of gold, 75% of a mob.
        // Mob letters range from 'A' to '~', inclusive
        for (int j = 0; j < randInt(6) + 1; j++) {
            FIELD[randInt(height) + top][randInt(width) + left] =
                randInt(4) == 0 ? '$' : 'A' + randInt('~' - 'A' + 1);
        }
    }
}

int main(int argc, const char* argv[]) {
    srand((int)time(((void *)0)));

    // Fill the field with the void
    IN_BOX(0, HEIGHT, 0, WIDTH) {
        FIELD[y][x] = TILE_VOID;
    }

    // A call to cave() is not guaranteed to actually make a new cave,
    // so call it many times
    for (int j = 0; j < 1000; j++) {
        cave(j == 0);
    }

    // Print the generated field
    IN_BOX(0, HEIGHT, 0, WIDTH) {
        int c = FIELD[y][x];
        // The cave corners should be drawn as walls
        putchar(c == TILE_CORNER ? TILE_WALL : c);
        if (x == WIDTH - 1) {
            printf("\n");
        }
    }
}