export class AiPlayer {
    constructor() {
        let availNumbers = [1, 2, 3, 4, 5, 6];
        this.possibleMoves = [];
        this.generatePossibleMoves(availNumbers, 4, [], this.possibleMoves);
    }

    generatePossibleMoves = (availNumbers, depth, variation, results) => {
        if (depth > 0) {
            for (let i = 0; i < availNumbers.length; i++) {
                let newBranch = variation.slice();
                newBranch.push(availNumbers[i]);
                this.generatePossibleMoves(availNumbers, depth - 1, newBranch, results)
            }
        } else {
            results.push(variation);
        }
    }

    makeMove = () => {
        let number = 0;
        number = Math.floor(Math.random() * this.possibleMoves.length);
        return this.possibleMoves[number];
    }

    getResult = (previous) => {
        const result = previous.splice(4, 4);
        let rightColor = 0, rightPlace = 0;
        for (let i = 0; i < result.length; i++) {
            if (result[i] === 1) {
                rightColor++;
            } else if (result[i] === 2) {
                rightPlace++;
            }
        }
        let isThisComboWrong = result.some((val) => val === 0);
        return { rightColor, rightPlace, isThisComboWrong };
    }

    filterOutPreviousAnswer = (previous) => {
        this.possibleMoves = this.possibleMoves.map((arr) => {
            if (previous[0] !== arr[0] || previous[1] !== arr[1]
                || previous[2] !== arr[2] || previous[3] !== arr[3])
                return arr;
            return null;
        }).filter((val) => val !== null);
    }

    filterOutSimilarCombinations = (previous) => {
        let copy = previous.slice();
        copy.sort();

        this.possibleMoves = this.possibleMoves.map((arr) => {
            let copyOfArray = arr.slice();
            copyOfArray.sort();
            if (copyOfArray[0] !== copy[0] || copyOfArray[1] !== copy[1]
                || copyOfArray[2] !== copy[2] || copyOfArray[3] !== copy[3])
                return arr;
            return null;
        }).filter((val) => val !== null);
    }

    filterOutOtherColorCombinations = (previous) => {
        let copy = previous.slice();
        copy.sort();

        this.possibleMoves = this.possibleMoves.map((arr) => {
            let copyOfArray = arr.slice();
            copyOfArray.sort();
            if (copyOfArray[0] === copy[0] && copyOfArray[1] === copy[1]
                && copyOfArray[2] === copy[2] && copyOfArray[3] === copy[3])
                return arr;
            return null;
        }).filter((val) => val !== null);
    }

    filterOutCombinationsOfColorMoreThanNumber = (color, number) => {
        this.possibleMoves = this.possibleMoves.map((arr) => {
            let count = 0;
            arr.forEach((val) => { if (val === color) count++ });
            if (count > number) {
                return null;
            }
            return arr;
        }).filter((val) => val !== null);
    }

    filterOutCombinationsWithPreviousColors = (previous) => {
        // No color exists, remove them all from possible moves
        this.possibleMoves = this.possibleMoves.map((arr) => {
            let hasAColorWhichNotMatches = arr.some((value) => {
                return (value === previous[0] || value === previous[1]
                    || value === previous[2] || value === previous[3])

            });
            return hasAColorWhichNotMatches ? null : arr;
        }).filter((val) => val !== null);
    }

    filterOutCombinationsWhereColorIsOnSamePosition = (previous) => {
        // None is on right place, possible to rule out all that has a color on same position.
        this.possibleMoves = this.possibleMoves.map((arr) => {
            if (arr[0] === previous[0] || arr[1] === previous[1]
                || arr[2] === previous[2] || arr[3] === previous[3])
                return null;
            return arr;
        }).filter((val) => val !== null);
    }

    filterOutImpossibleCombinations = (previous, number) => {
        // Combinations of colors that can not be a match
        this.possibleMoves = this.possibleMoves.map((arr) => {
            let copyOfArray = arr.slice();
            let copyOfPreviousAnswer = previous.slice();
            let count = 0;
            for (let i = 0; i < copyOfArray.length; i++) {
                for (let j = 0; j < copyOfPreviousAnswer.length; j++) {
                    if (copyOfArray[i] === copyOfPreviousAnswer[j]) {
                        count++;
                        copyOfPreviousAnswer.splice(j, 1);
                        break;
                    }
                }
            }
            return count > number || count < number ? null : arr;
        }).filter((val) => val !== null);
    };

    removeMoves = (previous) => {
        console.log("Possible moves BEFORE removal: ", this.possibleMoves.length);

        const { rightColor, rightPlace, isThisComboWrong } = this.getResult(previous);
        this.filterOutPreviousAnswer(previous);

        if (isThisComboWrong) {
            this.filterOutSimilarCombinations(previous);
        }

        if (rightColor === 0 && rightPlace === 0) {
            this.filterOutCombinationsWithPreviousColors(previous);
        } else if (rightPlace === 0) {
            this.filterOutCombinationsWhereColorIsOnSamePosition(previous);
        }

        if (rightColor + rightPlace === 4) {
            // right combination, remove all other combinations
            this.filterOutOtherColorCombinations(previous);
        } else if (rightColor + rightPlace > 0) {
            this.filterOutImpossibleCombinations(previous, rightColor + rightPlace);
        }

        console.log("Possible moves AFTER removal: ", this.possibleMoves.length);
    };
}