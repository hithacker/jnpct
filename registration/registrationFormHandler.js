  import {
    RuleFactory,
    FormElementsStatusHelper,
    StatusBuilderAnnotationFactory,
    WithName
  } from 'rules-config/rules';


  const WithRegistrationStatusBuilder = StatusBuilderAnnotationFactory('individual', 'formElement');
  const RegistrationViewFilter = RuleFactory("c22664a8-81ba-4442-956d-3e812a6d7bca", "ViewFilter");


  @RegistrationViewFilter("39f42976-5b1b-4251-9835-89d8140bbf7d", "JNPCT Registration View Filter", 100.0, {})
  class RegistrationViewHandlerJNPCT {
    static exec(individual, formElementGroup) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new RegistrationViewHandlerJNPCT(), individual, formElementGroup);
  }

  @WithName("Subcaste")
  @WithRegistrationStatusBuilder
  j1([], statusBuilder) {
        statusBuilder.show().when.valueInRegistration("Caste")
            .containsAnswerConceptName("Tribal");
  }

  @WithName("Addiction - Please specify")
  @WithRegistrationStatusBuilder
  j2([], statusBuilder) {
        statusBuilder.show().when.valueInRegistration("Addiction").is.yes;
  }

  @WithName("Specially abled - Please specify")
  @WithRegistrationStatusBuilder
  j3([], statusBuilder) {
        statusBuilder.show().when.valueInRegistration("Specialy abled").is.yes;
  }

  @WithName("Long-term illness - Please specify")
  @WithRegistrationStatusBuilder
  j4([], statusBuilder) {
        statusBuilder.show().when.valueInRegistration("Any long-term illnesses").is.yes;
  }

  @WithName("Using the toilet regularly")
  @WithRegistrationStatusBuilder
  j5([], statusBuilder) {
        statusBuilder.show().when.valueInRegistration("Toilet facility present").is.yes;
  }
  
 }


   module.exports = {RegistrationViewHandlerJNPCT};
