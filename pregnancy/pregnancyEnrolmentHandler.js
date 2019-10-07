import {
    FormElementsStatusHelper,
    FormElementStatus,
    FormElementStatusBuilder,
    ProgramRule,
    RuleFactory,
    StatusBuilderAnnotationFactory,
    VisitScheduleBuilder,
    WithName
} from 'rules-config/rules';
import lib from '../lib';

const PregnancyEnrolmentViewFilter = RuleFactory("d40e8aa2-8cae-4b09-ad30-2da6c1690206", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEnrolment', 'formElement');


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
        statusBuilder.show().when.valueInEnrolment("Gravida").is.greaterThan(1);
    }

    @WithName('Number of Abortion')
    @WithStatusBuilder
    p3([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").is.greaterThan(1);
    }

    @WithName('Number of live childrens')
    @WithStatusBuilder
    p4([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").is.greaterThan(1);
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
        statusBuilder.show().when.valueInEnrolment("Gravida").is.greaterThan(1);
    }

    @WithName('Age of Youngest child')
    @WithStatusBuilder
    p8([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Number of live childrens").is.greaterThan(0);
    }

    @WithName('Place of last delivery')
    @WithStatusBuilder
    p9([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").is.greaterThan(1);
    }

    @WithName('Risk in the last pregnancy')
    @WithStatusBuilder
    p10([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Gravida").is.greaterThan(1);
    }

    @WithName("what kind of risk occurred")
    @WithStatusBuilder
    p11([], statusBuilder) {
         statusBuilder.show().when.valueInEnrolment("Risk in the last pregnancy").is.yes;
    }

 }



module.exports = {PregnancyEnrolmentViewFilterHandlerJNPCT};
