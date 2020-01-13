const rulesConfigInfra = require("rules-config/infra");
const IDI = require("openchs-idi");

module.exports = IDI.configure(
  {
    name: "setco",
    "chs-admin": "admin",
    "org-name": "Setco",
    "org-admin": "admin@setco",
    secrets: "../secrets.json",
    files: {
      adminUsers: {
        dev: ["users/admin-user.json"]
      },
      forms: [
        "forms/Registration.json",
        "forms/Eligible couple enrolment.json",
        "forms/Eligible Couple Followup.json",
        "forms/Pregnancy Enrolment.json",
        "forms/ANC Form.json",
        "forms/Delivery Form.json",
        "forms/Abortion Form.json",
        "forms/Abortion Followup Form.json",
        "forms/Mother PNC Form.json",
        "forms/Child Enrolment.json",
        "forms/Birth Form.json",
        "forms/Child PNC Form.json",
        "forms/Child Followup Form.json",
        "forms/checklistForm.json",
        "forms/Program Exit Form.json",
        "forms/Program Cancel Form.json"
      ],
      formMappings: ["formMappings.json"],
      formDeletions: [],
      formAdditions: [],
      catchments: ["catchments.json"],
      checklistDetails: [
        "child/checklist.json"
      ],
      concepts: [ "concepts.json",
                  "child/checklistConcepts.json",
                  "child/vaccinationConcepts.json"
              ],
      locations: ["locations.json"],
      programs: ["programs.json"],
      encounterTypes: ["encounterTypes.json"],
      operationalEncounterTypes: ["operationalEncounterTypes.json"],
      operationalPrograms: ["operationalPrograms.json"],
      subjectTypes: ["subjectTypes.json"],
      operationalSubjectTypes: ["operationalSubjectTypes.json"],
      users: {
        dev: ["users/dev-users.json"]
      },
      rules: ["./rules.js"],
      organisationSql: [
        /* "create_organisation.sql"*/
      ],
      organisationConfig: ["organisationConfig.json"],
      translations: ["translations/en.json"],
      genders: ["genders.json"]
    }
  },
  rulesConfigInfra
);
