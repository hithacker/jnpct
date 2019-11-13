import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper
} from 'rules-config/rules';

const filter = RuleFactory('62b5b7ae-f0b3-49c0-b7cb-eb2b616bc89b', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@filter('ffd246fe-cd42-4b4f-84d9-844e6d536d43', 'ChildPNCHandler', 100.0)
class ChildPNCHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new ChildPNCHandler(), programEncounter, formElementGroup, today);
    }

}


module.exports = {ChildPNCHandler};