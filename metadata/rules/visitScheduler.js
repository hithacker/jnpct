import moment from 'moment';
import {RuleFactory} from 'rules-config/rules';
import RuleHelper from "./RuleHelper";
import lib from './lib';

const hasExitedProgram = programEncounter => programEncounter.programEnrolment.programExitDateTime;

const getEarliestDate = programEncounter =>
    moment(programEncounter.earliestVisitDateTime)
        .startOf("day")
        .toDate();

        const encounterSchedule = {
            // "ANC 1": {earliest: 1, max: 15},
            "ANC 2": {earliest: 168, max: 197},
            "ANC 3": {earliest: 203, max: 253},
            "PNC 1": {earliest: 1, max: 8},
            "PNC 2": {earliest: 28, max: 36},
            "PNC 3": {earliest: 50, max: 61},
            "PNC 4": {earliest: 42, max: 42}
        };

        const encounterScheduleHighRisk = {
            // "ANC 1": {earliest: 1, max: 8},
            "ANC 2": {earliest: 112, max: 123},
            "ANC 3": {earliest: 168, max: 179},
            "ANC 4": {earliest: 196, max: 207},
            "ANC 5": {earliest: 224, max: 235}            
        };

@RuleFactory("d40e8aa2-8cae-4b09-ad30-2da6c1690206", "VisitSchedule")
("3d13cc9a-c1fe-49e9-8980-360378f8199d", "JNPCT Pregnant Woman Enrolment Visit schedule", 100.0)
class ScheduleVisitDuringPregnantWomanEnrolment {
    static exec(programEnrolment, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createEnrolmentScheduleBuilder(programEnrolment, visitSchedule);
        let enrolmentHighRisk = programEnrolment.getObservationValue('High Risk');
        let maxDateOffset = 15;
        if (enrolmentHighRisk) 
            maxDateOffset = 8;
      
        RuleHelper.addSchedule(scheduleBuilder, 'ANC 1','ANC', getEarliestDate(programEnrolment.enrolmentDateTime), maxDateOffset);
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@RuleFactory("9bf17b07-3e6b-414a-a96e-086fc9c5ef6a", "VisitSchedule")
("f3c6201c-d800-4db9-92cc-f1151afa718b", "ScheduleVisitsDuringANC", 10.0)
class ScheduleVisitsDuringANC {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {    
        const lmpDate = programEncounter.programEnrolment.getObservationValue('Last menstrual period');
        const highRiskANC = programEncounter.getObservationValue('High Risk Conditions');
        const encounters = [];
        var schedule = [];

    const addEncounter = function (baseDate, encounterType, name) {        
        //if (programEnrolment.hasEncounter(encounterType, name)) return;
           
        if(highRiskANC){
            schedule = encounterScheduleHighRisk[name === undefined ? encounterType : name];
        } else {
            schedule = encounterSchedule[name === undefined ? encounterType : name];
        }
        encounters.push({
                    name: name,
                    encounterType: encounterType,
                    earliestDate: lib.C.addDays(baseDate, schedule.earliest),
                    maxDate:lib.C.addDays(baseDate, schedule.max)
                });       
     };

    if (!hasExitedProgram(programEncounter)){             
       if (lmpDate) {
           addEncounter(lmpDate, 'ANC', 'ANC 2');
           addEncounter(lmpDate, 'ANC', 'ANC 3'); 

                if(highRiskANC){
                addEncounter(lmpDate, 'ANC', 'ANC 4'); 
                addEncounter(lmpDate, 'ANC', 'ANC 5');    
                }
       }    
   }
        return encounters;
    }
}

export {
    ScheduleVisitDuringPregnantWomanEnrolment,
    ScheduleVisitsDuringANC
}