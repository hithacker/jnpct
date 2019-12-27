import {
    StatusBuilderAnnotationFactory,
    RuleFactory,
    FormElementsStatusHelper,
    WithName,
    FormElementStatus
} from 'rules-config/rules';
import _ from 'lodash';

const getGradeforZscore = (zScore) => {
    let grade;
    if (zScore <= -3) {
        grade = 3;
    }
    else if (zScore > -3 && zScore < -2) {
        grade = 2;
    }
    else if (zScore >= -2) {
        grade = 1;
    }
    return grade;
};

const zScoreGradeStatusMappingWeightForAge = {
    '1': 'Normal',
    '2': 'Moderately Underweight',
    '3': 'Severely Underweight'
};

const zScoreGradeStatusMappingWeightForHeight = [
    ["Severely wasted", -3],
    ["Wasted", -2],
    ["Normal", 1],
    ["Possible risk of overweight", 2],
    ["Overweight", 3],
    ["Obese", Infinity],
];

const weightForHeightStatus = function (zScore) {
    // console.log('zScore',zScore);
    let found = _.find(zScoreGradeStatusMappingWeightForHeight, function (currentStatus) {
        return zScore <= currentStatus[1];
    });
    return found && found[0];
}

const nutritionalStatusForChild = (individual, asOnDate, weight, height) => {
    const zScoresForChild = ruleServiceLibraryInterfaceForSharingModules.common.getZScore(individual, asOnDate, weight, height);
    // console.log('zScoresForChild',zScoresForChild);
    const wfaGrade = getGradeforZscore(zScoresForChild.wfa);
    const wfaStatus = zScoreGradeStatusMappingWeightForAge[wfaGrade];
    const wfh = zScoresForChild.wfh; //weightForHeightStatus(zScoresForChild.wfh);

    return {
        wfaStatus: wfaStatus,
        wfh: wfh
    };
};

const getNutritionalStatusForChild = (programEncounter) => {
    const height = programEncounter.getObservationValue("Height");
    const weight = programEncounter.getObservationValue("Current Weight");
    const encounterDateTime = programEncounter.encounterDateTime;
    const individual = programEncounter.programEnrolment.individual;

    const nutritionalStatus = nutritionalStatusForChild(individual, encounterDateTime, weight, height);
   
    return nutritionalStatus;
};


const filter = RuleFactory('4548364c-ff22-447b-baec-3c63935a7e00', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@filter('366417f5-298f-4c72-897a-c384ca2cc2a3', 'childFollowupHandler', 100.0)
class childFollowupHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new childFollowupHandler(), programEncounter, formElementGroup, today);
    }


    nutritionalStatusOfChild(programEncounter, formElement) {
        const age = programEncounter.programEnrolment.individual.getAgeInMonths();
        var value = '';
        const muac = programEncounter.getObservationValue("MUAC of child");  
        const isOedema = programEncounter.getObservationReadableValue("Is there oedema on both feet");  
        const nutritionalStatus = getNutritionalStatusForChild(programEncounter);
        
        console.log("muac",muac);
        console.log('isOedema',isOedema);
        console.log('nutritionalStatus weight for height',nutritionalStatus.wfh);
      
        if(muac <= 11.5 || _.isEqual(isOedema,'Yes'))
            value = 'SAM';
        else if(muac >= 11.6 && muac <= 12.5 && nutritionalStatus.wfh < 3)
            value = 'MAM';
        else value = 'Normal';

        return new FormElementStatus(formElement.uuid, age > 6, value);
    }

    currentNutritionalStatusAccordingToWeightAndAge(programEncounter, formElement) {
        const nutritionalStatus = getNutritionalStatusForChild(programEncounter);
        // console.log('nutritionalStatus',nutritionalStatus.wfaStatus);
        return new FormElementStatus(formElement.uuid, true, nutritionalStatus.wfaStatus);
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
    // @WithName('weight of child')
    // @WithName('if child age is 2-6 month then according to age and weight in which grade')
    // @WithStatusBuilder
    // cf6([programEncounter], statusBuilder) {
    //     const age = programEncounter.programEnrolment.individual.getAgeInMonths();

    //         statusBuilder.show().whenItem(age < 6).is.truthy
    //             .and.whenItem(age > 2).is.truthy;
    // }

    // @WithName('Weight')      
    // @WithName('Current nutritional status according to weight and age')
    // @WithName('ACOORDING TO OEDEMA ON BOTH FEET CHILD IS IN WHICH GRADE')
    // @WithName('Grade')

    @WithName('Height')
    @WithName('Does child have visible severe wasting')
    @WithName('Is there oedema on both feet')       
    @WithName('MUAC of child')  
    @WithName('If child is in SAM then refered to CMTC?')
    @WithName('refer date')
    @WithStatusBuilder
    cf61([programEncounter], statusBuilder) {
        const age = programEncounter.programEnrolment.individual.getAgeInMonths();
            statusBuilder.show().whenItem(age > 6).is.truthy;
    }

    @WithName('refer date')
    @WithStatusBuilder
    cf8([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('If child is in SAM then refered to CMTC?')
            .containsAnswerConceptName('Yes');
    }

    @WithName('Whether child still get breastfeed')
    @WithStatusBuilder
    cf9([programEncounter], statusBuilder) {
        const age = programEncounter.programEnrolment.individual.getAgeInYears();
        statusBuilder.show().whenItem(age < 2).is.truthy;
    }

    @WithName('if yes then how many times in 24 hour')
    @WithName('breast feed given in night also')
    @WithStatusBuilder
    cf10([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Whether child still get breastfeed')
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

    @WithStatusBuilder
    cf14([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('does child require to refer')
            .containsAnswerConceptName('Yes')
    }
    @WithName('who refered ?')
    @WithName('Place of referral')
    @WithStatusBuilder
    abc([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Child Referred ?')
            .containsAnswerConceptName('Yes')
    }


}
module.exports = {childFollowupHandler};