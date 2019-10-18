const _ = require('lodash');

module.exports = _.merge({},
    require('./registration/registrationFormHandler'),
    require('./eligibleCouple/eligibleCoupleFollowupHandler'),
    require('./pregnancy/pregnancyEnrolmentHandler'),
    require('./pregnancy/ancFormHandler'),
    require('./pregnancy/deliveryFormHandler'),
    require('./pregnancy/abortionFormHandler'),
    require('./pregnancy/abortionFollowupHandler'),
    require('./child/childEnrolmentHandler.js'),
    require('./child/childBirthFormHandler.js')
);
