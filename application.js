$(function(){

  var emailValidation, passwordCharacterRequirement, passwordMatch;

  emailValidation = {
    selector: '[type="email"]',
    context: 'errors',
    statement: function(field) {
      var emailRegEx;
      emailRegEx = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/;
      if (!emailRegEx.test($(field).val().toLowerCase())) {
        return 'Invalid Email';
      }
    }
  };

  FieldsUtils.evaluationRegistry.add(emailValidation);

  fields = Fields.in('#form-one');

  var inputs = ['text_field', 'email_field', 'textarea_field', 'select_field', 'radio_field', 'checkbox_field']

  for (var i = 0; i < inputs.length; i++) {

    $('#form-one-' + inputs[i] + '-valid').text(fields.get(inputs[i]).isValid);
    function valid_binding(input) {
      fields.get(input).on('change:valid', function(e, val){
        $('#form-one-' + input + '-valid').text(val)
      });
    }
    valid_binding(inputs[i]);

    $('#form-one-' + inputs[i] + '-value').text(fields.get(inputs[i]).val());
    function value_binding(input) {
      fields.get(input).on('change:value', function(e, val){
        $('#form-one-' + input + '-value').text(val)
      });
    }
    value_binding(inputs[i]);

    $('#form-one-' + inputs[i] + '-errors').text(fields.get(inputs[i]).errors());
    function error_binding(input) {
      fields.get(input).on('change:value', function(e, val){
        $('#form-one-' + input + '-errors').text(fields.get(input).errors())
      });
    }
    error_binding(inputs[i]);
  }

  $('#form-one-valid').text(fields.isValid);
  fields.on('change:valid', function(e, val){
    $('#form-one-valid').text(fields.isValid);
  });
});