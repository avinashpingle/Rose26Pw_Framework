

export default class NoSuchUrlError extends Error {

    message: string;

    constructor(message: string) {
        super()
        this.message = message
    }


}