const requestConfigs = require('../config/nasaRequestConfig');
const constants = require('../config/constants');

/**
 * Validates if a string is actual
 * date and in the YYYY-MM-DD format.
 * @param {string} date The string to validate.
 * @returns {boolean}
 */
function validateDate(date) {
    let isValidDate = true;
    const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    let isDateInValidFormat = datePattern.test(date);
    if (isDateInValidFormat) {
        let dateDetails = date.split('-');
        let year = parseInt(dateDetails[0]);
        let month = parseInt(dateDetails[1]);
        let day = parseInt(dateDetails[2]);

        if (month === 4 || month === 6 || month === 9 || month === 11) {
            // April, June, September, and November don't have more than 30 days.
            if (day > 30) {
                isValidDate = false;
            }
        } else if (month === 2) {
            // Check if it's a leap year.
            if ((year % 4 === 0) && (year % 100 !== 0) || (year % 400 === 0)) {
                if (day > 29) {
                    isValidDate = false;
                }
            } else {
                if (day > 28) {
                    isValidDate = false;
                }
            }
        }
    } else {
        isValidDate = false;
    }

    return isValidDate;
}

/**
 * Builds the request path by using the provided query parameters.
 * @param {object} req The request object.
 * @returns {string} The result of the path used to make the request to the API.
 */
function buildRequestPath(req) {
    let path = requestConfigs.pathBase + '?api_key=' + requestConfigs.apiKey;

    if (req.query.dateStart) {
        path += '&start_date=' + req.query.dateStart;
    }

    if (req.query.dateEnd) {
        path += '&end_date=' + req.query.dateEnd;
    }

    return path;

}

function validateQueryParameters(req) {
    let validationResult = {};

    if (!req.query.within) {
        validationResult.valid = false;
        validationResult.statusCode = constants.statusCode400;
        validationResult.response = {
            error: true,
            message: 'Please provide a "within" parameter to define range of search.'
        }
    } else if (req.query.within) {
        let rangeKilometers = Number(req.query.within);
        if (isNaN(rangeKilometers)) {
            validationResult.valid = false;
            validationResult.statusCode = constants.statusCode400;
            validationResult.response = {
                error: true,
                message: 'The value of "within" parameter should be numeric'
            }
        } else {
            validationResult.valid = true;
            validationResult.rangeKilometers = rangeKilometers;
        }
    }

    if (req.query.dateEnd && validationResult.valid === true) {
        if (!req.query.dateStart) {
            validationResult.valid = false;
            validationResult.statusCode = constants.statusCode400;
            validationResult.response = {
                error: true,
                message: 'Please provide a "dateStart" parameter to define range of dates for the search'
            }
        } else {
            let isStartDateValid = validateDate(req.query.dateStart);
            let isEndDateValid = validateDate(req.query.dateEnd);
            if (!isStartDateValid || !isEndDateValid) {
                validationResult.valid = false;
                validationResult.statusCode = constants.statusCode400;
                validationResult.response = {
                    error: true,
                    message: 'Wrong date! The date(s) should be in the YYYY-MM-DD format or non leap year(s) ' +
                        'is provided (check days for February)'
                }
            }
        }
    }

    return validationResult;
}

module.exports = {
    validateDate: validateDate,
    buildRequestPath: buildRequestPath,
    validateQueryParameters: validateQueryParameters
}