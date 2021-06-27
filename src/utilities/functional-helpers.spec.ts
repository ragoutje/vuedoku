import {pushUnique, getRandomNumber, getRandomUniqueNumber, getRandomSudokuNumber} from './functional-helpers';

describe('FunctionalHelpers', function () {
    describe('pushUnique', function () {
        it('should return an array', function () {
            let result: number[] = [];
            result = pushUnique(result, 1);
            result = pushUnique(result, 2);
            result = pushUnique(result, 3);
            expect(result).toEqual([1, 2, 3]);
        });

        it('should return an array with unique values', function () {
            let result: string[] = [];
            result = pushUnique(result, 'a');
            result = pushUnique(result, 'b');
            result = pushUnique(result, 'a');
            expect(result).toEqual(['a', 'b']);
        });
    });

    describe('getRandomNumber', function () {
        function expectNumbersBetween(end: number, cycles: number, done: any) {
            let tooHigh: boolean = false;
            let tooLow: boolean = false;
            let min: boolean = false;
            let max: boolean = false;

            for(let i = 0; i < cycles; i++) {
                let nr = getRandomNumber(end);
                if (nr > end) tooHigh = true;
                if (nr < 1) tooLow = true;
                if (nr === end) max = true;
                if (nr === 1) min = true;
            }

            expect(tooHigh).toBe(false);
            expect(tooLow).toBe(false);

            expect(min).toBe(true);
            expect(max).toBe(true);

            done();
        }

        it('should generate numbers between start and end when set', done => {
            const end = 13;
            const cycles = 100;
            expectNumbersBetween( end, cycles, done);
        });

        it('should return 1 of the max is 1', function () {
            expect(getRandomNumber(1)).toBe(1);
        });
    });

    describe('getRandomSudokuNumber', function () {
        it('should return a number from the allowed array', function () {
            const result = getRandomSudokuNumber([1,2,3,4,5,6,7,8,9]);
            expect(result < 10 && result > 0).toBe(true);
        });

        it('should return the same value when there is only a single value in the allowed array', function () {
            expect(getRandomSudokuNumber([1])).toBe(1);
            expect(getRandomSudokuNumber([9])).toBe(9);
        });
    });

    // describe('getRandomUniqueNumber', function () {
    //     it('should return a number between 1 and 9', function () {
    //         const max = 9;
    //         const result = getRandomUniqueNumber([], max);
    //         expect(result > 0 && result <= max).toBe(true);
    //     });
    //
    //     it('should return only unique numbers', function () {
    //         const max = 9;
    //         const result = getRandomUniqueNumber([], max);
    //         expect(result).toBe(max);
    //     });
    //
    //     it('should return only numbers not already returned', function () {
    //         const max = 3;
    //         const tried = [1,2];
    //         const result = getRandomUniqueNumber(tried, max);
    //         expect(result).toBe(max);
    //     });
    //
    //     it('should return 0 when all possible numbers have been generated', function () {
    //         const max = 5;
    //         const tried = [1,2,3,4,5];
    //         const result = getRandomUniqueNumber(tried, max);
    //         expect(result).toBe(0);
    //     });
    // });
});