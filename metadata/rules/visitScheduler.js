import moment from 'moment';
import {RuleFactory} from 'rules-config/rules';
import RuleHelper from "./RuleHelper";
import lib from './lib';
import _ from 'lodash';

const hasExitedProgram = programEncounter => programEncounter.programEnrolment.programExitDateTime;

const getEarliestDate = (programEnrolment) =>
    moment(programEnrolment.enrolmentDateTime)
        .startOf("day")
        .toDate();

const getEarliestEncounterDate = (programEncounter) =>
    moment(programEncounter.earliestVisitDateTime)
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
            "Abortion Followup Visit-3": {earliest: 50, max: 61},
            "Child PNC 2": {earliest: 28, max: 36},
            "Child PNC 3": {earliest: 50, max: 61}
            // "Eligible Couple Followup": {earliest: 51, max: 65}
        };

        const encounterScheduleHighRisk = {
            "ANC 2": {earliest: 112, max: 123},
            "ANC 3": {earliest: 168, max: 179},
            "ANC 4": {earliest: 196, max: 207},
            "ANC 5": {earliest: 224, max: 235}            
        };

        const encounterScheduleLowBirthWeight = {
            "Child PNC 2": {earliest: 7, max: 11}
        };

        // const encounterScheduleANC =[
        //     {"name" : "ANC 2","earliest": 168,"max" : 197},
        //     {"name" : "ANC 3","earliest": 203,"max" : 253}
        // ];

        // const encounterScheduleHighRisk =[
        //     {"name" : "ANC 2","earliest": 112,"max" : 123},
        //     {"name" : "ANC 3","earliest": 168,"max" : 179},
        //     {"name" : "ANC 4","earliest": 196,"max" : 207},
        //     {"name" : "ANC 5","earliest": 224,"max" : 235},
        // ];

        const ecounterChildFollowUpNormal = [
            {"earliest": 225,"max" : 240},
            {"earliest": 315,"max" : 330},
            {"earliest": 405,"max" : 420},
            {"earliest": 495,"max" : 510},
            {"earliest": 585,"max" : 600},
            {"earliest": 705,"max" : 720}
        ]
       
        const scheduleVisitsDuringECFollowup = (programEncounter, scheduleBuilder) => {
              const isPregnant = programEncounter.getObservationReadableValue('Is She Pregnant?');
                if(!_.isEqual(isPregnant,'Yes') && !hasExitedProgram(programEncounter)){
                    scheduleBuilder.add({
                        name: 'Eligible Couple Followup',
                        encounterType: 'Eligible Couple Followup',
                        earliestDate: getEarliestECFollowupDate(programEncounter.earliestVisitDateTime),
                        maxDate: lib.C.addDays(getEarliestECFollowupDate(programEncounter.earliestVisitDateTime), 15)
                        });  
                }
            return ;
        }

        const scheduleVisitsDuringAbortionFollowup = (programEncounter, scheduleBuilder) => {
            const abortionDate = programEncounter.programEnrolment
            .getObservationReadableValueInEntireEnrolment('Date of Abortion/MTP');
            var schedule = [];

        // const programNames = [];
        // const enrolments = programEncounter.programEnrolment.individual.enrolments;
        // enrolments.forEach(e => programNames.push(e.program.operationalProgramName || e.program.name));
        // console.log('programNames',programNames);
        
        const addEncounter = function (baseDate, encounterType, name) {        
            if (programEncounter.programEnrolment.hasEncounter(encounterType, name)) return;  
            schedule = encounterSchedule[name === undefined ? encounterType : name];
            // console.log('abortionDate schedule',schedule);

            scheduleBuilder.add({
                                name: name,
                                encounterType: encounterType,
                                earliestDate: lib.C.addDays(baseDate, schedule.earliest),
                                maxDate:lib.C.addDays(baseDate, schedule.max)
                                });  
        };
         
        if (!hasExitedProgram(programEncounter)){         
        if (abortionDate) {
            if (programEncounter.name === 'Abortion Followup Visit-1') 
            addEncounter(abortionDate, 'Abortion Followup', 'Abortion Followup Visit-2');
            else if (programEncounter.name === 'Abortion Followup Visit-2') 
            addEncounter(abortionDate, 'Abortion Followup', 'Abortion Followup Visit-3');   
            //    else if (programEncounter.name === 'Abortion Followup Visit-3' && lib.C.contains(programNames,'Eligible couple')) 
            //    addEncounter(abortionDate, 'Eligible Couple Followup', 'Eligible Couple Followup'); 
            }    
        }
            return;
        }

        const scheduleVisitsDuringANC = (programEncounter, scheduleBuilder) => {
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
                scheduleBuilder.add({
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

        return ;
        }

      
        const scheduleVisitsDuringPNC = (programEncounter, scheduleBuilder) => {
            const deliveryDate = programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment('Date of delivery');
             var schedule = [];
        
            // const programNames = [];
            // const enrolments = programEncounter.programEnrolment.individual.enrolments;
            // enrolments.forEach(e => programNames.push(e.program.operationalProgramName || e.program.name));
            // console.log('programNames',programNames);
      
            const addEncounter = function (baseDate, encounterType, name) {        
                if (programEncounter.programEnrolment.hasEncounter(encounterType, name)) return;  
                schedule = encounterSchedule[name === undefined ? encounterType : name];
                      scheduleBuilder.add({
                        name: name,
                        encounterType: encounterType,
                        earliestDate: lib.C.addDays(baseDate, schedule.earliest),
                        maxDate:lib.C.addDays(baseDate, schedule.max)
                        });      
            };

            if (!hasExitedProgram(programEncounter)){             
            if (deliveryDate) {
                if (programEncounter.name === 'PNC 1') 
                addEncounter(deliveryDate, 'PNC', 'PNC 2');
                else if (programEncounter.name === 'PNC 2') 
                addEncounter(deliveryDate, 'PNC', 'PNC 3');   
                // else if (programEncounter.name === 'PNC 3' && lib.C.contains(programNames,'Eligible couple')) 
                //    addEncounter(abortionDate, 'Eligible Couple Followup', 'Eligible Couple Followup'); 
                }
            }
            return ;
        }

        const scheduleVisitsDuringChildPNC = (programEncounter, scheduleBuilder) => {
            const birthDate = getEarliestEncounterDate(programEncounter);
            // Birth Weight
            const birthWeight = programEncounter.getObservationReadableValue('Birth Weight');
            var schedule = [];
              
            const addEncounter = function (baseDate, encounterType, name) {        
                if (programEncounter.programEnrolment.hasEncounter(encounterType, name)) return; 
                if(birthWeight < 2) 
                schedule = encounterScheduleLowBirthWeight[name === undefined ? encounterType : name];
                else
                schedule = encounterSchedule[name === undefined ? encounterType : name];
                    scheduleBuilder.add({
                        name: name,
                        encounterType: encounterType,
                        earliestDate: lib.C.addDays(baseDate, schedule.earliest),
                        maxDate:lib.C.addDays(baseDate, schedule.max)
                        });      
            };

            if (!hasExitedProgram(programEncounter)){             
            if (birthDate) {
                if (programEncounter.name === 'Child PNC 1') 
                addEncounter(birthDate, 'Child PNC', 'Child PNC 2');
                else if (programEncounter.name === 'Child PNC 2') 
                addEncounter(birthDate, 'Child PNC', 'Child PNC 3');   
                }
            }
            return ;
        }

        const scheduleVisitsDuringChildFollowupNormal = (programEncounter, scheduleBuilder) => {
            const birthDate = programEncounter.programEnrolment.individual.dateOfBirth;
            const ageOfChildInMonths = programEncounter.programEnrolment.individual.getAgeInMonths();   
               
            if (!hasExitedProgram(programEncounter)){  
                          
            if(ageOfChildInMonths >= 7 && ageOfChildInMonths <= 24){
                var encounter;    
                    ecounterChildFollowUpNormal.forEach(function(item,index) {
                        
                        console.log("Current: " + item.earliest);
                        console.log('programEncounter.earliestVisitDateTime',programEncounter.earliestVisitDateTime);

                        if(moment(lib.C.addDays(birthDate, item.earliest)).isSame(moment(programEncounter.earliestVisitDateTime),'date')){
                            encounter = ecounterChildFollowUpNormal[index+1];
                        }
                      });

                    if(_.isNil(encounter))
                      ecounter = ecounterChildFollowUpNormal[0];
                      console.log('ecounter',ecounter);
                    scheduleBuilder.add({
                        name: 'Child Followup',
                        encounterType: 'Child Followup',
                        earliestDate: lib.C.addDays(birthDate, encounter.earliest),
                        maxDate:lib.C.addDays(birthDate, encounter.max)
                        });  
            }else if(ageOfChildInMonths >= 24 && ageOfChildInMonths <= 60){
                RuleHelper.addSchedule(scheduleBuilder, 'Child Followup','Child Followup', 
                lib.C.addMonths(getEarliestEncounterDate(programEncounter), 4) ,15);   
             }
            }
            return ;
        }

        const scheduleVisitsDuringChildFollowupSAM = (programEncounter, scheduleBuilder) => {
            // const birthDate = programEncounter.programEnrolment.individual.dateOfBirth;
            const ageOfChildInMonths = programEncounter.programEnrolment.individual.getAgeInMonths();   
           
            if (!hasExitedProgram(programEncounter)){                            
            if(ageOfChildInMonths >= 7 && ageOfChildInMonths <= 24){
                RuleHelper.addSchedule(scheduleBuilder, 'Child Followup','Child Followup', 
                lib.C.addDays(getEarliestEncounterDate(programEncounter), 15) ,15);   
            }else if(ageOfChildInMonths >= 24 && ageOfChildInMonths <= 60){
                RuleHelper.addSchedule(scheduleBuilder, 'Child Followup','Child Followup', 
                lib.C.addMonths(getEarliestEncounterDate(programEncounter), 1) ,15);   
             }
            }
            return ;
        }

        const scheduleVisitsDuringChildFollowupMAM = (programEncounter, scheduleBuilder) => {
            const birthDate = programEncounter.programEnrolment.individual.dateOfBirth;
            const ageOfChildInMonths = programEncounter.programEnrolment.individual.getAgeInMonths();   
            
            if (!hasExitedProgram(programEncounter)){                            
            if(ageOfChildInMonths >= 7 && ageOfChildInMonths <= 24){
                RuleHelper.addSchedule(scheduleBuilder, 'Child Followup','Child Followup', 
                lib.C.addMonths(getEarliestEncounterDate(programEncounter), 1) ,15);   
            }else if(ageOfChildInMonths >= 24 && ageOfChildInMonths <= 60){
                RuleHelper.addSchedule(scheduleBuilder, 'Child Followup','Child Followup', 
                lib.C.addMonths(getEarliestEncounterDate(programEncounter), 2) ,15);   
             }
            }
            return ;
        }

        const scheduleVisitsDuringChildFollowup = (programEncounter, scheduleBuilder) => {
            const birthDate = programEncounter.programEnrolment.individual.dateOfBirth;
            const currentWeight = programEncounter.getObservationReadableValue('Current Weight');
            const ageOfChildInMonths = programEncounter.programEnrolment.individual.getAgeInMonths();   
            const nutritionalStatus = programEncounter.getObservationValue('Nutritional status of Child');
            console.log('ageOfChildInMonths',ageOfChildInMonths);
            console.log('currentWeight',currentWeight);
        
            if(currentWeight < 3 && ageOfChildInMonths < 2)
            RuleHelper.addSchedule(scheduleBuilder, 'Child Followup','Child Followup', 
            lib.C.addDays(getEarliestEncounterDate(programEncounter), 7) ,4);

            if(ageOfChildInMonths >= 2 && ageOfChildInMonths <= 6){
            RuleHelper.addSchedule(scheduleBuilder, 'Child Followup-2','Child Followup',
            lib.C.addDays(birthDate, 160),8);
            }else {
            console.log('nutritionalStatus',nutritionalStatus);
            switch(nutritionalStatus) {
                case 'Normal':
                    scheduleVisitsDuringChildFollowupNormal(programEncounter,scheduleBuilder);
                break;
                case 'SAM':
                    scheduleVisitsDuringChildFollowupSAM(programEncounter,scheduleBuilder);
                break;
                case 'MAM':
                    scheduleVisitsDuringChildFollowupMAM(programEncounter,scheduleBuilder);
                break;
            }
        }
          return ;
      }

      const scheduleVisitsDuringBirth = (programEncounter, scheduleBuilder) => {
        RuleHelper.addSchedule(scheduleBuilder, 'Child PNC 1','Child PNC', getEarliestEncounterDate(programEncounter), 8);
       
        let birthWeight = programEncounter.getObservationReadableValue('Birth Weight');
        const ageOfChildInMonths = programEncounter.programEnrolment.individual.getAgeInMonths();   
        console.log('ageOfChildInMonths',ageOfChildInMonths); 

        if(birthWeight < 2 || ageOfChildInMonths < 2){
        RuleHelper.addSchedule(scheduleBuilder, 'Child Followup','Child Followup', 
        lib.C.addDays(getEarliestEncounterDate(programEncounter), 7) ,4);
        }

        const birthDate = programEncounter.programEnrolment.individual.dateOfBirth;           
        if(ageOfChildInMonths >= 2 && ageOfChildInMonths <= 6)
        RuleHelper.addSchedule(scheduleBuilder, 'Child Followup-1','Child Followup', 
        lib.C.addDays(birthDate, 110),10);
      return ;
  }


@RuleFactory("d40e8aa2-8cae-4b09-ad30-2da6c1690206", "VisitSchedule")
("3d13cc9a-c1fe-49e9-8980-360378f8199d", "JNPCT Pregnant Woman Enrolment Visit schedule", 100.0)
class ScheduleVisitDuringPregnantWomanEnrolment {
    static exec(programEnrolment, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createEnrolmentScheduleBuilder(programEnrolment, visitSchedule);
        let enrolmentHighRisk = programEnrolment.getObservationValue('High Risk');
        let maxDateOffset = 15;
        if (enrolmentHighRisk) 
            maxDateOffset = 8;
      
        RuleHelper.addSchedule(scheduleBuilder, 'ANC 1','ANC', getEarliestDate(programEnrolment), maxDateOffset);
        // .enrolmentDateTime
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@RuleFactory("0b37b679-a33f-42b3-a455-a84eaea7b5d8", "VisitSchedule")
("0f481c77-ffb2-46ee-9b93-8de09e0074c7", "JNPCT Eligible Couple Enrolment Visit schedule", 100.0)
class ScheduleVisitDuringEligibleCoupleEnrolment {
    static exec(programEnrolment, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createEnrolmentScheduleBuilder(programEnrolment, visitSchedule);
        RuleHelper.addSchedule(scheduleBuilder, 'Eligible Couple Followup','Eligible Couple Followup', 
        getEarliestECFollowupDate(programEnrolment.enrolmentDateTime), 15);
        return scheduleBuilder.getAllUnique("encounterType");
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

@RuleFactory("9bf17b07-3e6b-414a-a96e-086fc9c5ef6a", "VisitSchedule")
("f3c6201c-d800-4db9-92cc-f1151afa718b", "ScheduleVisitsDuringANC", 10.0)
class ScheduleVisitsDuringANC {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) { 
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);          
        scheduleVisitsDuringANC(programEncounter,scheduleBuilder);
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@RuleFactory("c4123189-c7b6-49e1-bbf3-82b3127750b2", "VisitSchedule")
("c66ae70a-b5d0-42a0-8b61-293169de26d0", "ScheduleVisitsDuringPNC", 10.0)
class ScheduleVisitsDuringPNC {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {    
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);          
        scheduleVisitsDuringPNC(programEncounter,scheduleBuilder);
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@RuleFactory("20e3c4e9-1e58-4a11-ba5c-9f3c745c7ef7", "VisitSchedule")
("64e95c2f-e754-44fe-81d4-2c9289e0da16", "ScheduleVisitsDuringAbortionFollowup", 10.0)
class ScheduleVisitsDuringAbortionFollowup {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {   
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);          
        scheduleVisitsDuringAbortionFollowup(programEncounter,scheduleBuilder);
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@RuleFactory("1c8bd246-f46e-4250-88bc-1ca567ba03ce", "VisitSchedule")
("c96af83f-5f11-4b6a-92c3-2dcd4b0341c4", "ScheduleVisitsDuringECFollowup", 10.0)
class ScheduleVisitsDuringECFollowup {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {       
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);          
        scheduleVisitsDuringECFollowup(programEncounter,scheduleBuilder);
        return scheduleBuilder.getAllUnique("encounterType");
   }
}

@RuleFactory("95796c7b-cb70-48f5-893f-c0c8afbc3785", "VisitSchedule")
("35edab3b-2254-40c1-b5d1-c3f11cf29234", "ScheduleVisitDuringChildEnrolment", 100.0)
class ScheduleVisitDuringChildEnrolment {
    static exec(programEnrolment, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createEnrolmentScheduleBuilder(programEnrolment, visitSchedule);
       
        const dob = programEnrolment.individual.dateOfBirth;
        const ageOfChildInDays = lib.C.getDays(dob,programEnrolment.enrolmentDateTime); 
        console.log('ageOfChildInDays',ageOfChildInDays);      
        if (ageOfChildInDays > 90) return visitSchedule;
        RuleHelper.addSchedule(scheduleBuilder, 'Birth Form','Birth Form', getEarliestDate(programEnrolment), 0);
        
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@RuleFactory("f410de41-c0cc-4bac-a5a2-2e98d10572e9", "VisitSchedule")
("fea5a152-b641-452a-b129-7030a07c36ac", "ScheduleVisitsDuringBirth", 10.0)
class ScheduleVisitsDuringBirth {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {       
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);
        scheduleVisitsDuringBirth(programEncounter,scheduleBuilder); 
        return scheduleBuilder.getAllUnique("encounterType");
   }
}

@RuleFactory("62b5b7ae-f0b3-49c0-b7cb-eb2b616bc89b", "VisitSchedule")
("c65285b0-bfc4-440c-b24d-356c2d499587", "ScheduleVisitsDuringChildPNC", 10.0)
class ScheduleVisitsDuringChildPNC {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {       
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);
        scheduleVisitsDuringChildPNC(programEncounter,scheduleBuilder);
        return scheduleBuilder.getAllUnique("encounterType");
   }
}

@RuleFactory("4548364c-ff22-447b-baec-3c63935a7e00", "VisitSchedule")
("bd87c77a-e202-4b9d-a756-caacc1f6bf86", "ScheduleVisitsDuringChildFollowup", 10.0)
class ScheduleVisitsDuringChildFollowup {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {       
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);
        scheduleVisitsDuringChildFollowup(programEncounter,scheduleBuilder);
        return scheduleBuilder.getAllUnique("encounterType");
   }
}

@RuleFactory("406738d4-c96c-498c-99e7-4389cb454d5c", "VisitSchedule")
("aa7e471c-60fe-43f2-973b-454b0acd8b2a", "ScheduleVisitsOnCancel", 10.0)
class ScheduleVisitsOnCancel {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);          

        if (!hasExitedProgram(programEncounter)) {
            switch(programEncounter.encounterType.name) {
                case 'Eligible Couple Followup':
                    scheduleVisitsDuringECFollowup(programEncounter, scheduleBuilder);
                    break;
                case 'Abortion Followup':
                    scheduleVisitsDuringAbortionFollowup(programEncounter, scheduleBuilder);
                    break;
                case 'ANC':
                    scheduleVisitsDuringANC(programEncounter, scheduleBuilder);
                    break;
                case 'PNC':
                    scheduleVisitsDuringPNC(programEncounter, scheduleBuilder);
                    break; ;
                case 'Birth Form':
                    scheduleVisitsDuringBirth(programEncounter,scheduleBuilder);
                    break;   
                case 'Child PNC':
                    scheduleVisitsDuringChildPNC(programEncounter,scheduleBuilder);     
                    break;
                case 'Child Followup':
                    scheduleVisitsDuringChildFollowup(programEncounter,scheduleBuilder);
                    break;       
            }
        }
        return scheduleBuilder.getAllUnique("encounterType", true);
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
    ScheduleVisitsDuringECFollowup,
    ScheduleVisitsOnCancel,
    ScheduleVisitDuringChildEnrolment,
    ScheduleVisitsDuringChildFollowup,
    ScheduleVisitsDuringBirth,
    ScheduleVisitsDuringChildPNC
}