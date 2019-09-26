const rulesConfigInfra = require('rules-config/infra');
const IDI = require('openchs-idi');

module.exports = IDI.configure({
    "name": "jnpct",
    "chs-admin": "admin",
    "org-name": "JNPCT",
    "org-admin": "admin@jnpct",
    "secrets": '../secrets.json',
    "files": {
        "adminUsers": {
            "dev": [],
        },
        "forms": [
        ],
        "formMappings": [
        ],
        "formDeletions": [
        ],
        "formAdditions": [
        ],
        "catchments": [
        ],
        "checklistDetails": [
        ],
        "concepts": [
        ],
        "locations": [
        ],
        "programs": [],
        "encounterTypes": [],
        "operationalEncounterTypes": [],
        "operationalPrograms": [],
        "subjectTypes": [],
        "operationalSubjectTypes": [],
        "users": {
            "dev": []
        },
        "rules": [

        ],
        "organisationSql": [
            /* "create_organisation.sql"*/
        ]
    }
}, rulesConfigInfra);