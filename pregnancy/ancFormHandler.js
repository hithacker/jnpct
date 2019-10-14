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

const AncFormViewFilter = RuleFactory("9bf17b07-3e6b-414a-a96e-086fc9c5ef6a", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');
const ancDecision = RuleFactory("9bf17b07-3e6b-414a-a96e-086fc9c5ef6a", "Decision");

const isAbnormalWeightGain = (programEncounter) => {
    const {programEnrolment, encounterDateTime} = programEncounter;
    return !lib.calculations.isNormalWeightGain(programEnrolment, programEncounter, encounterDateTime);
};

const isBelowNormalWeightGain = (programEncounter) => {
    const {programEnrolment, encounterDateTime} = programEncounter;
    return lib.calculations.isBelowNormalWeightGain(programEnrolment, programEncounter, encounterDateTime);
};

const calculateBMI = (programEncounter) => {
    const latestHeightObs = programEncounter.programEnrolment.findLatestObservationInEntireEnrolment('Height', programEncounter);
    const currentWeightObs = programEncounter.findObservation("Weight");

    const latestHeight = latestHeightObs && latestHeightObs.getReadableValue();
    const currentWeight = currentWeightObs && currentWeightObs.getReadableValue();
    return _.some([currentWeight, latestHeight], _.isNil) ?
                null
                : lib.C.calculateBMI(currentWeight, latestHeight);
};


@AncFormViewFilter("2f291a9a-3e66-4417-97c7-13474981f6f9", "JNPCT Anc Form View Filter", 100.0, {})
class PregnancyAncFormViewFilterHandlerJNPCT {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new PregnancyAncFormViewFilterHandlerJNPCT(), programEncounter, formElementGroup, today);

    }

    @WithName("Mamta card")
    @WithStatusBuilder
    a1([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("Mamta card").is.defined
    .or.when.latestValueInPreviousEncounters("Mamta card").is.notDefined
    return statusBuilder.build();
    }

    @WithName("IF YES THEN WRITE NUMBER OF TABLET SWALLOWED")
    @WithStatusBuilder
    a2([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Is she taking iron/folic acid tablet?").is.yes;
    }

    @WithName("IF YES THEN WRITE NUMBER OF CALCIUM TABLET SWALLOWED")
    @WithStatusBuilder
    a3([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Is she taking calcium tablet?").is.yes;
    }


    @WithName("Height")
    @WithStatusBuilder
    a4([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("Height").is.defined
    .or.when.latestValueInPreviousEncounters("Height").is.notDefined
    return statusBuilder.build();
    }

    bmi(programEncounter, formElement) {
        let weight = programEncounter.getObservationValue('Weight');
        let height = programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment('Height', programEncounter);
        let bmi = '';
        if (_.isNumber(height) && _.isNumber(weight)) {
            bmi = lib.C.calculateBMI(weight, height);
        }
        return new FormElementStatus(formElement.uuid, true, bmi);
    }

    @WithName("IF yes then since how many days")
    @WithStatusBuilder
    a5([], statusBuilder) {
          statusBuilder.show().when.valueInEncounter("pedal oedema is present").is.yes;
    }

    @WithName("Sickle cell test  done")
    @WithStatusBuilder
    a6([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("Sickle cell test  done").is.defined
    .or.when.latestValueInPreviousEncounters("Sickle cell test  done").is.notDefined
    return statusBuilder.build();
    }

    @WithName("IF YES, result of sickle cell test")
    @WithStatusBuilder
    a7([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Sickle cell test  done").is.yes;
    }

    @WithName("If YES then write E.D.D as per USG")
    @WithStatusBuilder
    a8([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("Complete hospital checkup done").is.yes;
    }

    @WithName("If YES then write E.D.D as per USG")
    @WithStatusBuilder
    a9([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("If YES then write E.D.D as per USG").is.defined
    .or.when.latestValueInPreviousEncounters("If YES then write E.D.D as per USG").is.notDefined
    return statusBuilder.build();
    }

    @WithName("USG Scanning Report - Number of foetus")
    @WithStatusBuilder
    a10([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("USG Scanning Report - Number of foetus").is.defined
    .or.when.latestValueInPreviousEncounters("USG Scanning Report - Number of foetus").is.notDefined
    return statusBuilder.build();
    }

    @WithName("USG Scanning Report - Liquour")
    @WithStatusBuilder
    a11([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("USG Scanning Report - Liquour").is.defined
    .or.when.latestValueInPreviousEncounters("USG Scanning Report - Liquour").is.notDefined
    return statusBuilder.build();
    }

    @WithName("USG Scanning Report - Placenta Previa")
    @WithStatusBuilder
    a12([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("USG Scanning Report - Placenta Previa").is.defined
    .or.when.latestValueInPreviousEncounters("USG Scanning Report - Placenta Previa").is.notDefined
    return statusBuilder.build();
    }

    @WithName("Foetal presentation")
    @WithStatusBuilder
    a13([programEncounter], statusBuilder) {
    statusBuilder.show().when.valueInEncounter("Foetal presentation").is.defined
    .or.when.latestValueInPreviousEncounters("Foetal presentation").is.notDefined
    return statusBuilder.build();
    }

   @WithName("T.T vaccine recieved?")
   @WithStatusBuilder
   a14([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters('T.T vaccine recieved?').is.notDefined
            .or.when.valueInEncounter('T.T vaccine recieved?').is.defined;
    }

    @WithName("TT 1")
    @WithStatusBuilder
    a15([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters('TT 1').is.notDefined
            .or.when.valueInEncounter('TT 1').is.defined;
    }
    @WithName("TT 2")
    @WithStatusBuilder
    a16([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters('TT 2').is.notDefined
            .or.when.valueInEncounter('TT 2').is.defined;
    }

   @WithName("TT Booster")
   @WithStatusBuilder
   a17([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters('TT Booster').is.notDefined
            .or.when.valueInEncounter('TT Booster').is.defined;
    }


   @WithStatusBuilder
   planToDoDelivery([], statusBuilder) {
      statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
    }

   @WithStatusBuilder
   placeOfDelivery([], statusBuilder) {
      statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   whoWillAccompanyAtTheTimeOfDelivery([], statusBuilder) {
      statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   counsellingFor108([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }


   @WithStatusBuilder
   planInWhichHospital([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   moneySaved([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   whoGivesBloodWhenRequired([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   makeClothesReadyForTheDeliveryAndNewBornBaby([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   counsellingDoneForTheRiskFactorsMorbiditiesToAllFamilyMembers([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   counsellingDoneForTheGovernmentScheme([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   chiranjiviYojnaFormIsReady([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   haveYouEnrolledInAnyGovernmentScheme([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(5);
   }

   @WithStatusBuilder
   completeHospitalCheckupDone([], statusBuilder) {
       statusBuilder.show().whenItem(moment(statusBuilder.context.programEncounter).diff(statusBuilder.context.programEncounter.programEnrolment.getObservationValue('Last menstrual period'), 'months', true)).is.greaterThan(3);
   }


}

@ancDecision("efcef7fd-fa11-4ed9-b389-d977755c883d", "Anc Form Decision", 100.0, {})
 export class AncFormDecisionHandler {
     static highRisk(programEncounter) {
         const complicationsBuilder = new ComplicationsBuilder({
             programEncounter: programEncounter,
             complicationsConcept: "High Risk Conditions"
         });

         complicationsBuilder.addComplication("Irregular weight gain")
              .when.valueInEncounter("Weight").lessThanOrEqualTo(35);

        complicationsBuilder.addComplication("Irregular weight gain")
            .whenItem(isAbnormalWeightGain(programEncounter)).is.truthy;

        complicationsBuilder.addComplication('Low BMI')
             .when.valueInEncounter('BMI').lessThan(18.5);

        complicationsBuilder.addComplication('High BMI')
             .when.valueInEncounter('BMI').greaterThan(24.9);

        complicationsBuilder.addComplication("Rh Negative Blood Group")
             .when.valueInRegistration("Blood group").containsAnyAnswerConceptName("A+","B+","AB+","O+", "A-","AB-","O-", "B-");

        complicationsBuilder.addComplication("Pedal Edema Present")
             .when.valueInEncounter("pedal oedema is present").containsAnswerConceptName("Yes");

        complicationsBuilder.addComplication("Pallor Present")
            .when.valueInEncounter("Pallor").containsAnswerConceptName("Present");

        complicationsBuilder.addComplication("Hypertension")
            .when.valueInEncounter("B.P - Systolic").greaterThanOrEqualTo(140);

        complicationsBuilder.addComplication("Hypertension")
            .when.valueInEncounter("B.P - Diastolic").greaterThanOrEqualTo(90);

        complicationsBuilder.addComplication('Low Temperature')
          .when.valueInEncounter('Temperature').lessThan(97.5);

        complicationsBuilder.addComplication("High Temperature")
           .when.valueInEncounter("Temperature").greaterThan(99.5);

       complicationsBuilder.addComplication("Having convulsions")
            .when.valueInEncounter("Has she been having convulsions?").containsAnswerConceptName("Present");

       complicationsBuilder.addComplication("Jaundice (Icterus)")
            .when.valueInEncounter("Jaundice (Icterus)").containsAnswerConceptName("Present");

       complicationsBuilder.addComplication("Breast Examination - Nipple")
             .when.valueInRegistration("Breast Examination - Nipple").containsAnyAnswerConceptName("Retracted", "Flat");

       complicationsBuilder.addComplication("Is there any danger sign")
             .when.valueInRegistration("Is there any danger sign")
             .containsAnyAnswerConceptName("Malaria","eclampsia","APH","Foul smelling menses","twin pregnancy",
             "fever","difficult breathing","severe vomiting","problems in laboratory report",
             "Blurred vision","Reduced fetal movement", "Other");

       complicationsBuilder.addComplication("High blood sugar")
               .when.valueInEncounter("Blood Sugar").is.greaterThanOrEqualTo(140);

       complicationsBuilder.addComplication("VDRL")
              .when.valueInEncounter("VDRL").containsAnswerConceptName("Positive");

       complicationsBuilder.addComplication("HIV/AIDS Test")
              .when.valueInEncounter("HIV/AIDS Test").containsAnswerConceptName("Positive");

       complicationsBuilder.addComplication("HbsAg")
             .when.valueInEncounter("HbsAg").containsAnswerConceptName("Positive");

       complicationsBuilder.addComplication("Sickling Test")
           .when.valueInEncounter("IF YES, result of sickle cell test").containsAnyAnswerConceptName("DISEASE", "TRAIT","Normal");

       complicationsBuilder.addComplication("Urine Albumin")
           .when.valueInEncounter("Urine Albumin").containsAnyAnswerConceptName("Trace", "+1", "+2", "+3", "+4");

       complicationsBuilder.addComplication("Urine Sugar")
           .when.valueInEncounter("Urine Sugar").containsAnyAnswerConceptName("Trace", "+1", "+2", "+3", "+4");

       complicationsBuilder.addComplication("USG Scanning Report - Number of foetus")
           .when.valueInEncounter("USG Scanning Report - Number of foetus").containsAnyAnswerConceptName("Two", "Three", "More than three");

       complicationsBuilder.addComplication("USG Scanning Report - Liquour")
          .when.valueInEncounter("USG Scanning Report - Liquour").containsAnyAnswerConceptName("Increased", "Decreased");

       complicationsBuilder.addComplication("USG Scanning Report - Placenta Previa")
          .when.valueInEncounter("USG Scanning Report - Placenta Previa").containsAnyAnswerConceptName("Previa");

       complicationsBuilder.addComplication("Foetal presentation")
          .when.valueInEncounter("Foetal presentation").containsAnyAnswerConceptName("Transverse", "Breech");

       complicationsBuilder.addComplication("Foetal movements")
         .when.valueInEncounter("Foetal movements").containsAnyAnswerConceptName("Absent", "Reduced");

       complicationsBuilder
                    .addComplication("Severe Anemia")
                    .when.valueInEncounter("H.B")
                    .is.lessThanOrEqualTo(7);

       complicationsBuilder
                   .addComplication("Moderate")
                   .when.valueInEncounter("Hb")
                   .is.greaterThanOrEqualTo(7.1)
                   .and.valueInEncounter("H.B")
                   .is.lessThanOrEqualTo(10);

    return complicationsBuilder.getComplications();

 }

    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(AncFormDecisionHandler.highRisk(programEncounter));
        return decisions;
 }

}

module.exports = {PregnancyAncFormViewFilterHandlerJNPCT,AncFormDecisionHandler};


