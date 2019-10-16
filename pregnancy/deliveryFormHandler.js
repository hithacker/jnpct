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
    ProgramRule,
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


module.exports = {PregnancyDeliveryFormViewFilterJNPCT};