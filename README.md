fields
======

Manage validation of forms without being tied to a specific front-end implementation. Fields.js exposes form and input level validation events allowing users to integrate their own error visualizations and interactions.

 [schneiderik.github.com/fields](http://schneiderik.github.com/fields)


```js
var fields = new Fields('#myform', {
  validations: {
    '[type="email"]': emailValidation,
    '[name="foobar"]': validationForFoobarInput,
  },
  onValid: function (model) {
    // model is the instance of a single Field
    doSomethingWhenAModelBecomesValid(model);
  },
  onInvalid: function (model) {
    // model is the instance of a single Field
    doSomethingWhenAModelBecomesInvalid(model);
  },
  onAllValid: function (model) {
    // model is the instance of Fields
    doSomethingWhenAllModelsBecomeValid(model);
  }
});

form.onSubmit(function (event) {
  if (!fields.isValid()) {
    displayErrors();
  }
});
```
