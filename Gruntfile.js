const rulesConfigInfra = require("rules-config/infra");
const IDI = require("openchs-idi");

module.exports = IDI.configure(
  {
    name: "jnpct",
    "chs-admin": "admin",
    "org-name": "JNPCT",
    "org-admin": "admin@jnpct",
    secrets: "../secrets.json",
    files: {
      adminUsers: {
        dev: ["users/admin-user.json"]
      },
      forms: [
        "forms/registrationForm.json",
        "forms/eligibleCoupleEnrolmentForm.json",
        "forms/eligibleCoupleFollowupForm.json",
        "forms/pregnancyEnrolmentForm.json",
        "forms/ancForm.json",
        "forms/deliveryForm.json",
        "forms/abortionForm.json",
        "forms/abortionFollowupForm.json",
        "forms/motherPNCForm.json",
        "forms/childEnrolment.json",
        "forms/childBirthForm.json",
        "forms/childPNCForm.json",
        "forms/childFollowupForm.json"
      ],
      formMappings: ["metadata/formMappings.json"],
      formDeletions: [],
      formAdditions: [],
      catchments: ["metadata/catchments.json"],
      checklistDetails: [],
      concepts: ["concepts.json"],
      locations: ["metadata/locations.json"],
      programs: ["programs.json"],
      encounterTypes: ["metadata/encounterTypes.json"],
      operationalEncounterTypes: ["metadata/operationalEncounterTypes.json"],
      operationalPrograms: ["metadata/operationalPrograms.json"],
      subjectTypes: ["subjectTypes.json"],
      operationalSubjectTypes: ["metadata/operationalSubjectTypes.json"],
      users: {
        dev: ["users/dev-users.json"]
      },
      rules: ["./rules.js"],
      organisationSql: [
        /* "create_organisation.sql"*/
      ],
      organisationConfig: ["organisationConfig.json"],
      translations: ["translations/en.json"]
    }
  },
  rulesConfigInfra
);
