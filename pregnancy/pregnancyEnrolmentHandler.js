const _ = require("lodash");
import {
    FormElementsStatusHelper,
    FormElementStatus,
    FormElementStatusBuilder,
    ProgramRule,
    RuleFactory,
    StatusBuilderAnnotationFactory,
    VisitScheduleBuilder,
    complicationsBuilder as ComplicationsBuilder,
    WithName
} from 'rules-config/rules';
import lib from '../lib';

const PregnancyEnrolmentViewFilter = RuleFactory("d40e8aa2-8cae-4b09-ad30-2da6c1690206", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEnrolment', 'formElement');
const PregnancyDecision = RuleFactory("d40e8aa2-8cae-4b09-ad30-2da6c1690206", "Decision");

@PregnancyEnrolmentViewFilter("e9026eb6-99c0-4dd4-99f8-14f24f95719b", "JNPCT Pregnancy Enrolment View Filter", 100.0, {})
class PregnancyEnrolmentViewFilterHandlerJNPCT {
    static exec(programEnrolment, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new PregnancyEnrolmentViewFilterHandlerJNPCT(), programEnrolment, formElementGroup, today);
    }

    edd(programEnrolment, formElement) {
            const lmpDate = programEnrolment.getObservationValue('Last menstrual period');
            return _.isNil(lmpDate) ?
                new FormElementStatus(formElement.uuid, true) :
                new FormElementStatus(formElement.uuid, true, lib.calculations.estimatedDateOfDelivery(programEnrolment));
    }


    @WithName('Other previous history of disease - Please specify')
    @WithStatusBuilder
    p1([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Previous history of disease").containsAnswerConceptName("Other");
    }

    @WithName('Parity')
    @WithStatusBuilder
    p2([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").containsAnyAnswerConceptName("2","3","4","5","6 AND ABOVE");
    }

    @WithName('Number of Abortion')
    @WithStatusBuilder
    p3([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").containsAnyAnswerConceptName("2","3","4","5","6 AND ABOVE");
    }

    @WithName('Number of live childrens')
    @WithStatusBuilder
    p4([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").containsAnyAnswerConceptName("2","3","4","5","6 AND ABOVE");
    }

    @WithName('MALE')
    @WithStatusBuilder
    p5([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Number of live childrens").is.greaterThan(0);
    }

    @WithName('FEMALE')
    @WithStatusBuilder
    p6([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Number of live childrens").is.greaterThan(0);
    }

    @WithName('Result of last delivery')
    @WithStatusBuilder
    p7([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").containsAnyAnswerConceptName("2","3","4","5","6 AND ABOVE");
    }

    @WithName('Age of Youngest child')
    @WithStatusBuilder
    p8([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Number of live childrens").is.greaterThan(0);
    }

    @WithName('Place of last delivery')
    @WithStatusBuilder
    p9([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").containsAnyAnswerConceptName("2","3","4","5","6 AND ABOVE");
    }

    @WithName('Risk in the last pregnancy')
    @WithStatusBuilder
    p10([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").containsAnyAnswerConceptName("2","3","4","5","6 AND ABOVE");
    }

    @WithName("what kind of risk occurred")
    @WithStatusBuilder
    p11([], statusBuilder) {
         statusBuilder.show().when.valueInEnrolment("Risk in the last pregnancy").is.yes;
    }

 }

 @PregnancyDecision("df4df8fb-fe90-4fff-be78-d624e9ac094b", "Pregnancy Form Decision", 100.0, {})
 export class PregnancyFormDecisionHandler {
     static conditionDecisions(programEnrolment) {
         const complicationsBuilder = new ComplicationsBuilder({
             programEnrolment: programEnrolment,
             complicationsConcept: "High Risk"
         });

         complicationsBuilder
             .addComplication("Underage Pregnancy")
             .when.ageInYears.is.lessThanOrEqualTo(18)

         complicationsBuilder
             .addComplication("Old age Pregnancy")
             .when.ageInYears.is.greaterThanOrEqualTo(30)

        complicationsBuilder
            .addComplication("Previous history of disease")
            .when.valueInEnrolment('Previous history of disease')
            .containsAnyAnswerConceptName("Tuberculosis","Blood Pressure",
             "Heart disease","Diabetes","Asthama","Other");

        complicationsBuilder
            .addComplication("Gravida")
            .when.valueInEnrolment('Gravida')
            .containsAnyAnswerConceptName("2","3","4","5","6 AND ABOVE");

        complicationsBuilder
            .addComplication("Result of last delivery")
            .when.valueInEnrolment('Result of last delivery')
            .containsAnyAnswerConceptName("Still Birth","MTP","Abortion");

        complicationsBuilder
            .addComplication("what kind of risk occurred")
            .when.valueInEnrolment('what kind of risk occurred')
            .containsAnyAnswerConceptName("Prolong labour","LSCS",
             "ANEMIA","ECLAMPSIA","PIH","SICKLE CELL","APH","MALPRESENTATION","TWINS","BURNING MICTURATION");

        return complicationsBuilder.getComplications();

 }

    static exec(programEnrolment, decisions, context, today) {
        decisions.enrolmentDecisions.push(PregnancyFormDecisionHandler.conditionDecisions(programEnrolment));
        return decisions;
 }

}

module.exports = {PregnancyEnrolmentViewFilterHandlerJNPCT,PregnancyFormDecisionHandler};

