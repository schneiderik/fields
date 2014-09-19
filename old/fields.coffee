# fields
# An attempt at making data collection from server rendered fields easier.
# by Erik Schneider


########
# Events

# This even system is taken from Backbone.Events and converted to coffeescript.
# I needed a way to call and bind to events outside of jQuery and Backbone was the
# first thing I thought of to implement this.
# So, thank you to Jeremy Ashkenas and all of the Backbone contributors for this
# event framework.

# Regular expression used to split event strings
eventSplitter = /\s+/

# A module that can be mixed in to *any object* in order to provide it with
# custom events. You may bind with `on` or remove with `off` callback functions
# to an event; `trigger`-ing an event fires all callbacks in succession.
#
#     var object = {};
#     _.extend(object, Backbone.Events);
#     object.on('expand', function(){ alert('expanded'); });
#     object.trigger('expand');

class Events
  # Bind one or more space separated events, `events`, to a `callback`
  # function. Passing `"all"` will bind the callback to all events fired.
  on: (events, callback, context)->
    return @ unless callback

    events = events.split(eventSplitter)
    calls = this._callbacks or (this._callbacks = {})

    for event in events
      list = calls[event] or (calls[event] = [])
      list.push callback, context

    @

  # Remove one or many callbacks. If `context` is null, removes all callbacks
  # with that function. If `callback` is null, removes all callbacks for the
  # event. If `events` is null, removes all bound callbacks for all events.
  off: (events, callback, context)->
    # No events, or removing *all* events.
    return @ unless (calls = this._callbacks)
    unless (events or callback or context)
      delete this._callbacks
      return @

    events = if events
      events.split(eventSplitter)
    else
      getKeys = Object.keys || (obj)->
        if obj isnt Object(obj)
          throw new TypeError('Invalid object')
        keys = []
        for key of obj
          keys[keys.length] = key  if hasOwnProperty.call(obj, key)
        return keys

      getKeys(calls)

    # Loop through the callback list, splicing where appropriate.
    while event = events.shift()
      if !(list = calls[event]) or !(callback or context)
        delete calls[event]
        continue

      i = list.length - 2
      while i >= 0
        list.splice i, 2  unless callback and list[i] isnt callback or context and list[i + 1] isnt context
        i -= 2

    return @

  # Trigger one or many events, firing all bound callbacks. Callbacks are
  # passed the same arguments as `trigger` is, apart from the event name
  # (unless you're listening on `"all"`, which will cause your callback to
  # receive the true name of the event as the first argument).
  trigger: (events)->
    return @ unless @_callbacks
    calls = @_callbacks

    rest = []
    events = events.split(eventSplitter)

    # Fill up `rest` with the callback arguments.  Since we're only copying
    # the tail of `arguments`, a loop is much faster than Array#slice.
    i = 1
    length = arguments.length

    while i < length
      rest[i - 1] = arguments[i]
      i++

    # For each event, walk through the list of callbacks twice, first to
    # trigger the event, then to trigger any `"all"` callbacks.
    for event in events
      # Copy callback lists to prevent modification.
      if all = calls.all
        all = all.slice()
      if list = calls[event]
        list = list.slice()

      # Execute event callbacks.
      if list
        i = 0
        length = list.length

        while i < length
          list[i].apply (list[i + 1] or @), rest
          i += 2

      # Execute "all" callbacks.
      if all
        args = [event].concat(rest)
        i = 0
        length = all.length

        while i < length
          all[i].apply all[i + 1] or this, args
          i += 2

    return @

# Aliases for backwards compatibility.
Events.bind   = Events.on
Events.unbind = Events.off




#############
# Field Model

class Field extends Events
  constructor: (element, parent='body')->
    @el         = $(element)
    @parent     = $(parent)
    @attributes = {}
    @val = @value

    # Update attributes when a user interacts with the field
    @parent.find("[name='#{@el.attr('name')}']").on 'keyup blur focus change', (e, options={})=>
      return if options.silent
      @value @getFieldValueFromDOM(), {silent: true}

    # Evaluate the field for any errors, warnings, etc. when the value changes
    @on 'change:value', (model, value)=>
      @attributes.empty = @isEmpty()
      @evaluate()

    @setAttributes()

    @

  setAttributes: ->
    @attributes.name        = @el.attr 'name'
    @attributes.type        = @el.attr 'type'
    @attributes.value       = @getFieldValueFromDOM()
    @attributes.required    = @isRequired()
    @attributes.empty       = @isEmpty()
    @attributes.evaluations = {}
    @evaluate()

  isEmpty: ()->
    return true if @val() is undefined
    return true if @val().length is 0
    return true if @val() is []
    return false

  isRequired: ()->
    return true if @el.hasClass 'required'
    return true if @el.is('[required]')
    return false

  isValid: ()->
    return false if @get('evaluations').errors?
    return true

  # Get value of an attribute at a specific key
  get: (attr)->
    return @attributes[attr]

  # Get value of the field, or set it by passing an argument
  value: (arg, options={})->
    return @get('value') unless arg?
    return @get('value') if @get('value') is arg

    @attributes.value = arg
    @trigger "change:value", @, arg
    @updateFieldValueInDOM arg unless options.silent

    return @

  # Convenience method for setting the value back to nothing
  clear: ->
    @value ''

  errors: ->
    if @get('evaluations').errors?
      return @get('evaluations').errors
    else
      return []

  # Evaluate the field against evaluations stored in the evaluationRegistry and
  # return an object of any results keyed on the context of the evaluation. i.e. 'errors'
  evaluate: ->
    @attributes.evaluations = {}
    if @isRequired() and @el.is(':visible')
      if @isEmpty()
        @attributes.evaluations.errors = ['Field required']
      else
        $.extend @attributes.evaluations, window.FieldsUtils.evaluationRegistry.evaluate(@el)

    # Trigger event if validity changes
    @trigger('change:valid', @, @isValid()) unless @isValid() is @get('valid')

    # A field is valid if it has no errors.
    @attributes.valid = @isValid()

    return @get('evaluations')

  # Getting and setting values is a bit complicated because of radio and checkbox inputs.
  # Only one field model should be generated for the set of inputs with the same name.
  getFieldValueFromDOM: ()->
    return @getRadioValueFromDOM() if @get('type') is 'radio'
    return @getCheckboxValueFromDOM() if @get('type') is 'checkbox'
    @el.val()

  getRadioValueFromDOM: ()->
    @parent.find("[name='#{@get('name')}']:checked").val()

  getCheckboxValueFromDOM: ()->
    vals = []
    vals.push(@parent.find(input).val()) for input in @parent.find("[name='#{@get('name')}']:checked")
    return vals

  updateFieldValueInDOM: (value)->
    return @updateRadioValueInDOM(value) if @get('type') is 'radio'
    return @updateCheckboxValueInDOM(value) if @get('type') is 'checkbox'
    @el.val(value)

  updateRadioValueInDOM: (value)->
    if @notInPossibleValues(value)
      return @parent.find("[name='#{@get('name')}'][checked]").attr('checked', false).trigger('change', {silent: true})

    @parent.find("[name='#{@get('name')}']").attr('checked', false)
    @parent.find("[name='#{@get('name')}'][value='#{value}']").attr('checked', true).trigger('change', {silent: true})

  updateCheckboxValueInDOM: (values)->
    @parent.find("[name='#{@get('name')}']").attr('checked', false).trigger('change', {silent: true})

    for value in values
      break if @notInPossibleValues(value)
      @parent.find("[name='#{@get('name')}'][value='#{value}']").attr('checked', true).trigger('change', {silent: true})

  notInPossibleValues: (value)->
    possible_values = ($(field).val() for field in @parent.find("[name='#{@get('name')}']"))

    missing = true
    missing = false for val in possible_values when val is value

    return missing


#######################
# Evaluation Registry

class Evaluation
  constructor: (selector, context, statement)->
    @selector  = selector
    @context   = context
    @statement = statement

  evaluate: (field)->
    @statement(field)

class EvaluationRegistry extends Events
  constructor: ()->
    @evaluations = []

  # Runs through all of the evaluations and calls any statements
  # for evaluations that have a selector matching the provided field's selector.
  evaluate: (field)->
    results = {}

    for evaluation in @evaluations when field.is evaluation.selector
      result = evaluation.evaluate(field)

      unless result is undefined
        results[evaluation.context] = [] unless results[evaluation.context]?
        results[evaluation.context].push result

    return results

  # Accepts one or an array of evaluation_attribute objects to create new
  # Evaluations and add them to the registry.
  add: (evaluations)->
    # Convert evaluation to an array if you only passed one.
    evaluations = [evaluations] if Object.prototype.toString.call(evaluations) is '[object Object]'

    for e in evaluations
      evaluation = new Evaluation(e.selector, e.context, e.statement)
      @evaluations.push evaluation

    return @


########
# Fields

class Fields extends Events
  @within: (selector)->
    return new Field(selector) if $(selector).is 'input:not([type="submit"]), select, textarea'
    new Fields(selector)

  @in = @at = @within

  @all: ->
    new Fields('body')

  constructor: (selector='body')->
    @fields = 'input:not([type="submit"]), select, textarea'
    @el = $(selector)
    @attributes = {}
    @generateModels()
    @trackValidity()

    for name, model of @models
      model.on 'change:value', (e, value)=>
        @trigger 'change:value', e.get('name'), value

    return @

  # Get a field model by it's name
  get: (name)-> @models[name]

  # Convenience method to clear the values of all of the fields in Fields
  clear: ->
    for name, model of @models
      model.clear() unless model.el.is(':hidden')

    return @

  # Collect a specified value from each field model keyed on the name of that field.
  collect: (value)->
    dict = {}
    for name, model of @models
      dict[name] = model.get(value)
    return dict

  isValid: ()->
    valid = true
    valid = false for name, model of @models when model.isValid() is false
    return valid

  # Update the collections validity whenever one of its models validity changes
  trackValidity: ()->
    @attributes.valid = @isValid()

    for name, model of @models
      model.on 'change:valid', (e, value)=>
        @trigger('change:valid', @, @isValid()) if @isValid() isnt @attributes.valid
        @attributes.valid = @isValid()

  generateModels: ()->
    @models = {}
    for field in @el.find @fields
      unless @models[ $(field).attr('name') ]?
        @models[$(field).attr('name')] = new Field(field, @el)

window.FieldsUtils = {}
window.FieldsUtils.evaluationRegistry ||= new EvaluationRegistry

window.Fields ||= Fields
