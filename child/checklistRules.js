const _ = require("lodash");
import {
    FormElementsStatusHelper,
    RuleFactory,
    StatusBuilderAnnotationFactory,
    WithName
} from 'rules-config/rules';

const ViewFilter = RuleFactory("9222dd4c-1d80-40f0-8ca7-5637ad7ceb6b", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('checklistItem', 'formElement');
const EnrolmentChecklists = RuleFactory("95796c7b-cb70-48f5-893f-c0c8afbc3785", "Checklists");

@ViewFilter("8133024e-542f-4558-acbf-cd2d703ad528", "JNPCT List View Filter", 100.0, {})
class CheckListViewFilterJNPCT {
    static exec(checklistItem, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new CheckListViewFilterJNPCT(), checklistItem, formElementGroup, today);
    }

    @WithName("Place of Vaccination")
    @WithStatusBuilder
    placeOfVaccination([checklistItem], statusBuilder) {
        const itemName = checklistItem.detail.concept.name;
        if(itemName === "IPV") {
            statusBuilder.show().when.valueInChecklistItem("Whether Vaccination applicable").is.yes;
        } else {
            statusBuilder.show().whenItem(true).is.truthy;
        }
    }

    @WithName("Specify Other")
    @WithStatusBuilder
    other([checklistItem], statusBuilder) {
        statusBuilder.show().when.valueInChecklistItem("Place of Vaccination").containsAnswerConceptName("Other");
    }

    @WithName("Whether Vaccination applicable")
    @WithStatusBuilder
    whetherVaccinationApplicable([checklistItem], statusBuilder) {
        const itemName = checklistItem.detail.concept.name;
        if(itemName === "IPV") {
            statusBuilder.show().whenItem(true).is.truthy;
        } else {
            statusBuilder.show().whenItem(false).is.truthy;
        }
    }
}

@EnrolmentChecklists("6870c764-1bc7-4dce-af7e-bb5956c00ea0", "Child vaccination schedule", 1.0)
class ChildVaccinationChecklist {
    static exec(enrolment, checklistDetails) {
        const vaccinationDetails = checklistDetails.find(cd => cd.name === 'Vaccination');
        if (vaccinationDetails === undefined) return [];
        const vaccinationList = {
            baseDate: enrolment.individual.dateOfBirth,
            detail: {uuid: vaccinationDetails.uuid},
            items: vaccinationDetails.items.map(vi => ({
                detail: {uuid: vi.uuid}
            }))
        };
        return [vaccinationList];
    }
}



module.exports = {CheckListViewFilterJNPCT, ChildVaccinationChecklist};