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
const _ = require("lodash");

const AbortionFormViewFilter = RuleFactory("6ff66edf-30c9-49c5-821c-c44f371b31b2", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');


@AbortionFormViewFilter("8f09f25a-60e5-4f72-9305-acf2fd6fd203", "JNPCT Abortion Form View Filter", 100.0, {})
class AbortionFormViewFilterHandlerJNPCT {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new AbortionFormViewFilterHandlerJNPCT(), programEncounter, formElementGroup, today);
    }
// Period of gestation in weeks at the time of Abortion/MTP
// periodOfGestationInWeeksAtTheTimeOfAbortionMtp(programEncounter, formElement) {

    @WithName('Period of gestation in weeks at the time of Abortion/MTP')
    m5(programEncounter, formElement) {
        const dateOfAbortion = programEncounter.getObservationValue('Date of Abortion/MTP');
        const lmpDate = programEncounter.programEnrolment.getObservationValue('Last menstrual period');
        let period ='';
        period = lib.C.weeksBetween(dateOfAbortion,lmpDate);    
        console.log('dateOfAbortion',dateOfAbortion);
        console.log('lmpDate',lmpDate);
        
        return new FormElementStatus(formElement.uuid, true, _.round(period));
    }


  @WithName("Type of Abortion")
  @WithStatusBuilder
  m1([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Whether Abortion or MTP")
            .containsAnswerConceptName("Abortion");
  }

  @WithName("Place of Abortion")
  @WithStatusBuilder
  m2([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Whether Abortion or MTP")
            .containsAnswerConceptName("Abortion");
  }

  @WithName("Other Post Abortion/MTP complication")
  @WithStatusBuilder
  m3([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Post Abortion/MTP Complications")
            .containsAnswerConceptName("Other");
  }

  @WithName("Date of discharge from hospital")
  @WithStatusBuilder
  m4([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Whether Abortion or MTP")
            .containsAnswerConceptName("MTP")
            .or.when.valueInEncounter("Place of Abortion")
            .containsAnswerConceptName("Institutional");
  }

}

module.exports = {AbortionFormViewFilterHandlerJNPCT};
