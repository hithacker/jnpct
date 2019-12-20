import moment from 'moment';
import {RuleFactory} from 'rules-config/rules';
import RuleHelper from "./RuleHelper";
import lib from './lib';
import _ from 'lodash';

const hasExitedProgram = programEncounter => programEncounter.programEnrolment.programExitDateTime;

const getEarliestDate = programEnrolment =>
    moment(programEnrolment.earliestVisitDateTime)
        .startOf("day")
        .toDate();

const getEarliestECFollowupDate = (eventDate) => {
            return moment(eventDate).add(2, 'months').toDate();
        };

        const encounterSchedule = {
            "ANC 2": {earliest: 168, max: 197},
            "ANC 3": {earliest: 203, max: 253},
            "PNC 2": {earliest: 28, max: 36},
            "PNC 3": {earliest: 50, max: 61},
            "Abortion Followup Visit-2": {earliest: 28, max: 36},
            "Abortion Followup Visit-3": {earliest: 50, max: 61}
        };

        const encounterScheduleHighRisk = {
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

@RuleFactory("0b37b679-a33f-42b3-a455-a84eaea7b5d8", "VisitSchedule")
("0f481c77-ffb2-46ee-9b93-8de09e0074c7", "JNPCT Eligible Couple Enrolment Visit schedule", 100.0)
class ScheduleVisitDuringEligibleCoupleEnrolment {
    static exec(programEnrolment, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createEnrolmentScheduleBuilder(programEnrolment, visitSchedule);
        RuleHelper.addSchedule(scheduleBuilder, 'Eligible Couple Followup','Eligible Couple Followup', getEarliestECFollowupDate(programEnrolment.enrolmentDateTime), 15);
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@RuleFactory("9bf17b07-3e6b-414a-a96e-086fc9c5ef6a", "VisitSchedule")
("f3c6201c-d800-4db9-92cc-f1151afa718b", "ScheduleVisitsDuringANC", 10.0)
class ScheduleVisitsDuringANC {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) { 
        const lmpDate = programEncounter.programEnrolment.getObservationValue('Last menstrual period');
        const highRiskANC = programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment('High Risk Conditions');
        const encounters = [];
        var schedule = [];

    const addEncounter = function (baseDate, encounterType, name) {    
        if (programEncounter.programEnrolment.hasEncounter(encounterType, name)) return;           
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
        if (programEncounter.name === 'ANC 1') 
           addEncounter(lmpDate, 'ANC', 'ANC 2');
        else if (programEncounter.name === 'ANC 2') 
           addEncounter(lmpDate, 'ANC', 'ANC 3'); 
        else if (programEncounter.name === 'ANC 3' && highRiskANC)
           addEncounter(lmpDate, 'ANC', 'ANC 4'); 
        else if (programEncounter.name === 'ANC 4' && highRiskANC)
                addEncounter(lmpDate, 'ANC', 'ANC 5');            
       }    
    }

    return encounters;
    }
}

@RuleFactory("cbe0f44c-580a-4311-ae34-cef2e4b35330", "VisitSchedule")
("e0a84446-c388-4ce6-b740-a949ffff6c42", "JNPCT PNC Visit schedule", 100.0)
class ScheduleVisitDuringDelivery {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);      
        const deliveryDate = programEncounter.getObservationValue('Date of delivery');

        RuleHelper.addSchedule(scheduleBuilder, 'PNC 1','PNC', deliveryDate, 8);
        return scheduleBuilder.getAllUnique("encounterType");
    }
}


@RuleFactory("c4123189-c7b6-49e1-bbf3-82b3127750b2", "VisitSchedule")
("c66ae70a-b5d0-42a0-8b61-293169de26d0", "ScheduleVisitsDuringPNC", 10.0)
class ScheduleVisitsDuringPNC {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {    
        const deliveryDate = programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment('Date of delivery')
        const encounters = [];
        var schedule = [];
      
    const addEncounter = function (baseDate, encounterType, name) {        
        if (programEncounter.programEnrolment.hasEncounter(encounterType, name)) return;  
        schedule = encounterSchedule[name === undefined ? encounterType : name];
        encounters.push({
                    name: name,
                    encounterType: encounterType,
                    earliestDate: lib.C.addDays(baseDate, schedule.earliest),
                    maxDate: lib.C.addDays(baseDate, schedule.max)
                });       
     };

    if (!hasExitedProgram(programEncounter)){             
       if (deliveryDate) {
        if (programEncounter.name === 'PNC 1') 
           addEncounter(deliveryDate, 'PNC', 'PNC 2');
        else if (programEncounter.name === 'PNC 2') 
           addEncounter(deliveryDate, 'PNC', 'PNC 3');   
        }
    }
        return encounters;
    }
}

@RuleFactory("6ff66edf-30c9-49c5-821c-c44f371b31b2", "VisitSchedule")
("d4094b19-69f6-4c7c-8c8d-c3c15586878d", "JNPCT Abortion Followup Visit schedule", 100.0)
class ScheduleVisitDuringAbortion {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);      
        const abortionDate = programEncounter.getObservationValue('Date of Abortion/MTP');

        RuleHelper.addSchedule(scheduleBuilder, 'Abortion Followup Visit-1','Abortion Followup', abortionDate, 8);
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@RuleFactory("20e3c4e9-1e58-4a11-ba5c-9f3c745c7ef7", "VisitSchedule")
("64e95c2f-e754-44fe-81d4-2c9289e0da16", "ScheduleVisitsDuringAbortionFollowup", 10.0)
class ScheduleVisitsDuringAbortionFollowup {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {   
        const abortionDate = programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment('Date of Abortion/MTP')
        const encounters = [];
        var schedule = [];
      
    const programName = enc.programEnrolment.program.operationalProgramName 
                        || enc.programEnrolment.program.name;
    
    const addEncounter = function (baseDate, encounterType, name) {        
        if (programEncounter.programEnrolment.hasEncounter(encounterType, name)) return;  
        schedule = encounterSchedule[name === undefined ? encounterType : name];
        console.log('abortionDate schedule',schedule);
        encounters.push({
                    name: name,
                    encounterType: encounterType,
                    earliestDate: lib.C.addDays(baseDate, schedule.earliest),
                    maxDate:lib.C.addDays(baseDate, schedule.max)
                });       
     };

    //  const addECEncounter = function (programEncounter) {        
    //     if (programEncounter.programEnrolment.hasEncounter(encounterType, name)) return;  
    //     schedule = encounterSchedule[name === undefined ? encounterType : name];
    //     console.log('abortionDate schedule',schedule);
    //     encounters.push({
    //                 name: name,
    //                 encounterType: encounterType,
    //                 earliestDate: lib.C.addDays(baseDate, schedule.earliest),
    //                 maxDate:lib.C.addDays(baseDate, schedule.max)
    //             });       
    //  };
            
    if (!hasExitedProgram(programEncounter)){         
       if (abortionDate) {
           if (programEncounter.name === 'Abortion Followup Visit-1') 
           addEncounter(abortionDate, 'Abortion Followup', 'Abortion Followup Visit-2');
           else if (programEncounter.name === 'Abortion Followup Visit-2') 
           addEncounter(abortionDate, 'Abortion Followup', 'Abortion Followup Visit-3');   
        //    else if (programEncounter.name === 'Abortion Followup Visit-3' && programName === 'Eligible couple')
        //    addECEncounter(programEncounter);
        }    
    }
        return encounters;
    }
}

@RuleFactory("1c8bd246-f46e-4250-88bc-1ca567ba03ce", "VisitSchedule")
("c96af83f-5f11-4b6a-92c3-2dcd4b0341c4", "ScheduleVisitsDuringECFollowup", 10.0)
class ScheduleVisitsDuringECFollowup {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {   
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);
        const isPregnant = programEncounter.getObservationReadableValue('Is She Pregnant?');
        
        if(!_.isEqual(isPregnant,'Yes') && !hasExitedProgram(programEncounter)){
        RuleHelper.addSchedule(scheduleBuilder, 'Eligible Couple Followup','Eligible Couple Followup', getEarliestECFollowupDate(programEncounter.earliestVisitDateTime), 15);
        }
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

export {
    ScheduleVisitDuringPregnantWomanEnrolment,
    ScheduleVisitDuringEligibleCoupleEnrolment,
    ScheduleVisitsDuringANC,
    ScheduleVisitDuringDelivery,
    ScheduleVisitsDuringPNC,
    ScheduleVisitDuringAbortion,
    ScheduleVisitsDuringAbortionFollowup,
    ScheduleVisitsDuringECFollowup
}