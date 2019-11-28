import {
    StatusBuilderAnnotationFactory,
    RuleFactory,
    FormElementsStatusHelper,
    WithName,
    complicationsBuilder as ComplicationsBuilder,
} from 'rules-config/rules';
import _ from 'lodash';

const filter = RuleFactory('4548364c-ff22-447b-baec-3c63935a7e00', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

const followupDecision = RuleFactory("4548364c-ff22-447b-baec-3c63935a7e00", "Decision");

@filter('366417f5-298f-4c72-897a-c384ca2cc2a3', 'childFollowupHandler', 100.0)
class childFollowupHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new childFollowupHandler(), programEncounter, formElementGroup, today);
    }

    @WithName('Then write the problem')
    @WithStatusBuilder
    cf1([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Ask the mother now: Child has any problem').containsAnswerConceptName('Yes')
    }

    @WithName('child is referred?')
    @WithStatusBuilder
    cf2([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Is the child able to drink or breastfeed').containsAnswerConceptName('No')
            .and.when.valueInEncounter('Does the child vomits everything').containsAnswerConceptName('Yes')
            .or.when.valueInEncounter('Has the child had convulsion').containsAnswerConceptName('Yes')
            .or.when.valueInEncounter('See the child is lethargic or unconsious').containsAnswerConceptName('Yes')
            .or.when.valueInEncounter('Is there general danger sign').containsAnswerConceptName('Yes')
    }

    @WithName('Since how many days')
    @WithName('count breaths in one minute')
    @WithName('Does the child has fast breathing')
    @WithName('look for chest indrwaning ')
    @WithStatusBuilder
    cf3([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Does the child have cough or difficult breathing')
            .containsAnswerConceptName('Yes')
    }

    @WithName('for how long days')
    @WithName('is there any blood in the stool')
    @WithName('check the childs general condition,is the child lethargic or unconsious ?')
    @WithName('restless or irritable')
    @WithName('look for sunken eyes')
    @WithName('offer the child fluid , is the child unable to drink or drinking poorly')
    @WithName('drinking eagerly')
    @WithName('Is the child thirsty')
    @WithName('Pinch the skin of the abdomen . Does it go back very slowly (Longer than 2 seconds )')
    @WithName('does it go back slowly(less than 2 second)')
    @WithStatusBuilder
    cf4([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('does child has diorrhea')
            .containsAnswerConceptName('Yes')
    }

    @WithName('does child feels hot by touch')
    @WithName('what is the axillary temprature (in degree Centigrade)')
    @WithName('fever since how many days ')
    @WithName('if fever since more than 7 days then look for stiff neck')
    @WithName('does child has daily fever ')
    @WithStatusBuilder
    cf5([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('does child has history of fever')
            .containsAnswerConceptName('Yes')
    }

    @WithName('if child age is 2-6 month then according to age and weight in which grade')
    @WithStatusBuilder
    cf6([programEncounter], statusBuilder) {
        const age = programEncounter.programEnrolment.individual.getAgeInMonths();

            statusBuilder.show().whenItem(age < 6).is.truthy
                .and.whenItem(age > 2).is.truthy;

    }

    @WithName('does child have visible severe wasting')
    @WithName('is there oedema on both feet')
    @WithName('ACOORING TO OEDEMA ON BOTH FEET CHILD IS IN WHICH GRADE')
    @WithName('weight')
    @WithName('height of child')
    @WithName('according to Weight for age child is in which grade')
    @WithName('MUAC of child')
    @WithName('according to MUAC child is in which grade')
    @WithName('if  child is in SAM then refered to CMTC ?')
    @WithName('refer date')
    @WithStatusBuilder
    cf61([programEncounter], statusBuilder) {
        const age = programEncounter.programEnrolment.individual.getAgeInMonths();

            statusBuilder.show().whenItem(age > 6).is.truthy;

    }

    @WithName('ACOORING TO OEDEMA ON BOTH FEET CHILD IS IN WHICH GRADE')
    @WithStatusBuilder
    cf7([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('is there oedema on both feet')
            .containsAnswerConceptName('Yes')
    }

    @WithName('refer date')
    @WithStatusBuilder
    cf8([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('if  child is in SAM then refered to CMTC ?')
            .containsAnswerConceptName('Yes')
    }

    @WithName('Whether child still get breastfeed')
    @WithStatusBuilder
    cf9([programEncounter], statusBuilder) {
        const age = programEncounter.programEnrolment.individual.getAge();
        statusBuilder.show().whenItem(age._durationValue < 2).is.truthy;
    }

    @WithName('if yes then how many times in 24 hour')
    @WithName('breast feed given in night also')
    @WithStatusBuilder
    cf10([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Whether child stiil get breastfeed')
            .containsAnswerConceptName('Yes')
    }

    @WithName('how many times in 24 hours')
    @WithName('how much food is given')
    @WithStatusBuilder
    cf11([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('does child recived any kind of liquid or solid food')
            .containsAnswerConceptName('Yes')
    }

    @WithName('write the complaint')
    @WithStatusBuilder
    cf12([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('does child has any other complaint')
            .containsAnswerConceptName('Yes')
    }

    @WithName('recived food packets from anganwadi')
    @WithStatusBuilder
    cf13([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Does child is going to anganwadi')
            .containsAnswerConceptName('Yes')
    }

    @WithName('Child Referred ?')
    @WithName('who refered ?')
    @WithName('Place of referral')
    @WithStatusBuilder
    cf14([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('does child require to refer')
            .containsAnswerConceptName('Yes')
    }


}

@followupDecision("39021909-fad8-49c1-9892-2c266b08a752", "Follow Up Decision", 100)
class FollowDecisions {
    static exec(programEncounter, decisions, contex, today) {
        // decisions.encounterDecisions.push(FollowDecisions.counseling(programEncounter));
        decisions.encounterDecisions.push(FollowDecisions.referToHospital(programEncounter));
        return decisions;
    }

    static referToHospital(programEncounter) {
        const decisionBuilder = new ComplicationsBuilder({
            programEncounter: programEncounter,
            complicationsConcept: "Refer to the hospital for"
        });


        decisionBuilder.addComplication("Not able to drink or breastfeed")
            .when.valueInEncounter("Is the child able to drink or breastfeed")
            .is.no;

        decisionBuilder.addComplication("Child Vomiting everything")
            .when.valueInEncounter("Does the child vomits everything")
            .is.yes;

        decisionBuilder.addComplication("child had convulsion")
            .when.valueInEncounter("Has the child had convulsion")
            .is.yes;


        decisionBuilder.addComplication("child is lethargic or unconsious")
            .when.valueInEncounter("See the child is lethargic or unconsious")
            .is.yes;


        decisionBuilder.addComplication("there is general danger sign")
            .when.valueInEncounter("Is there general danger sign")
            .is.yes;


        decisionBuilder.addComplication("Fast breathing")
            .when.valueInEncounter("Does the child has fast breathing")
            .is.yes;


        decisionBuilder.addComplication("chest indrwaning")
            .when.valueInEncounter("look for chest indrwaning")
            .is.yes;

        decisionBuilder.addComplication("child has complaint")
            .when.valueInEncounter("does child has any other complaint")
            .is.yes;


        return decisionBuilder.getComplications();

    }

}


module.exports = {childFollowupHandler, FollowDecisions};