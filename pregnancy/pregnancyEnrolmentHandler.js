import {
    FormElementsStatusHelper,
    FormElementStatus,
    FormElementStatusBuilder,
    RuleCondition,
    RuleFactory,
    StatusBuilderAnnotationFactory,
    VisitScheduleBuilder,
    WithName
} from 'rules-config/rules';
import lib from '../lib';

const PregnancyEnrolmentViewFilter = RuleFactory("d40e8aa2-8cae-4b09-ad30-2da6c1690206", "ViewFilter");
const statusBuilder = StatusBuilderAnnotationFactory('programEnrolment', 'formElement');

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
    @statusBuilder
    p1([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Previous history of disease").containsAnswerConceptName("Other");
    }

}


module.exports = {PregnancyEnrolmentViewFilterHandlerJNPCT};
