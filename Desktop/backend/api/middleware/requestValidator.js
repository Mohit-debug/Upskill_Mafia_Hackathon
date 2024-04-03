const { query, body, header, validationResult } = require("express-validator");


const validateLoginDetail = () => {
    return [
        body("email")
            .exists()
            .withMessage("emial missing")
            .withMessage("emial could not be empty."),
        body("username")
            .exists()
            .withMessage("userName missing")
            .withMessage("User Name could not be empty."),
        body("password")
            .exists()
            // .length(8)
            .withMessage("password missing")
            .withMessage("password could not be empty and must have 8 character."),
        body("phonenumber")
            .exists()
            .withMessage("phonenumber missing")
            .withMessage("phonenumber could not be empty."),
        body("address")
            .exists()
            .withMessage("phonenumber missing")
            .withMessage("phonenumber could not be empty."),
    ];
};


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return res.status(422).json({
        errors: errors.array(),
    });
};

module.exports = {
    validateLoginDetail,
    validate,
};
