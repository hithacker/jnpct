import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper,
    FormElementStatusBuilder,
    FormElementStatus,
    WithName
} from 'rules-config/rules';

const ProgramExitViewFilter = RuleFactory("3db7f626-bc87-4cd1-b897-486c9d431905", "ViewFilter");
@ProgramExitViewFilter("a9f5408e-0dff-42f4-aa74-dcae9f7d7986", "Program Exit Filter", 101.0, {})
 class ProgramExitViewFilterHandler {
    static exec(programExit, formElementGroup) {
        return FormElementsStatusHelper.getFormElementsStatuses(new ProgramExitViewFilterHandler(), programExit, formElementGroup);
    }

    reasonForExit(programExit, formElement) {
        const statusBuilder = this._getStatusBuilder(programExit, formElement);
        const programName = programExit.program.name;

        if(programName === 'Child')
        statusBuilder.skipAnswers("Maternal Death");
        else if(programName === 'Pregnancy' || programName === 'Eligible couple')
        statusBuilder.skipAnswers("Child Death");
        
        return statusBuilder.build();
    }

   otherReasonPleaseSpecify(programExit, formElement) {
        const statusBuilder = this._getStatusBuilder(programExit, formElement);
        statusBuilder.show().when.valueInExit("Reason for exit").containsAnswerConceptName("Other");
        return statusBuilder.build();
    }

    _getStatusBuilder(programExit, formElement) {
        return new FormElementStatusBuilder({
            programEnrolment: programExit,
            formElement
        });
    }

}


const statusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');
const filters = RuleFactory("406738d4-c96c-498c-99e7-4389cb454d5c", "ViewFilter");
@filters("7fe6d073-b628-4e2b-a1b8-fb65dade96f5", "Cancel Form filters", 121.0, {})
class ProgramCancellationFormFilters {

  
    @WithName('Cancel reason')
    @statusBuilder
    a11([programEncounter], statusBuilder) {
        const programName = programEncounter.programEnrolment.program.name;
        console.log('programName',programEncounter.programEnrolment.program.name);

        if(programName === 'Child')
        statusBuilder.skipAnswers("Maternal Death");
        else if(programName === 'Pregnancy' || programName === 'Eligible couple')
        statusBuilder.skipAnswers("Child Death");
        
    }

  
    otherReason(programEncounter, formElement) {
        const cancelReasonObs = programEncounter.findCancelEncounterObservation('Visit cancel reason');
        const answer = cancelReasonObs && cancelReasonObs.getReadableValue();
        return new FormElementStatus(formElement.uuid, answer === 'Other');
    }

    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper.getFormElementsStatusesWithoutDefaults(new ProgramCancellationFormFilters(), programEncounter, formElementGroup, today);
    }
}


module.exports = {ProgramExitViewFilterHandler, ProgramCancellationFormFilters};

 
