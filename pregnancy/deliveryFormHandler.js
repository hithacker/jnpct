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

@DeliveryFormViewFilter("2f291a9a-3e66-4417-97c7-13474981f6f9", "JNPCT Delivery Form View Filter", 100.0, {})
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
           .containsAnyAnswerConceptName("Live Birth","Live and Still Birth","Neonatal Death");
     }

    @WithStatusBuilder
    numberOfDaysStayedAtHospital([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Delivery outcome')
            .containsAnyAnswerConceptName("Live Birth", "Still Birth", "Live birth and Still birth","Neonatal Death")
            .and.when.valueInEncounter('Place of delivery')
            .containsAnswerConceptName('HOSPITAL');
    }

    genderOfNewBorn2(programEncounter, formElement) {
        return this._showWhenNoOfBabiesIsMoreThan(programEncounter, formElement, 1);
    }


}

module.exports = {PregnancyDeliveryFormViewFilterJNPCT};