import append from "ramda/src/append";
import contains from "ramda/src/contains";
import dec from "ramda/src/dec";
import includes from "ramda/src/includes";

export const pushUnique = (arr: any[], val: any): any[] => contains(val, arr) ? [...arr] : append(val, arr);

export const getRandomNumber = (max: number = 9): number => Math.floor(Math.random() * max) + 1;

export const getRandomUniqueNumber = (tried: number[] = [], max: number = 9): number => {
    if (tried.length === max) return 0;

    const nr = getRandomNumber(max);
    const usedNrs = pushUnique(tried, nr);

    return includes(nr, tried) ? getRandomUniqueNumber(usedNrs, max) : nr;
}

export const getRandomSudokuNumber = (allowed: number[] = [1,2,3,4,5,6,7,8,9]) => allowed[dec(getRandomNumber(allowed.length))];
