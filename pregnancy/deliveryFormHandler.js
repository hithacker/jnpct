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


const DeliveryFormViewFilter = RuleFactory("cbe0f44c-580a-4311-ae34-cef2e4b35330", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');


@DeliveryFormViewFilter("1aaaefb2-3de7-4876-b465-85948b6ff159", "JNPCT Delivery Form View Filter", 100.0, {})
class PregnancyDeliveryFormViewFilterJNPCT {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new PregnancyDeliveryFormViewFilterJNPCT(), programEncounter, formElementGroup, today);

    }

     @WithName("Delivery pack used ?")
     @WithStatusBuilder
     d1([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Place of delivery")
            .containsAnswerConceptName("HOME");
     }

    @WithName("Date of discharge")
    @WithStatusBuilder
    d2([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Place of delivery")
            .containsAnswerConceptName("HOSPITAL");
     }

    @WithName("Number of babies")
    @WithStatusBuilder
    d3([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Delivery outcome")
           .containsAnswerConceptNameOtherThan("Still Birth");
     }

    @WithName('Number of days stayed at the hospital')
    d4(programEncounter, formElement) {
        const days = moment(programEncounter.getObservationReadableValue('Date of discharge'))
            .diff(programEncounter.getObservationReadableValue('Date of delivery'), 'days');
        const value = isFinite(days) ? days : undefined;
        return new FormElementStatus(formElement.uuid, true, value);
    }

    genderOfNewborn2(programEncounter, formElement, no) {
        const statusBuilder = new FormElementStatusBuilder({
            programEncounter: programEncounter,
            formElement: formElement
        });
        statusBuilder.show().when.valueInEncounter("Number of babies")
              .defined.and.greaterThan(1);
        return statusBuilder.build();
    }

    weightOfNewborn2(programEncounter, formElement, no) {
         const statusBuilder = new FormElementStatusBuilder({
             programEncounter: programEncounter,
             formElement: formElement
         });
         statusBuilder.show().when.valueInEncounter("Number of babies")
             .defined.and.greaterThan(1);
         return statusBuilder.build();
     }

    genderOfNewborn3(programEncounter, formElement, no) {
         const statusBuilder = new FormElementStatusBuilder({
             programEncounter: programEncounter,
             formElement: formElement
         });
         statusBuilder.show().when.valueInEncounter("Number of babies")
             .defined.and.greaterThan(2);
         return statusBuilder.build();
     }

    weightOfNewborn3(programEncounter, formElement, no) {
         const statusBuilder = new FormElementStatusBuilder({
             programEncounter: programEncounter,
             formElement: formElement
         });
         statusBuilder.show().when.valueInEncounter("Number of babies")
             .defined.and.greaterThan(2);
         return statusBuilder.build();
     }

    numberOfStillbornBabies(programEncounter, formElement) {
        const statusBuilder = new FormElementStatusBuilder({
            programEncounter: programEncounter,
            formElement: formElement
        });
        statusBuilder.show().when.valueInEncounter("Delivery outcome")
            .containsAnyAnswerConceptName("Live and Still Birth", "Still Birth");
        const status = statusBuilder.build();
        // status.value = this._getNoOfStillBornBabies(programEncounter);
        return status;
    }

    genderOfStillborn1(programEncounter, formElement) {
        const statusBuilder = new FormElementStatusBuilder({
            programEncounter: programEncounter,
            formElement: formElement
        });
        statusBuilder.show().when.valueInEncounter("Delivery outcome")
            .containsAnyAnswerConceptName("Live and Still Birth", "Still Birth");
        const status = statusBuilder.build();
        // status.value = this._getNoOfStillBornBabies(programEncounter);
        return status;
    }

    weightOfStillborn1(programEncounter, formElement) {
        const statusBuilder = new FormElementStatusBuilder({
            programEncounter: programEncounter,
            formElement: formElement
        });
        statusBuilder.show().when.valueInEncounter("Delivery outcome")
            .containsAnyAnswerConceptName("Live and Still Birth", "Still Birth");
        const status = statusBuilder.build();
        // status.value = this._getNoOfStillBornBabies(programEncounter);
        return status;
    }

    genderOfStillborn2(programEncounter, formElement, no) {
         const statusBuilder = new FormElementStatusBuilder({
             programEncounter: programEncounter,
             formElement: formElement
         });
         statusBuilder.show().when.valueInEncounter("Number of Stillborn babies")
             .defined.and.greaterThan(1);
         return statusBuilder.build();
     }

    weightOfStillborn2InGms(programEncounter, formElement, no) {
         const statusBuilder = new FormElementStatusBuilder({
             programEncounter: programEncounter,
             formElement: formElement
         });
         statusBuilder.show().when.valueInEncounter("Number of Stillborn babies")
             .defined.and.greaterThan(1);
         return statusBuilder.build();
     }

    genderOfStillborn3(programEncounter, formElement, no) {
         const statusBuilder = new FormElementStatusBuilder({
             programEncounter: programEncounter,
             formElement: formElement
         });
         statusBuilder.show().when.valueInEncounter("Number of Stillborn babies")
             .defined.and.greaterThan(2);
         return statusBuilder.build();
    }

    weightOfStillborn3InGms(programEncounter, formElement, no) {
         const statusBuilder = new FormElementStatusBuilder({
             programEncounter: programEncounter,
             formElement: formElement
         });
         statusBuilder.show().when.valueInEncounter("Number of Stillborn babies")
             .defined.and.greaterThan(2);
         return statusBuilder.build();
     }

}
const DeliveryFormDecision = RuleFactory("cbe0f44c-580a-4311-ae34-cef2e4b35330", "Decision");

@DeliveryFormDecision("8c1d83f5-0fcf-49f1-8237-7ce3690f6db0", "Delivery Form Decision", 100.0, {})
class DeliveryFormVisitDecision {
    static exec(programEncounter, decisions, context, today) {
        decisions = {
            "enrolmentDecisions": [],
            "encounterDecisions": [],
            "registrationDecisions": []
        };
        if (programEncounter.encounterType.name === 'Delivery Form')
            this.determineDurationOfPregnancy(programEncounter, decisions['encounterDecisions']);
        return decisions;
    }

    static determineDurationOfPregnancy(programEncounter, enrolmentDecisions) {
        let edd = programEncounter.getObservationValue('Estimated Date of Delivery');
        const gestationalWeek = lib.calculations.gestationalAgeForEDD(edd, today);
        if (gestationalWeek < 36 ) { encounterDecisions.push({name: "Gestational week is less than 36", value: "Preterm"});
        if (gestationalWeek > 40 ) { encounterDecisions.push({name: "Gestational week is greater than 40", value: "Full Preterm"});
     }
   }
}

}

module.exports = {PregnancyDeliveryFormViewFilterJNPCT,DeliveryFormVisitDecision};