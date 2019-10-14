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

const EligibleCoupleFollowupViewFilter = RuleFactory("1c8bd246-f46e-4250-88bc-1ca567ba03ce", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');
const ecDecision = RuleFactory("1c8bd246-f46e-4250-88bc-1ca567ba03ce", "Decision");


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
    F1([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("Height").is.defined
    .or.when.latestValueInPreviousEncounters("Height").is.notDefined
    return statusBuilder.build();
    }

    @WithName("LMP Date")
    @WithStatusBuilder
    F2([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Does she missed period").is.yes;
    }

    @WithName("Is She Pregnant?")
    @WithStatusBuilder
    F3([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Does she missed period").is.yes;
    }

}

@ecDecision("dcb03f68-8cda-483c-9c8b-6a781ecffabb", "Eligible Couple Form Decision", 100.0, {})
 export class EligibleCoupleFormDecisionHandler {
     static conditionEc(programEncounter) {
         const complicationsBuilder = new ComplicationsBuilder({
             programEncounter: programEncounter,
             complicationsConcept: "BMI Condition"
         });

          complicationsBuilder
                .addComplication("Underweight")
                .when.valueInEncounter("BMI")
                .lessThan(18.5);

           complicationsBuilder
                .addComplication("Overweight")
                .when.valueInEncounter("BMI")
                .greaterThan(24.9);

        return complicationsBuilder.getComplications();

 }

    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(EligibleCoupleFormDecisionHandler.conditionEc(programEncounter));
        return decisions;
 }

}

module.exports = {EligibleCoupleFollowupViewFilterHandlerJNPCT,EligibleCoupleFormDecisionHandler};
