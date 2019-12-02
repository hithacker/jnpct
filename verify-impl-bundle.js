/*
- Number of concepts in downloaded concepts file should match number of concepts for that ord 
in database. below script can check it in downloaded file and for database run select count(*) 
from concepts where organiosation_id = {org id}
- Check random sample in concepts for each type to see if all attributes are same in current file 
and new file
- Compare Number of form element groups and number of form elements per each form
- Check random sample of form elments to see if attributes are the same
- Check if things like voided, displayOrder, validFormat, keyValues, type, are same.
- Change filenames in Gruntfile.
 */

const concepts = require("./concepts");
const registrationConcepts = require("./registration/registrationConcepts");
const eligibleCoupleConcepts = require("./eligibleCouple/eligibleCoupleConcepts");
const pregnancyEnrolmentConcepts = require("./pregnancy/pregnancyEnrolmentConcepts");
const ancFormConcepts = require("./pregnancy/ancFormConcepts");
const childBirthConcepts = require("./child/childBirthConcepts");
const deliveryConcepts = require("./pregnancy/deliveryConcepts");
const abortionConcepts = require("./pregnancy/abortionConcepts");
const childConcepts = require("./child/childConcepts");
const childPNCConcepts = require("./child/childPNCConcepts");
const childFollowupConcepts = require("./child/childFollowupConcepts");
const lodash = require("lodash");

const oldRegistrationForm = require("./registration/registrationForm");
const newRegistrationForm = require("./forms/Registration");
const oldeligibleCoupleEnrolmentForm = require("./eligibleCouple/eligibleCoupleEnrolmentForm");
const neweligibleCoupleEnrolmentForm = require("./forms/Eligible couple enrolment");

const oldeligibleCoupleFollowupForm = require("./eligibleCouple/eligibleCoupleFollowupForm");
const neweligibleCoupleFollowupForm = require("./forms/Eligible Couple Followup");

const oldpregnancyEnrolmentForm = require("./pregnancy/pregnancyEnrolmentForm");
const newpregnancyEnrolmentForm = require("./forms/Pregnancy Enrolment");

const oldancForm = require("./pregnancy/ancForm.json");
const newancForm = require("./forms/ANC Form");

const olddeliveryForm = require("./pregnancy/deliveryForm");
const newdeliveryForm = require("./forms/Delivery Form");

const oldabortionForm = require("./pregnancy/abortionForm");
const newabortionForm = require("./forms/Abortion Form");

const oldabortionFollowupForm = require("./pregnancy/abortionFollowupForm");
const newabortionFollowupForm = require("./forms/Abortion Followup Form");

const oldmotherPNCForm = require("./pregnancy/motherPNCForm");
const newmotherPNCForm = require("./forms/Mother PNC Form");

const oldchildEnrolment = require("./child/childEnrolment");
const newchildEnrolment = require("./forms/Child Enrolment");

const oldchildBirthForm = require("./child/childBirthForm");
const newchildBirthForm = require("./forms/Birth Form");

const oldchildPNCForm = require("./child/childPNCForm");
const newchildPNCForm = require("./forms/Child PNC Form");

const oldchildFollowupForm = require("./child/childFollowupForm");
const newchildFollowupForm = require("./forms/Child Followup Form");
let newUUID = [];
concepts.map(m => {
  newUUID.push(m.uuid);
});

let oldConceptCount = 0;
let oldUUID = [];
let count = 0;
oldConceptCount += registrationConcepts.length;
registrationConcepts.map(m => {
  if (oldUUID.includes(m.uuid)) {
    count++;
  }
  oldUUID.push(m.uuid);
});

oldConceptCount += eligibleCoupleConcepts.length;
eligibleCoupleConcepts.map(m => {
  if (oldUUID.includes(m.uuid)) {
    count++;
  }
  oldUUID.push(m.uuid);
});

oldConceptCount += pregnancyEnrolmentConcepts.length;
pregnancyEnrolmentConcepts.map(m => {
  if (oldUUID.includes(m.uuid)) {
    count++;
  }
  oldUUID.push(m.uuid);
});

oldConceptCount += ancFormConcepts.length;

ancFormConcepts.map(m => {
  if (oldUUID.includes(m.uuid)) {
    count++;
  }
  oldUUID.push(m.uuid);
});

oldConceptCount += childBirthConcepts.length;

childBirthConcepts.map(m => {
  if (oldUUID.includes(m.uuid)) {
    count++;
  }
  oldUUID.push(m.uuid);
});

oldConceptCount += deliveryConcepts.length;
deliveryConcepts.map(m => {
  if (oldUUID.includes(m.uuid)) {
    count++;
  }
  oldUUID.push(m.uuid);
});

oldConceptCount += abortionConcepts.length;
abortionConcepts.map(m => {
  if (oldUUID.includes(m.uuid)) {
    count++;
  }
  oldUUID.push(m.uuid);
});

oldConceptCount += childConcepts.length;
childConcepts.map(m => {
  oldUUID.push(m.uuid);
});

oldConceptCount += childPNCConcepts.length;
childPNCConcepts.map(m => {
  if (oldUUID.includes(m.uuid)) {
    count++;
  }
  oldUUID.push(m.uuid);
});

oldConceptCount += childFollowupConcepts.length;
childFollowupConcepts.map(m => {
  if (oldUUID.includes(m.uuid)) {
    count++;
  }
  oldUUID.push(m.uuid);
});

console.log(`Bundle concept length: ${concepts.length}`);
console.log(`Old concept count:: ${oldConceptCount}`);
console.log(`Declare same concept multiple times in old:: ${count}`);
console.log(`Old UUID length : ${oldUUID.length}`);
console.log(`New UUID length : ${newUUID.length}`);
console.log(`New Concept diff: ${lodash.difference(newUUID, oldUUID)} `);
console.log(`Old Concept diff: ${lodash.difference(oldUUID, newUUID)} `);

let oldFormElementCount = 0;
let oldFormGroupCount = 0;
oldRegistrationForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old registration form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

let newFormElementCount = 0;
let newFormGroupCount = 0;

newRegistrationForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New registration form group count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldeligibleCoupleEnrolmentForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old eligible couple enrolment form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

neweligibleCoupleEnrolmentForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New eligible couple enrolment form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldeligibleCoupleFollowupForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old eligible couple follow up form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

neweligibleCoupleFollowupForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New eligible couple follow up form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldpregnancyEnrolmentForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old pregnancy enrolment form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newpregnancyEnrolmentForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New pregnancy enrolment form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldancForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old ANC form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newancForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New ANC form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
olddeliveryForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old delivery form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newdeliveryForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New delivery form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldabortionForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old abortion form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newabortionForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New abortion form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldabortionFollowupForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old abortion followup form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newabortionFollowupForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New abortion followup form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldmotherPNCForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old mother PNC form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newmotherPNCForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New mother PNC form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldchildEnrolment.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old child enrolment form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newchildEnrolment.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New child enrolment form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldchildBirthForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old child birth form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newchildBirthForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New child birth form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldchildPNCForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old child PNC form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newchildPNCForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New child PNC form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);

oldFormElementCount = 0;
oldFormGroupCount = 0;
oldchildFollowupForm.formElementGroups.map(group => {
  oldFormGroupCount++;
  group.formElements.map(element => {
    oldFormElementCount++;
  });
});

console.log(
  `Old child folloup form group count  ${oldFormGroupCount} element count ${oldFormElementCount} `
);

newFormElementCount = 0;
newFormGroupCount = 0;

newchildFollowupForm.formElementGroups.map(group => {
  newFormGroupCount++;
  group.formElements.map(element => {
    newFormElementCount++;
  });
});

console.log(
  `New child folloup form element count  ${newFormGroupCount} element count ${newFormElementCount} `
);
