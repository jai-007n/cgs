// Two types of errors:
// 1. Payload (400)
// 2. Internal (500)

class BaseError {

    constructor(type=null) {
        this.error = {
            type,
            timestamp: Date.now()
        }
    };

};

export class PayloadError extends BaseError {

    constructor(key = null, msg = null, service = null) {
        super('payload');
        this.error.code = 400,
        this.error.messages = msg,
        this.error.key = key,
        this.error.service = service
    }

};

export class ValidationError extends BaseError {

    constructor(key = null, msg = null, service = null) {
        super('payload');
        this.error.code = 422,
            this.error.messages = msg,
            this.error.key = key,
            this.error.service = service
    }

};

export class InternalError extends BaseError {

    constructor(msg = null, service = null) {
        super('internal');
        this.error.code = 500,
        this.error.messages = ["Internal server error"],
        this.error.service = service;

        if (msg) {
            this.processMessages(msg)
        };
    }

    // Takes in msg (either a string, an array)
    processMessages = (msg) => {
        this.error.messages = 
            this.error.messages.concat(
                Array.isArray(msg) ? msg : [msg]
            )
    }

}
