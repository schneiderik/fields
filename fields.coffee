# collectFieldData
#
# A read-only tool that returns a Field or FieldCollection object that tracks
# state and validity of a field or collection of fields.
#
# Fields are invalid if the are required and empty, or if an evaluation
# of context 'errors' is returning a result.
#
# Add evaluations by create a new Evaluation instance.
#
# Example:
#
# new Evaluation 'selector', 'context', (field)->
#   "Invalid" if 1 is 2


# Field Model

class Field
  constructor: (element)->
    @el = $(element)
    @attributes = {}
    @setupBindings()
    @setAttributes()
    @

  get: (attr)-> @attributes[attr]

  set: (attr, value)->
    @attributes[attr] = value
    if @oldAttributes[attr] is undefined or value isnt @oldAttributes[attr]
      @el.triggerHandler "change:#{attr}", [@, value]

  refresh: ()->
    @setAttributes()

  name: -> @el.attr('name')
  required: -> @el.hasClass 'required' or @el.is('[required]')
  hidden: -> @el.attr('type') is 'hidden'
  value: -> @el.val()
  empty: -> @el.val().length is 0
  evaluate: -> $.extend @attributes, EvaluationRegistry.evaluate(@el)
  valid: -> !@get('errors')?

  setupBindings: ->
    # Rerun evaluate when new evaluations are added
    $(window).on 'evaluation:add', => @evaluate()

    # Update attributes when a user interacts with the field
    @el.on 'keyup blur focus change', => @setAttributes()

  saveAttributes: (attrs)->
    @oldAttributes = attrs
    @attributes = {}

  setAttributes: ->
    @saveAttributes(@attributes) 

    @set 'required', @required()
    @set 'empty', @empty()

    if @get('required') and @get('empty')
      @set 'errors', ['Field required'] 
    else
      @evaluate()

    @set 'name', @name()
    @set 'hidden', @hidden()
    @set 'valid', @valid()
    @set 'value', @value()


# Field Collection

class FieldCollection
  constructor: (element)->
    @el = $(element)
    @fields = @el.find 'input:not([type="submit"]), select, textarea'
    @models = []
    @attributes = {valid: false}

    @createFieldModels()
    @trackFocus()
    @trackValidity()
    @getValidity()

    @

  get: (attr)-> @attributes[attr]

  set: (attr, value)->
    old_attribute = @attributes[attr]
    @attributes[attr] = value

    @el.triggerHandler "change:#{attr}", [@, value] if value isnt @old_attribute

  at: (name)->
    return model for model in @models when model.get('name') is name

  collect: (value)->
    dict = {}
    for model in @models
      dict[model.get('name')] = model.get(value)
    return dict

  refresh: ->
    model.refresh() for model in @models

  createFieldModels: ->
    for field in @fields
      model = $(field).data('Field')

      unless model?
        model = new Field(field)
        $(field).data 'Field', model

      @models.push model

  getValidity: ()->
    valid = true
    valid = false for model in @models when model.get('valid') is false

    @set 'valid', valid

  trackValidity: ()->
    $(@fields).on 'change:valid', (e)=>
      @getValidity()

  trackFocus: ()->
    $(@fields).on 'focus', (e)=>
      @set 'last_focused', $(e.target)


# Evaluation Model

class Evaluation
  constructor: (selector, context, statement)->
    @selector  = selector      
    @context   = context      
    @statement = statement      

    $(window).trigger 'evaluation:create', @

  evaluate: (field)->
    @statement(field)


# Evaluation Collection

class EvaluationCollection
  constructor: ()->
    @evaluations = []

    $(window).on 'evaluation:create', (e, evaluation)=>
      @add(evaluation)

  evaluate: (field)->
    results = {}

    for evaluation in @evaluations when field.is evaluation.selector
      result = evaluation.evaluate(field)

      unless result is undefined
        results[evaluation.context] = [] unless results[evaluation.context]?
        results[evaluation.context].push result 

    return results 

  add: (evaluation)->
    @evaluations.push evaluation
    $(window).trigger 'evaluation:add'


window.FieldEvaluation = Evaluation
window.EvaluationRegistry ||= new EvaluationCollection


# Plugin Definition

$.fn.collectFieldData = (option)->
  $el   = $(@)
  field = 'input:not([type="submit"]), select, textarea'

  if $el.is field
    data = $el.data('Field')
    unless data?
      data = new Field($el)
      $el.data('Field', data) 
  else 
    data = $el.data('FieldCollection')
    unless data?
      data = new FieldCollection($el)
      $el.data('FieldCollection', data)

  return data
