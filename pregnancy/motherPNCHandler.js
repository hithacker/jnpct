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

const PncFormViewFilter = RuleFactory("c4123189-c7b6-49e1-bbf3-82b3127750b2", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');
const motherDecision = RuleFactory('c4123189-c7b6-49e1-bbf3-82b3127750b2', 'Decision');


@PncFormViewFilter("d1d50ccd-d334-40a6-9c80-8c357f05b6dd", "JNPCT Pnc Form View Filter", 100.0, {})
class PncFormViewFilterHandlerJNPCT {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new PncFormViewFilterHandlerJNPCT(), programEncounter, formElementGroup, today);
    }

   @WithName("Other breast related problems")
   @WithStatusBuilder
   p1([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Any breast problems")
            .containsAnswerConceptName("Other");
   }

    @WithName('Which day after Delivery')
    p2(programEncounter, formElement) {
        const days = moment(programEncounter.encounterDateTime) 
        .diff(programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment('Date of delivery'), 'days');
         const value = isFinite(days) ? days : undefined;
      return new FormElementStatus(formElement.uuid, true, value);
    }

    @WithName("IF YES THEN WRITE NUMBER OF TABLET SWALLOWED")
    @WithStatusBuilder
    p3([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Does she taking iron tablet?").is.yes;
    }

    @WithName("IF YES THEN WRITE NUMBER OF CALCIUM TABLET SWALLOWED")
    @WithStatusBuilder
    p4([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Does she taking calcium tablet?").is.yes;
    }

}

@motherDecision('78a5405e-c490-4a07-9eee-d88dd0a93217', 'PregnancyMotherPncDecision', 100.0, {})
class PregnancyMotherPncDecision {
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

       referralBuilder.addComplication("High Fever")
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

      referralBuilder.addComplication("Difficulties with urinating")
            .when.valueInEncounter("Any difficulties with urinating")
            .containsAnyAnswerConceptName("Difficulty passing urine", "Burning Urination");

     referralBuilder.addComplication("Breast-related problems")
             .when.valueInEncounter("Any breast problems")
             .containsAnyAnswerConceptName("Cracked Nipple", "Nipple hardness", "Breast hardness",
             "Breast engorgement", "Breast abcess","Other");

    referralBuilder.addComplication("Incision area not normal")
        .when.valueInEncounter("How is the incision area?")
        .containsAnyAnswerConceptName("Indurated", "Looks Red", "Filled with pus", "Discharge from wound");

     referralBuilder.addComplication("Feels hot or have the chills")
            .when.valueInEncounter("Does feel hot or have the chills?").is.yes;

    referralBuilder.addComplication("Convulsions present")
             .when.valueInEncounter("Convulsions")
             .containsAnswerConceptName("Present");

    referralBuilder.addComplication("Post partum dipression symptoms")
        .when.valueInEncounter("Post partum dipression symptoms")
        .containsAnyAnswerConceptName("Insomnia", "Irritability", "Loss of appetite", "Weakness");

    referralBuilder.addComplication("Pain in hypogastrium")
             .when.valueInEncounter("Pain in hypogastrium?").is.yes;

    referralBuilder.addComplication("Burning micturation")
              .when.valueInEncounter("Burning micturation?").is.yes;

    referralBuilder.addComplication("PPH")
           .when.valueInEncounter("How many pads changed?")
           .containsAnyAnswerConceptName("6", "more");

        return referralBuilder.getComplications();
    }

    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(PregnancyMotherPncDecision.referToTheHospital(programEncounter));
        return decisions;
    }

}

module.exports = {PncFormViewFilterHandlerJNPCT,PregnancyMotherPncDecision};

