const _ = require('lodash');

module.exports = _.merge({},
    require('./registration/registrationFormHandler'),
    require('./eligibleCouple/eligibleCoupleFollowupHandler'),
    require('./pregnancy/pregnancyEnrolmentHandler'),
    require('./pregnancy/ancFormHandler'),
    require('./pregnancy/deliveryFormHandler'),
    require('./pregnancy/abortionFormHandler'),
<<<<<<< HEAD
    require('./pregnancy/abortionFollowupHandler'),
    require('./child/childEnrolmentHandler.js')

=======
    require('./child/childEnrolmentHandler.js'),
    require('./child/childBirthFormHandler.js')
>>>>>>> 6afdd7873f0dec3d649eeceefc76b47041ec1d1f
);
