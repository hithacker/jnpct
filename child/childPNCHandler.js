import {
    StatusBuilderAnnotationFactory,
    RuleFactory,
    FormElementsStatusHelper,
    WithName,
    complicationsBuilder as ComplicationsBuilder,
} from 'rules-config/rules';
import _ from 'lodash';
import lib from '../lib';

const filter = RuleFactory('62b5b7ae-f0b3-49c0-b7cb-eb2b616bc89b', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

const pncDecision = RuleFactory("62b5b7ae-f0b3-49c0-b7cb-eb2b616bc89b", "Decision");

@filter('ffd246fe-cd42-4b4f-84d9-844e6d536d43', 'ChildPNCHandler', 100.0)
class ChildPNCHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new ChildPNCHandler(), programEncounter, formElementGroup, today);
    }

    @WithName('Whether child breathing regularly?')
    @WithStatusBuilder
    dummy11([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters('Whether child breathing regularly?', programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName('Is the child pinkish in colour?')
    @WithStatusBuilder
    dummy12([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters('Is the child pinkish in colour?', programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName('Is body temprature warm?')
    @WithStatusBuilder
    dummy13([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters('Is body temprature warm?', programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName('Is there active movement of hands and legs?')
    @WithStatusBuilder
    dummy14([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters('Is there active movement of hands and legs?', programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName('Is there any life threatening abnormality?')
    @WithStatusBuilder
    dummy15([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters('Is there any life threatening abnormality?', programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName("Examine for cleft palate/lips in child's mouth?")
    @WithStatusBuilder
    dummy16([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters("Examine for cleft palate/lips in child's mouth?", programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName("Does foam coming out from child's mouth?")
    @WithStatusBuilder
    dummy17([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters("Does foam coming out from child's mouth?", programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName("Does child paases stool and urine within 24  hour")
    @WithStatusBuilder
    dummy18([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters("Does child paases stool and urine within 24  hour", programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName("Is there anal opening present?")
    @WithStatusBuilder
    dummy19([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters("Is there anal opening present?", programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName("Does any kind of cyst or tumor present on neck, back and on lower back?")
    @WithStatusBuilder
    dummy20([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters("Does any kind of cyst or tumor present on neck, back and on lower back?", programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName("Does umbelical cord of newborn tied properly?")
    @WithStatusBuilder
    dummy21([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters("Does umbelical cord of newborn tied properly?", programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName("Is blood coming out from any part of body ( cord ,head ,mouth, anus )")
    @WithStatusBuilder
    dummy22([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters("Is blood coming out from any part of body ( cord ,head ,mouth, anus )?", programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }

    @WithName("Is there visible jaundice?")
    @WithStatusBuilder
    dummy23([programEncounter], statusBuilder) {
        const birthPlace = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment("Place of Birth");
        const condition1 = birthPlace && birthPlace.getReadableValue() === 'Home';
        const formPreviouslyFilled = programEncounter.programEnrolment.findLatestObservationFromPreviousEncounters("Is there visible jaundice?", programEncounter);
        const condition2 = _.isEmpty(formPreviouslyFilled) || _.isEmpty(formPreviouslyFilled.getReadableValue());
        statusBuilder.show().whenItem(condition1 && condition2).is.truthy;
    }


    @WithName('Specify the problem')
    @WithStatusBuilder
    dummy1([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Does infant has any problem now?').containsAnswerConceptName('Yes')
    }

    @WithName('Measure the auxillary temprature of infant')
    @WithStatusBuilder
    dummy2([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Is temperature recorded?').containsAnswerConceptName('Yes')
    }

    @WithName('Reason for not recording temperature')
    @WithStatusBuilder
    dummy3([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Is temperature recorded?').containsAnswerConceptName('No')
    }

    @WithName('When was first breastfeed given to child?')
    @WithStatusBuilder
    dummy4([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("When was first breastfeed given to child?").is.defined
            .or.when.valueInEntireEnrolment("When was first breastfeed given to child?").is.notDefined;
    }

    @WithName('Things given other than bresatfeeding')
    @WithStatusBuilder
    dummy5([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Is there anything given other than breastfeeding for infant').containsAnswerConceptName('Yes')
    }

    @WithName('How many times breastfeeding given to child in last 24 hours')
    @WithStatusBuilder
    dummy6([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Is breastfeed given to infant in last 24 hours?').containsAnswerConceptName('Yes')
    }

    // 42 When to start bathing for infant  ?
    @WithName('When to start bathing for infant?')
    @WithStatusBuilder
    dummy7([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("When to start bathing for infant?").is.defined
            .or.when.valueInEntireEnrolment("When to start bathing for infant?").is.notDefined;
    }


    @WithName("If infant's weight is less than 2.5kg then did KMC?")
    @WithName("Weight at the time of KMC started to do")
    @WithName("In last 24 hours for how many times did KMC?")
    @WithName("In one time for how many minutes did KMC?")
    @WithName("Weight of infant at time to stoped to do KMC")

    @WithStatusBuilder
    dummy8([programEncounter], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Todays weight of infant?').is.lessThan(2.5);
    }


    @WithName('If yes, then refered?')
    @WithName('Date of refer')
    @WithName('Who refered?')
    @WithName('Place of refer')
    @WithStatusBuilder
    dummy9([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Does child require to refer if morbidity found').containsAnswerConceptName('Yes')
    }

    @WithName("Weight Grade of Child")
    @WithStatusBuilder
    bmi([programEncounter], statusBuilder) {
        let weight = programEncounter.getObservationValue("Todays weight of infant?");
        const height = 0;
        const encounterDateTime = programEncounter.encounterDateTime;
        const individual = programEncounter.programEnrolment.individual;
        const nutritionalStatus = nutritionalStatusForChild(individual, encounterDateTime, weight, height);
        let formElmentStatus = statusBuilder.build();
        formElmentStatus.value = nutritionalStatus.wfaStatus;
        return formElmentStatus;
    }
}

const nutritionalStatusForChild = (individual, asOnDate, weight, height) => {

    const zScoresForChild = ruleServiceLibraryInterfaceForSharingModules.common.getZScore(individual, asOnDate, weight, height);
    const wfaGrade = getGradeforZscore(zScoresForChild.wfa);
    const wfaStatus = zScoreGradeStatusMappingWeightForAge[wfaGrade];

    return {
        wfa: zScoresForChild.wfa,
        wfaGrade: wfaGrade,
        wfaStatus: wfaStatus
    }
};
const zScoreGradeStatusMappingWeightForAge = {
    '1': 'Normal',
    '2': 'Moderately Underweight',
    '3': 'Severely Underweight'
};

const getGradeforZscore = (zScore) => {
    let grade;
    if (zScore <= -3) {
        grade = 3;
    } else if (zScore > -3 && zScore < -2) {
        grade = 2;
    } else if (zScore >= -2) {
        grade = 1;
    }
    return grade;
};

@pncDecision("fe55d4d9-9e7f-4332-9535-7eb014ac2a79", "PNC Decisions", 100)
class PncDecision {
    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(PncDecision.counseling(programEncounter));
        decisions.encounterDecisions.push(PncDecision.referToHospital(programEncounter));
        return decisions;
    }


    static counseling(programEncounter) {
        const decisionBuilder = new ComplicationsBuilder({
            programEncounter: programEncounter,
            complicationsConcept: "Counsel mother"
        });
        decisionBuilder.addComplication("Keep child warm in cloths")
            .when.valueInEncounter("Is there active movement of hands and legs?")
            .is.no;

        decisionBuilder.addComplication("Keep child warm in cloths")
            .when.valueInEncounter("Is there any life threatening abnormality?")
            .is.no;

        decisionBuilder.addComplication("Keep child in 3-4 folded cloths")
            .when.valueInEncounter("Is infant coverred with 3-4 folded cloth?")
            .containsAnswerConceptNameOtherThan("Properly covered and head also covered");

        decisionBuilder.addComplication("Give PCM")
            .when.valueInEncounter("Temperature of infant")
            .is.greaterThan(37.5);

        decisionBuilder.addComplication("Keep child warm in cloths")
            .when.valueInEncounter("Temperature of infant")
            .is.lessThanOrEqualTo(35.5);

        decisionBuilder.addComplication("Give PCM")
            .when.valueInEncounter("How you feel infants temprature on touch?")
            .containsAnswerConceptName("Abdomen and limbs all feel hot on touch");

        decisionBuilder.addComplication("Keep child warm in cloths")
            .when.valueInEncounter("How you feel infants temprature on touch?")
            .containsAnswerConceptName("Abdomen and limbs feel cold on touch");

        decisionBuilder.addComplication("apply 0.25%GV lotion, give first dose of cotri")
            .when.valueInEncounter("Condition of umbelicus")
            .containsAnswerConceptNameOtherThan("Normal");

        decisionBuilder.addComplication("Explain mother for proper suckling position")
            .when.valueInEncounter("Not suckling effectively")
            .is.yes;

        decisionBuilder.addComplication("Expain mother for exclusive breastfeeding")
            .when.valueInEncounter("Is there anything given other than breastfeeding for infant")
            .is.yes;

        decisionBuilder.addComplication("Expain mother for breastfeeding more than 10 times")
            .when.valueInEncounter("How many times breastfeeding given to child in last 24 hours")
            .is.lessThan(8);

        decisionBuilder.addComplication("Expain mother to increase frequency of breastfeeding")
            .when.valueInEncounter("In last 24 hours, for how many times infant passes urine?")
            .containsAnswerConceptName("Less than 5 times");

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Is there bleeding from any part of infant's body?")
            .is.yes;

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Is infant vomiting?")
            .is.yes;

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Does infant's abdomen look gasious?")
            .is.yes;

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Does infant looks icteric?")
            .is.yes;

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Does infant looks cynosed?")
            .is.yes;

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Does infant looks abnormal?")
            .is.yes;

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Is the infant's mouth cleft pallet seen?")
            .is.yes;

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Is there visible tumor on back or on head of infant?")
            .is.yes;

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Is foam coming from infant's mouth continuously?")
            .is.yes;

        decisionBuilder.addComplication("Give primary treatment")
            .when.valueInEncounter("Does infant has watery diarrhoea?")
            .is.yes;

        decisionBuilder.addComplication("Apply 0.25 % GV lotion  two times a day")
            .when.valueInEncounter("Is oral ulcer or thrush seen in infant's mouth")
            .is.yes;

        decisionBuilder.addComplication("if 10 or above pustules are present then give primary treatment and refer , if less than 10 pustule then apply 0.5% GV lotion and give cotri syrup two times for 5 days.")
            .when.valueInEncounter("Is there visible pustules on body of infant?")
            .is.yes;


        return decisionBuilder.getComplications();
    }

    static referToHospital(programEncounter) {
        const decisionBuilder = new ComplicationsBuilder({
            programEncounter: programEncounter,
            complicationsConcept: "Refer to the hospital for"
        });
        decisionBuilder.addComplication("Not breathing properly")
            .when.valueInEncounter("Whether child breathing regularly?")
            .is.no;

        decisionBuilder.addComplication("No Active Movement of hands and legs")
            .when.valueInEncounter("Is there active movement of hands and legs?")
            .is.no;

        decisionBuilder.addComplication("Not paases stool and urine within 24  hour")
            .when.valueInEncounter("Does child paases stool and urine within 24  hour")
            .is.no;

        decisionBuilder.addComplication("Life threatening abnormality")
            .when.valueInEncounter("Is there any life threatening abnormality?")
            .is.yes;

        decisionBuilder.addComplication("palate/lips in child's mouth")
            .when.valueInEncounter("Examine for cleft palate/lips in child's mouth?")
            .is.yes;

        decisionBuilder.addComplication("Blood coming out from part of body")
            .when.valueInEncounter("Is blood coming out from any part of body?")
            .is.yes;

        decisionBuilder.addComplication("There is visible jaundice")
            .when.valueInEncounter("Is there visible jaundice?")
            .is.yes;

        decisionBuilder.addComplication("High respiratory rate")
            .when.valueInEncounter("Child Respiratory Rate")
            .is.greaterThan(59);

        decisionBuilder.addComplication("There is grunting sound")
            .when.valueInEncounter("Is there any grunting sound?")
            .is.yes;


        decisionBuilder.addComplication("Abnormal Color")
            .when.valueInEncounter("How is the colour of infant").containsAnswerConceptNameOtherThan("Pinkish");

        decisionBuilder.addComplication("Less Infants Movement")
            .when.valueInEncounter("Look at the infants movement").containsAnswerConceptNameOtherThan("Normal");

        decisionBuilder.addComplication("High Fever")
            .when.valueInEncounter("Temperature of infant")
            .is.greaterThan(37.5);

        decisionBuilder.addComplication("Low Temperature of infant")
            .when.valueInEncounter("Temperature of infant")
            .is.lessThanOrEqualTo(35.5);

        decisionBuilder.addComplication("High Temperature of infant")
            .when.valueInEncounter("How you feel infants temprature on touch?")
            .containsAnswerConceptName("Abdomen and limbs all feel hot on touch");

        decisionBuilder.addComplication("Low Temperature of infant")
            .when.valueInEncounter("How you feel infants temprature on touch?")
            .containsAnswerConceptName("Abdomen and limbs feel cold on touch");

        decisionBuilder.addComplication("Abnormal Condition of umbelicus")
            .when.valueInEncounter("Condition of umbelicus")
            .containsAnswerConceptNameOtherThan("Normal");

        decisionBuilder.addComplication("Abnormal attachment while sucking")
            .when.valueInEncounter("How is the infant attachment while sucking?")
            .containsAnswerConceptNameOtherThan("Good - Normal");

        decisionBuilder.addComplication("Not suckling")
            .when.valueInEncounter("Not suckling at all?")
            .is.yes;

        decisionBuilder.addComplication("Difficulty in breastfeeding")
            .when.valueInEncounter("Does infant has any difficulty in breastfeeding?")
            .is.yes;

        decisionBuilder.addComplication("Bleeding from part of body")
            .when.valueInEncounter("Is there bleeding from any part of infant's body?")
            .is.yes;

        decisionBuilder.addComplication("Infant vomiting")
            .when.valueInEncounter("Is infant vomiting?")
            .is.yes;

        decisionBuilder.addComplication("infant's abdomen look gasious")
            .when.valueInEncounter("Does infant's abdomen look gasious?")
            .is.yes;

        decisionBuilder.addComplication("infant looks icteric")
            .when.valueInEncounter("Does infant looks icteric?")
            .is.yes;

        decisionBuilder.addComplication("infant looks cynosed")
            .when.valueInEncounter("Does infant looks cynosed?")
            .is.yes;

        decisionBuilder.addComplication("infant looks abnormal")
            .when.valueInEncounter("Does infant looks abnormal?")
            .is.yes;

        decisionBuilder.addComplication("cleft pallet seen in infant's mouth")
            .when.valueInEncounter("Is the infant's mouth cleft pallet seen?")
            .is.yes;

        decisionBuilder.addComplication("there is visible tumor")
            .when.valueInEncounter("Is there visible tumor on back or on head of infant?")
            .is.yes;

        decisionBuilder.addComplication("Continuously foam is coming from mouth")
            .when.valueInEncounter("Is foam coming from infant's mouth continuously?")
            .is.yes;

        decisionBuilder.addComplication("infant has watery diarrhoea")
            .when.valueInEncounter("Does infant has watery diarrhoea?")
            .is.yes;


        return decisionBuilder.getComplications();
    }


}


module.exports = {ChildPNCHandler, PncDecision};