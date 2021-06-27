export interface Notes {
    1: boolean,
    2: boolean,
    3: boolean,
    4: boolean,
    5: boolean,
    6: boolean,
    7: boolean,
    8: boolean,
    9: boolean,
}

export interface Cell {
    row: number,
    col: number,
    initialValue: number,
    value: number,
    notes: Notes,
}

export interface Grid extends Array<Cell>{}

export const notesTemplate: Notes = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
};

export const cellTemplate: Cell = {
    row: 1,
    col: 1,
    value: 0,
    initialValue: 0,
    notes: { ...notesTemplate },
}
