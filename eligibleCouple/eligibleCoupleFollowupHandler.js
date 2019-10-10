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
    WithName,
} from 'rules-config/rules';
import lib from '../lib';

const EligibleCoupleFollowupViewFilter = RuleFactory("1c8bd246-f46e-4250-88bc-1ca567ba03ce", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@EligibleCoupleFollowupViewFilter("f4ddfc09-bfcb-4039-ba7d-7511a316802c", "JNPCT Eligible Couple Followup View Filter", 100.0, {})
class EligibleCoupleFollowupViewFilterHandlerJNPCT {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new EligibleCoupleFollowupViewFilterHandlerJNPCT(), programEncounter, formElementGroup, today);
    }

    bmi(programEncounter, formElement) {
        let weight = programEncounter.getObservationValue('Weight');
        let height = programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment('Height', programEncounter);
        let bmi = '';
        if (_.isNumber(height) && _.isNumber(weight)) {
            bmi = lib.C.calculateBMI(weight, height);
        }
        return new FormElementStatus(formElement.uuid, true, bmi);
    }

    @WithName("Height")
    @WithStatusBuilder
    abc71([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("Height").is.defined
    .or.when.latestValueInPreviousEncounters("Height").is.notDefined
    return statusBuilder.build();
    }

    @WithName("LMP Date")
    @WithStatusBuilder
    F1([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Does she missed period").is.yes;
    }

    @WithName("Is She Pregnant?")
    @WithStatusBuilder
    F2([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Does she missed period").is.yes;
    }

    @WithName("LMP")
    @WithStatusBuilder
    F3([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Is She Pregnant?").is.yes;
    }

    @WithName("EDD")
    @WithStatusBuilder
    F4([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Is She Pregnant?").is.yes;
    }

    @WithName("Previous history of disease")
    @WithStatusBuilder
    F5([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Is She Pregnant?").is.yes;
    }


}

module.exports = {EligibleCoupleFollowupViewFilterHandlerJNPCT};
