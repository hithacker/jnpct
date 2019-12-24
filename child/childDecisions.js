const _ = require("lodash");
import {RuleFactory ,
       complicationsBuilder as ComplicationsBuilder,
    } from "rules-config/rules";


const followupDecision = RuleFactory("4548364c-ff22-447b-baec-3c63935a7e00", "Decision");

const zScoreGradeStatusMappingWeightForAge = {
    '1': 'Normal',
    '2': 'Moderately Underweight',
    '3': 'Severely Underweight'
};

const zScoreGradeStatusMappingHeightForAge = {
    '1': 'Normal',
    '2': 'Stunted',
    '3': 'Severely stunted'
};

//ordered map
//KEY:status, value: max z-score for the particular status

const zScoreGradeStatusMappingWeightForHeight = [
    ["Severely wasted", -3],
    ["Wasted", -2],
    ["Normal", 1],
    ["Possible risk of overweight", 2],
    ["Overweight", 3],
    ["Obese", Infinity],
];

const weightForHeightStatus = function (zScore) {
    let found = _.find(zScoreGradeStatusMappingWeightForHeight, function (currentStatus) {
        return zScore <= currentStatus[1];
    });
    return found && found[0];
}

const getGradeforZscore = (zScore) => {
    let grade;
    if (zScore <= -3) {
        grade = 3;
    }
    else if (zScore > -3 && zScore < -2) {
        grade = 2;
    }
    else if (zScore >= -2) {
        grade = 1;
    }

    return grade;

}

const nutritionalStatusForChild = (individual, asOnDate, weight, height) => {

    const zScoresForChild = ruleServiceLibraryInterfaceForSharingModules.common.getZScore(individual, asOnDate, weight, height);

    console.log('zScoresForChild',zScoresForChild);

    const wfaGrade = getGradeforZscore(zScoresForChild.wfa);
    const wfaStatus = zScoreGradeStatusMappingWeightForAge[wfaGrade];

    const hfaGrade = getGradeforZscore(zScoresForChild.hfa);
    const hfaStatus = zScoreGradeStatusMappingHeightForAge[hfaGrade];

    const wfhStatus = weightForHeightStatus(zScoresForChild.wfh);

    return {
        wfa: zScoresForChild.wfa,
        wfaGrade: wfaGrade,
        wfaStatus: wfaStatus,
        hfa: zScoresForChild.hfa,
        hfaGrade: hfaGrade,
        hfaStatus: hfaStatus,
        wfh: zScoresForChild.wfh,
        wfhStatus: wfhStatus
    }
}

const addIfRequired = (decisions, name, value) => {
    if (value === -0) value = 0;
    if (value !== undefined) decisions.push({name: name, value: value});
};

@followupDecision("39021909-fad8-49c1-9892-2c266b08a752", "Follow Up Decision", 100)
export class FollowDecisions {
    static exec(programEncounter, decisions, context, today) {

        const weight = programEncounter.getObservationValue("Current Weight");
        const height = programEncounter.getObservationValue("Height");
        const encounterDateTime = programEncounter.encounterDateTime;
        const individual = programEncounter.programEnrolment.individual;

        const nutritionalStatus = nutritionalStatusForChild(individual, encounterDateTime, weight, height);

        console.log('nutritionalStatus decisions',nutritionalStatus);

        addIfRequired(decisions.encounterDecisions, "Weight for age z-score", nutritionalStatus.wfa);
        addIfRequired(decisions.encounterDecisions, "Weight for age Grade", nutritionalStatus.wfaGrade);
        addIfRequired(decisions.encounterDecisions, "Weight for age Status", nutritionalStatus.wfaStatus ? [nutritionalStatus.wfaStatus] : []);
               
        addIfRequired(decisions.encounterDecisions, "Weight for height z-score", nutritionalStatus.wfh);
        // addIfRequired(decisions.encounterDecisions, "Weight for Height Status", nutritionalStatus.wfhStatus ? [nutritionalStatus.wfhStatus] : []);
        
        // console.log('decisions',decisions);
        decisions.encounterDecisions.push(FollowDecisions.referToHospital(programEncounter));
        // console.log('decisions',decisions);
        return decisions;
    }

    static referToHospital(programEncounter) {
        const decisionBuilder = new ComplicationsBuilder({
            programEncounter: programEncounter,
            complicationsConcept: "Refer to the hospital for"
        });

        decisionBuilder.addComplication("Not able to drink or breastfeed")
            .when.valueInEncounter("Is the child able to drink or breastfeed").is.no;
        decisionBuilder.addComplication("Child Vomiting everything")
            .when.valueInEncounter("Does the child vomits everything").is.yes;
        decisionBuilder.addComplication("child had convulsion")
            .when.valueInEncounter("Has the child had convulsion").is.yes;
        decisionBuilder.addComplication("child is lethargic or unconsious")
            .when.valueInEncounter("See the child is lethargic or unconsious").is.yes;
        decisionBuilder.addComplication("there is general danger sign")
            .when.valueInEncounter("Is there general danger sign").is.yes;
        decisionBuilder.addComplication("Fast breathing")
            .when.valueInEncounter("Does the child has fast breathing").is.yes;
        decisionBuilder.addComplication("chest indrwaning")
            .when.valueInEncounter("look for chest indrwaning").is.yes;
        decisionBuilder.addComplication("child has complaint")
            .when.valueInEncounter("does child has any other complaint").is.yes;

        return decisionBuilder.getComplications();

    }
}


module.exports = {FollowDecisions};