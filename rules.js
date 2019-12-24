const _ = require('lodash');

module.exports = _.merge({},
    require('./registration/registrationFormHandler'),
    require('./eligibleCouple/eligibleCoupleFollowupHandler'),
    require('./pregnancy/pregnancyEnrolmentHandler'),
    require('./pregnancy/ancFormHandler'),
    require('./pregnancy/deliveryFormHandler'),
    require('./pregnancy/abortionFormHandler'),
    require('./pregnancy/abortionFollowupHandler'),
    require('./pregnancy/motherPNCHandler'),
    require('./child/childEnrolmentHandler'),
    require('./child/childBirthFormHandler'),
    require('./child/childPNCHandler'),
    require('./child/childFollowupHandler'),
    require('./child/checklistRules'),
    require('./child/childDecisions'),
    require('./metadata/rules/visitScheduler'),
    require('./metadata/rules/viewFilters')
);
