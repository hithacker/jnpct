import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper,
    WithName,
    complicationsBuilder as ComplicationsBuilder
} from 'rules-config/rules';

const filter = RuleFactory('f410de41-c0cc-4bac-a5a2-2e98d10572e9', 'ViewFilter');
const birthFormDecision = RuleFactory("f410de41-c0cc-4bac-a5a2-2e98d10572e9", "Decision");

const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@filter('88e8cf17-fd37-4273-b668-2ae6efc108e9', 'ChildBirthFormHandler', 100.0)
class ChildBirthFormHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new ChildBirthFormHandler(), programEncounter, formElementGroup, today);
    }

    @WithName('When did breast feeding start?')
    @WithStatusBuilder
    _a1([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Did breast feeding start within 1 hour of birth?").is.no;
    }

    @WithName('Other Birth Defect')
    @WithStatusBuilder
    _a2([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Birth Defects").containsAnswerConceptName("Other");
    }

}

@birthFormDecision("1896e74b-02a7-4019-ba82-aa5053330d65", "BirthFormDecisions", 100.0, {})
class BirthFormDecisions {
    static highRisks(programEncounter) {
            const complicationsBuilder = new ComplicationsBuilder({
                programEncounter: programEncounter,
                complicationsConcept: "High Risk Child"
            });

        complicationsBuilder.addComplication("Low birth weight")
            .when.valueInEncounter("Birth Weight").lessThan(2);


        complicationsBuilder.addComplication("Baby did not breast feed within 1 hour of birth")
        .when.valueInEncounter("Did breast feeding start within 1 hour of birth?").is.no;

        complicationsBuilder.addComplication("Icterus present")
        .when.valueInEncounter("Icterus present within 24 hrs of birth?")
        .containsAnswerConceptName("Present"); 

       complicationsBuilder.addComplication("Gestational age at birth is not in term")
        .when.valueInEncounter("Gestational age category at birth")
        .containsAnyAnswerConceptName("Preterm (<28 Weeks)","Very Preterm");

        complicationsBuilder.addComplication("Baby did not cry soon after birth")
        .when.valueInEncounter("Did the baby cry soon after birth?")
        .containsAnyAnswerConceptName("Delay Cry","No Cry");

        complicationsBuilder.addComplication("Birth Defects")
        .when.valueInEncounter('Birth Defects')
        .containsAnyAnswerConceptName("Cleft Lip","Cleft Palate","Umblical Hernia",
        "Inguinal Hernia","Congenital Heart Disease","Neural tube defects, Imperforated Anus",
        "Club foot","Other");

        complicationsBuilder.addComplication("Colour of child is not normal")
        .when.valueInEncounter("Colour of child")
        .containsAnyAnswerConceptName("Blue/Pale","Body pink but hands and feet blue/pale");

        complicationsBuilder.addComplication("High temperature")
        .when.valueInEncounter("Temperature of infant").is.greaterThan(37.5);

        return complicationsBuilder.getComplications();
    }


    static referToHospital(programEncounter) {
        const referralBuilder = new ComplicationsBuilder({
        programEncounter: programEncounter,
        complicationsConcept: "Refer to the hospital for"
        });
        
        referralBuilder.addComplication("Life threatening abnormality")
        .when.valueInEncounter('Is there life threatening abnormality?')
        .is.yes;

        referralBuilder.addComplication("Foam coming out from child's mouth")
        .when.valueInEncounter("Is foam coming out from child's mouth?")
        .is.yes;

        referralBuilder.addComplication("Refer child to hospital immediately and keep child warm in clothes")
        .when.valueInEncounter('Was child wrapped in 3-4 folded clothes?')
        .is.no;

        referralBuilder.addComplication("Blood is coming from body part")
        .when.valueInEncounter('Is blood coming out from any part of body?')
        .is.yes;

        referralBuilder.addComplication("High respiratory rate")
        .when.valueInEncounter('Child Respiratory Rate')
        .is.greaterThan(60);

        return referralBuilder.getComplications();
    }


    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(BirthFormDecisions.highRisks(programEncounter));
        decisions.encounterDecisions.push(BirthFormDecisions.referToHospital(programEncounter));
        return decisions;
    }
}

module.exports = {ChildBirthFormHandler, BirthFormDecisions};