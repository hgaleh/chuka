export class Ex02Error extends Error {
    constructor(message?: string) {
        super(message);
    }

    httpStatusCode!: number;
}