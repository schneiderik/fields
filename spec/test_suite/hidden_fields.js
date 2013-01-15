describe("Hidden fields", function(){
  var form, fields;

  before(function(){
    form = '<form id="test-form">\
      <input id="field1" type="email" name="email" value="foo@bar.com"/>\
      <input id="field2" type="hidden" name="referrer" value="contact_us"/>\
    </form>';

    $(form).appendTo('#qunit-fixture');
    fields = Fields.in('#test-form');
  });

  it('should reset non hidden fields', function(){
    fields.clear()
    assert(fields.get('referrer').val()).equals('contact_us');
    assert(fields.get('email').val()).equals('');
  });
  
});
