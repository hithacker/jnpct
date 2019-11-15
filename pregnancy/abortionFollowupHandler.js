const moment = require("moment");
const _ = require("lodash");
import {
    FormElementsStatusHelper,
    FormElementStatus,
    FormElementStatusBuilder,
    RuleCondition,
    RuleFactory,
    StatusBuilderAnnotationFactory,
    VisitScheduleBuilder,
    complicationsBuilder as ComplicationsBuilder,
    WithName
} from 'rules-config/rules';
import lib from '../lib';

const AbortionFollowupViewFilter = RuleFactory("20e3c4e9-1e58-4a11-ba5c-9f3c745c7ef7", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');
const Decision = RuleFactory('20e3c4e9-1e58-4a11-ba5c-9f3c745c7ef7', 'Decision');


@AbortionFollowupViewFilter("93f40b00-3e92-4f70-b430-cd5f4b90b8a5", "JNPCT Abortion Followup View Filter", 100.0, {})
class AbortionFollowupViewFilterHandlerJNPCT {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new AbortionFollowupViewFilterHandlerJNPCT(), programEncounter, formElementGroup, today);
    }

   @WithName("Other breast related problems")
   @WithStatusBuilder
   f1([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Any breast problems")
            .containsAnswerConceptName("Other");
   }

    @WithName('Which Day after Abortion?')
    f2(programEncounter, formElement) {
        const days = moment(programEncounter.encounterDateTime) 
        .diff(programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment('Date of Abortion/MTP'), 'days');
         const value = isFinite(days) ? days : undefined;
      return new FormElementStatus(formElement.uuid, true, value);
     }

}

@Decision('efe29b09-8d78-41d9-9f16-00cc39515a19', 'PregnancyAbortionDecision', 100.0, {})
class PregnancyAbortionDecision {
    static referToTheHospital(programEncounter) {
        const referralBuilder = new ComplicationsBuilder({
            programEncounter: programEncounter,
            complicationsConcept: 'Refer to the hospital for'
        });

       referralBuilder.addComplication("Low Systolic")
               .when.valueInEncounter("BP Systolic").lessThan(90);

       referralBuilder.addComplication("High Systolic")
               .when.valueInEncounter("BP Systolic").greaterThan(140);

       referralBuilder.addComplication("Low Diastolic")
               .when.valueInEncounter("BP Diastolic").lessThan(60);

       referralBuilder.addComplication("High Diastolic")
              .when.valueInEncounter("BP Diastolic").greaterThan(90);

       referralBuilder.addComplication("cc")
           .when.valueInEncounter("Temperature").greaterThan(37.5);

       referralBuilder.addComplication("Abnormal Hb")
            .when.valueInEncounter("Hb % Level").lessThan(8);

       referralBuilder.addComplication("Post-Partum Haemorrhage symptoms")
            .when.valueInEncounter("Post-Partum Haemorrhage symptoms")
            .containsAnyAnswerConceptName("Difficulty breathing", "Bad headache", "Blurred vision");

       referralBuilder.addComplication("Abdominal problems")
           .when.valueInEncounter("Any abdominal problems")
           .containsAnyAnswerConceptName("Uterus is soft or tender", "Abdominal pain");

      referralBuilder.addComplication("Vaginal problems")
           .when.valueInEncounter("Any vaginal problems")
           .containsAnyAnswerConceptName("Heavy bleeding per vaginum", "Bad-smelling lochia", "Infected perineum suture");

      referralBuilder.addComplication("Any difficulties with urinating")
            .when.valueInEncounter("Any difficulties with urinating")
            .containsAnyAnswerConceptName("Difficulty passing urine", "Burning Urination");

     referralBuilder.addComplication("Breast-related problems")
             .when.valueInEncounter("Any breast problems")
             .containsAnyAnswerConceptName("Cracked Nipple", "Nipple hardness", "Breast hardness",
             "Breast engorgement", "Breast abcess","Other");

     referralBuilder.addComplication("Does feel hot or have the chills?")
            .when.valueInEncounter("Does feel hot or have the chills?").is.yes;

    referralBuilder.addComplication("Convulsions")
             .when.valueInEncounter("Convulsions")
             .containsAnswerConceptName("Present");

    referralBuilder.addComplication("Post partum dipression symptoms")
        .when.valueInEncounter("Post partum dipression symptoms")
        .containsAnyAnswerConceptName("Insomnia", "Irritability", "Loss of appetite", "Weakness");


        return referralBuilder.getComplications();
    }

    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(PregnancyAbortionDecision.referToTheHospital(programEncounter));
        return decisions;
    }

}

module.exports = {AbortionFollowupViewFilterHandlerJNPCT,PregnancyAbortionDecision};

