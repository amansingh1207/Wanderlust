class ExpressError extends Error {
    constructor(statuscode, message) {
        super();
        this.statuscode = statuscode;
        this.message = message;
    }
}

module.exports = ExpressError;

// class ExpressError extends Error {
//     constructor(message, statusCode) {
//         super(message); // ✅ pass the message to the Error constructor
//         this.statusCode = statusCode; // ✅ naming convention: use camelCase
//     }
// }

// module.exports = ExpressError;
