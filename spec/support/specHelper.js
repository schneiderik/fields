function setupForm() {
  var input = document.createElement('input');
      input.type = 'text';
      input.name = 'input';
  var input2 = document.createElement('input');
      input2.type = 'text';
      input2.name = 'input2';
  var email = document.createElement('input');
      email.type = 'email';
      email.name = 'email';
  var textarea = document.createElement('textarea');
      textarea.name = 'textarea';
  var checkbox1 = document.createElement('input');
      checkbox1.type = 'checkbox';
      checkbox1.name = 'checkbox';
      checkbox1.value = '1';
  var checkbox2 = document.createElement('input');
      checkbox2.type = 'checkbox';
      checkbox2.name = 'checkbox';
      checkbox2.value = '2';
  var select = document.createElement('select');
      select.name = 'select';
  var option1 = document.createElement('option');
      option1.value = '1';
      option1.text = 'one';
  var option2 = document.createElement('option');
      option2.value = '2';
      option2.text = 'two';
  var submit = document.createElement('input');
      submit.type = 'submit';
  var form = document.createElement('form');
  var scoped = document.createElement('div');
      scoped.id = 'scoped';

  document.body.appendChild(form);
  form.appendChild(input);
  form.appendChild(input2);
  form.appendChild(email);
  form.appendChild(select);
  select.appendChild(option1);
  select.appendChild(option2);
  form.appendChild(scoped);
  scoped.appendChild(checkbox1);
  scoped.appendChild(checkbox2);
  scoped.appendChild(textarea);
  form.appendChild(submit);
};

function teardownForm() {
  var form = document.querySelector('form');
  form.parentNode.removeChild(form);
};

module.exports = {
  setupForm: setupForm,
  teardownForm: teardownForm
}
