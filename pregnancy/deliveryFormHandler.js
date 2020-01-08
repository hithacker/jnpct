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
            .containsAnswerConceptName("Home");
     }

    @WithName("Date of discharge")
    @WithStatusBuilder
    d2([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Place of delivery")
            .containsAnswerConceptName("Hospital");
     }

    @WithName("Number of babies")
    @WithStatusBuilder
    d3([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Delivery outcome")
           .containsAnswerConceptNameOtherThan("Still Birth");
     }

     @WithName("Gender of Newborn1")
    @WithStatusBuilder
    d31([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Delivery outcome")
           .containsAnswerConceptNameOtherThan("Still Birth");
     }

     @WithName("Weight of Newborn1")
    @WithStatusBuilder
    d32([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Delivery outcome")
           .containsAnswerConceptNameOtherThan("Still Birth");
     }

    @WithName('Number of days stayed at the hospital')
    d4(programEncounter, formElement) {
        const days = moment(programEncounter.getObservationReadableValue('Date of discharge'))
            .diff(programEncounter.getObservationReadableValue('Date of delivery'), 'days');
        const value = isFinite(days) ? days : undefined;
        const visibility = new RuleCondition({programEncounter}).valueInEncounter("Place of delivery")
            .containsAnswerConceptName("Hospital")
            .matches();
        return new FormElementStatus(formElement.uuid, visibility, value);
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

    weightOfStillborn2(programEncounter, formElement, no) {
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

    weightOfStillborn3(programEncounter, formElement, no) {
         const statusBuilder = new FormElementStatusBuilder({
             programEncounter: programEncounter,
             formElement: formElement
         });
         statusBuilder.show().when.valueInEncounter("Number of Stillborn babies")
             .defined.and.greaterThan(2);
         return statusBuilder.build();
     }

     weekOfGestation(programEncounter, formElement) {
        let edd = programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment('Estimated Date of Delivery', programEncounter);
        let dateOfDelivery = programEncounter.getObservationReadableValue('Date of delivery');
        let weekOfGestation = '';
        // if(!_.isEmpty(dateOfDelivery) && !_.isEmpty(edd))
        //  weekOfGestation = 40 - moment(edd).diff(dateOfDelivery, 'weeks')
        weekOfGestation =   lib.calculations.gestationalAgeForEDD(edd,dateOfDelivery);    
    
        return new FormElementStatus(formElement.uuid, true, weekOfGestation);
    }

    @WithName("Place of delivery")
    @WithStatusBuilder
    a33([], statusBuilder) {
         statusBuilder.skipAnswers('Not yet decided');
     }

}
const DeliveryFormDecision = RuleFactory("cbe0f44c-580a-4311-ae34-cef2e4b35330", "Decision");

@DeliveryFormDecision("8c1d83f5-0fcf-49f1-8237-7ce3690f6db0", "Delivery Form Decision", 100.0, {})
class DeliveryFormVisitDecision {
   static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(DeliveryFormVisitDecision.determineDurationOfPregnancy(programEncounter));
        return decisions;
 }

 static determineDurationOfPregnancy(programEncounter) {
    const complicationsBuilder = new ComplicationsBuilder({
        programEncounter: programEncounter,
        complicationsConcept: "Gestational age category at delivery"
    });

    complicationsBuilder.addComplication("Preterm")//
    .when.valueInEncounter("Week of Gestation").is.lessThan(36);

    complicationsBuilder.addComplication("Full term")//
    .when.valueInEncounter("Week of Gestation").is.greaterThanOrEqualTo(36);
   
    return complicationsBuilder.getComplications();
}

}

module.exports = {PregnancyDeliveryFormViewFilterJNPCT, DeliveryFormVisitDecision};