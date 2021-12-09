// Generated by CoffeeScript 1.4.0
(function() {
  var Evaluation, EvaluationRegistry, Events, Field, Fields, eventSplitter, _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  eventSplitter = /\s+/;

  Events = (function() {

    function Events() {}

    Events.prototype.on = function(events, callback, context) {
      var calls, event, list, _i, _len;
      if (!callback) {
        return this;
      }
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        list = calls[event] || (calls[event] = []);
        list.push(callback, context);
      }
      return this;
    };

    Events.prototype.off = function(events, callback, context) {
      var calls, event, getKeys, i, list;
      if (!(calls = this._callbacks)) {
        return this;
      }
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }
      events = events ? events.split(eventSplitter) : (getKeys = Object.keys || function(obj) {
        var key, keys;
        if (obj !== Object(obj)) {
          throw new TypeError('Invalid object');
        }
        keys = [];
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            keys[keys.length] = key;
          }
        }
        return keys;
      }, getKeys(calls));
      while (event = events.shift()) {
        if (!(list = calls[event]) || !(callback || context)) {
          delete calls[event];
          continue;
        }
        i = list.length - 2;
        while (i >= 0) {
          if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
            list.splice(i, 2);
          }
          i -= 2;
        }
      }
      return this;
    };

    Events.prototype.trigger = function(events) {
      var all, args, calls, event, i, length, list, rest, _i, _len;
      if (!this._callbacks) {
        return this;
      }
      calls = this._callbacks;
      rest = [];
      events = events.split(eventSplitter);
      i = 1;
      length = arguments.length;
      while (i < length) {
        rest[i - 1] = arguments[i];
        i++;
      }
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        if (all = calls.all) {
          all = all.slice();
        }
        if (list = calls[event]) {
          list = list.slice();
        }
        if (list) {
          i = 0;
          length = list.length;
          while (i < length) {
            list[i].apply(list[i + 1] || this, rest);
            i += 2;
          }
        }
        if (all) {
          args = [event].concat(rest);
          i = 0;
          length = all.length;
          while (i < length) {
            all[i].apply(all[i + 1] || this, args);
            i += 2;
          }
        }
      }
      return this;
    };

    return Events;

  })();

  Events.bind = Events.on;

  Events.unbind = Events.off;

  Field = (function(_super) {

    __extends(Field, _super);

    function Field(element, parent, requiredErrorMessage) {
      var _this = this;
      if (parent == null) {
        parent = 'body';
      }
      if (requiredErrorMessage == null) {
        requiredErrorMessage = 'Field required';
      }
      this.el = $(element);
      this.parent = $(parent);
      this.attributes = {};
      this.val = this.value;
      this.requiredErrorMessage = requiredErrorMessage;
      this.parent.find("[name='" + (this.el.attr('name')) + "']").on('keyup blur focus change', function(e, options) {
        if (options == null) {
          options = {};
        }
        if (options.silent) {
          return;
        }
        return _this.value(_this.getFieldValueFromDOM(), {
          silent: true
        });
      });
      this.on('change:value', function(model, value) {
        _this.attributes.empty = _this.isEmpty();
        return _this.evaluate();
      });
      this.setAttributes();
      this;

    }

    Field.prototype.setAttributes = function() {
      this.attributes.name = this.el.attr('name');
      this.attributes.type = this.el.attr('type');
      this.attributes.value = this.getFieldValueFromDOM();
      this.attributes.required = this.isRequired();
      this.attributes.empty = this.isEmpty();
      this.attributes.evaluations = {};
      return this.evaluate();
    };

    Field.prototype.isEmpty = function() {
      if (this.val() === void 0) {
        return true;
      }
      if (this.val().length === 0) {
        return true;
      }
      if (this.val() === []) {
        return true;
      }
      return false;
    };

    Field.prototype.isRequired = function() {
      if (this.el.hasClass('required')) {
        return true;
      }
      if (this.el.is('[required]')) {
        return true;
      }
      return false;
    };

    Field.prototype.isValid = function() {
      if (this.get('evaluations').errors != null) {
        return false;
      }
      return true;
    };

    Field.prototype.get = function(attr) {
      return this.attributes[attr];
    };

    Field.prototype.value = function(arg, options) {
      if (options == null) {
        options = {};
      }
      if (arg == null) {
        return this.get('value');
      }
      if (this.get('value') === arg) {
        return this.get('value');
      }
      this.attributes.value = arg;
      this.trigger("change:value", this, arg);
      if (!options.silent) {
        this.updateFieldValueInDOM(arg);
      }
      return this;
    };

    Field.prototype.clear = function() {
      return this.value('');
    };

    Field.prototype.errors = function() {
      if (this.get('evaluations').errors != null) {
        return this.get('evaluations').errors;
      } else {
        return [];
      }
    };

    Field.prototype.evaluate = function() {
      this.attributes.evaluations = {};
      if (this.isRequired() && this.el.is(':visible')) {
        if (this.isEmpty()) {
          this.attributes.evaluations.errors = [this.requiredErrorMessage];
        } else {
          $.extend(this.attributes.evaluations, window.FieldsUtils.evaluationRegistry.evaluate(this.el));
        }
      }
      if (this.isValid() !== this.get('valid')) {
        this.trigger('change:valid', this, this.isValid());
      }
      this.attributes.valid = this.isValid();
      return this.get('evaluations');
    };

    Field.prototype.getFieldValueFromDOM = function() {
      if (this.get('type') === 'radio') {
        return this.getRadioValueFromDOM();
      }
      if (this.get('type') === 'checkbox') {
        return this.getCheckboxValueFromDOM();
      }
      return this.el.val();
    };

    Field.prototype.getRadioValueFromDOM = function() {
      return this.parent.find("[name='" + (this.get('name')) + "']:checked").val();
    };

    Field.prototype.getCheckboxValueFromDOM = function() {
      var input, vals, _i, _len, _ref;
      vals = [];
      _ref = this.parent.find("[name='" + (this.get('name')) + "']:checked");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        vals.push(this.parent.find(input).val());
      }
      return vals;
    };

    Field.prototype.updateFieldValueInDOM = function(value) {
      if (this.get('type') === 'radio') {
        return this.updateRadioValueInDOM(value);
      }
      if (this.get('type') === 'checkbox') {
        return this.updateCheckboxValueInDOM(value);
      }
      return this.el.val(value);
    };

    Field.prototype.updateRadioValueInDOM = function(value) {
      if (this.notInPossibleValues(value)) {
        return this.parent.find("[name='" + (this.get('name')) + "'][checked]").attr('checked', false).trigger('change', {
          silent: true
        });
      }
      this.parent.find("[name='" + (this.get('name')) + "']").attr('checked', false);
      return this.parent.find("[name='" + (this.get('name')) + "'][value='" + value + "']").attr('checked', true).trigger('change', {
        silent: true
      });
    };

    Field.prototype.updateCheckboxValueInDOM = function(values) {
      var value, _i, _len, _results;
      this.parent.find("[name='" + (this.get('name')) + "']").attr('checked', false).trigger('change', {
        silent: true
      });
      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        if (this.notInPossibleValues(value)) {
          break;
        }
        _results.push(this.parent.find("[name='" + (this.get('name')) + "'][value='" + value + "']").attr('checked', true).trigger('change', {
          silent: true
        }));
      }
      return _results;
    };

    Field.prototype.notInPossibleValues = function(value) {
      var field, missing, possible_values, val, _i, _len;
      possible_values = (function() {
        var _i, _len, _ref, _results;
        _ref = this.parent.find("[name='" + (this.get('name')) + "']");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          _results.push($(field).val());
        }
        return _results;
      }).call(this);
      missing = true;
      for (_i = 0, _len = possible_values.length; _i < _len; _i++) {
        val = possible_values[_i];
        if (val === value) {
          missing = false;
        }
      }
      return missing;
    };

    return Field;

  })(Events);

  Evaluation = (function() {

    function Evaluation(selector, context, statement) {
      this.selector = selector;
      this.context = context;
      this.statement = statement;
    }

    Evaluation.prototype.evaluate = function(field) {
      return this.statement(field);
    };

    return Evaluation;

  })();

  EvaluationRegistry = (function(_super) {

    __extends(EvaluationRegistry, _super);

    function EvaluationRegistry() {
      this.evaluations = [];
    }

    EvaluationRegistry.prototype.evaluate = function(field) {
      var evaluation, result, results, _i, _len, _ref;
      results = {};
      _ref = this.evaluations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evaluation = _ref[_i];
        if (!(field.is(evaluation.selector))) {
          continue;
        }
        result = evaluation.evaluate(field);
        if (result !== void 0) {
          if (results[evaluation.context] == null) {
            results[evaluation.context] = [];
          }
          results[evaluation.context].push(result);
        }
      }
      return results;
    };

    EvaluationRegistry.prototype.add = function(evaluations) {
      var e, evaluation, _i, _len;
      if (Object.prototype.toString.call(evaluations) === '[object Object]') {
        evaluations = [evaluations];
      }
      for (_i = 0, _len = evaluations.length; _i < _len; _i++) {
        e = evaluations[_i];
        evaluation = new Evaluation(e.selector, e.context, e.statement);
        this.evaluations.push(evaluation);
      }
      return this;
    };

    return EvaluationRegistry;

  })(Events);

  Fields = (function(_super) {

    __extends(Fields, _super);

    Fields.within = function(selector, requiredErrorMessage) {
      if (requiredErrorMessage == null) {
        requiredErrorMessage = 'Field required';
      }
      if ($(selector).is('input:not([type="submit"]), select, textarea')) {
        return new Field(selector, requiredErrorMessage);
      }
      return new Fields(selector, requiredErrorMessage);
    };

    Fields["in"] = Fields.at = Fields.within;

    Fields.all = function(requiredErrorMessage) {
      if (requiredErrorMessage == null) {
        requiredErrorMessage = 'Field required';
      }
      return new Fields('body', requiredErrorMessage);
    };

    function Fields(selector, requiredErrorMessage) {
      var model, name, _ref,
        _this = this;
      if (selector == null) {
        selector = 'body';
      }
      if (requiredErrorMessage == null) {
        requiredErrorMessage = 'Field required';
      }
      this.fields = 'input:not([type="submit"]), select, textarea';
      this.el = $(selector);
      this.attributes = {};
      this.requiredErrorMessage = requiredErrorMessage;
      this.generateModels();
      this.trackValidity();
      _ref = this.models;
      for (name in _ref) {
        model = _ref[name];
        model.on('change:value', function(e, value) {
          return _this.trigger('change:value', e.get('name'), value);
        });
      }
      return this;
    }

    Fields.prototype.get = function(name) {
      return this.models[name];
    };

    Fields.prototype.clear = function() {
      var model, name, _ref;
      _ref = this.models;
      for (name in _ref) {
        model = _ref[name];
        if (!model.el.is(':hidden')) {
          model.clear();
        }
      }
      return this;
    };

    Fields.prototype.collect = function(value) {
      var dict, model, name, _ref;
      dict = {};
      _ref = this.models;
      for (name in _ref) {
        model = _ref[name];
        dict[name] = model.get(value);
      }
      return dict;
    };

    Fields.prototype.isValid = function() {
      var model, name, valid, _ref;
      valid = true;
      _ref = this.models;
      for (name in _ref) {
        model = _ref[name];
        if (model.isValid() === false) {
          valid = false;
        }
      }
      return valid;
    };

    Fields.prototype.trackValidity = function() {
      var model, name, _ref, _results,
        _this = this;
      this.attributes.valid = this.isValid();
      _ref = this.models;
      _results = [];
      for (name in _ref) {
        model = _ref[name];
        _results.push(model.on('change:valid', function(e, value) {
          if (_this.isValid() !== _this.attributes.valid) {
            _this.trigger('change:valid', _this, _this.isValid());
          }
          return _this.attributes.valid = _this.isValid();
        }));
      }
      return _results;
    };

    Fields.prototype.generateModels = function() {
      var field, _i, _len, _ref, _results;
      this.models = {};
      _ref = this.el.find(this.fields);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (this.models[$(field).attr('name')] == null) {
          _results.push(this.models[$(field).attr('name')] = new Field(field, this.el, this.requiredErrorMessage));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Fields;

  })(Events);

  window.FieldsUtils = {};

  (_base = window.FieldsUtils).evaluationRegistry || (_base.evaluationRegistry = new EvaluationRegistry);

  window.Fields || (window.Fields = Fields);

}).call(this);
