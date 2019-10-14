const _ = require('lodash');

module.exports = _.merge({},
    require('./registration/registrationFormHandler'),
    require('./eligibleCouple/eligibleCoupleFollowupHandler'),
    require('./pregnancy/pregnancyEnrolmentHandler'),
    require('./pregnancy/ancFormHandler'),

);
