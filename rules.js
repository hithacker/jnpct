const _ = require('lodash');

module.exports = _.merge({},
    require('./registration/registrationFormHandler'),
    require('./eligibleCouple/eligibleCoupleFollowupHandler'),
    require('./pregnancy/pregnancyEnrolmentHandler'),
    require('./pregnancy/ancFormHandler'),
    require('./pregnancy/deliveryFormHandler'),
    require('./pregnancy/abortionFormHandler'),
    require('./pregnancy/abortionFollowupHandler'),
    require('./pregnancy/motherPNCHandler.js'),
    require('./child/childEnrolmentHandler.js'),
    require('./child/childBirthFormHandler.js'),
    require('./child/childPNCHandler.js'),
    require('./child/childFollowupHandler.js'),
    require('./child/checklistRules.js')
);
