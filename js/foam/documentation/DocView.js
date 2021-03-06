/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  name: 'DocView',
  package: 'foam.documentation',
  extendsModel: 'foam.ui.DetailView',
  label: 'Documentation View Base',
  documentation: 'Base Model for documentation views.',

  imports: ['documentViewRef'],

  requires: ['foam.documentation.DocRefView', 'SimpleValue', 'foam.documentation.DocRef'],

  documentation: function() {/*
    <p>Underlying the other documentation views, $$DOC{ref:'.'} provides the ability
    to specify $$DOC{ref:'foam.documentation.DocRef', text:"$$DOC{ref:'MyModel.myFeature'}"} tags in your
    documentation templates, creating child $$DOC{ref:foam.documentation.DocRefView'} views and $$DOC{ref:'foam.documentation.DocRef'}
    references.</p>
    <p>In addition, the $$DOC{ref:'.', text:"$$THISDATA{}"} tag allows your template to
    pass on its data directly, rather than a property of that data.</p>
    <p>Views that wish to use DOC reference tags should extend this model. To display the
    $$DOC{ref:'Model.documentation'} of a model, use a $$DOC{ref:'DocModelView'} or
    $$DOC{ref:'foam.docmentation.DocBodyView'}.</p>
    <p>Documentation views require that a this.documentViewRef $$DOC{ref:'SimpleValue'}
    be present on the context. The supplied model is used as the base for resolving documentation
    references. If you are viewing the documentation for a Model, it will be a
    reference to that Model.</p>
    <p>See $$DOC{ref:'DocumentationBook'} for information on creating documentaion
    that is not directly associated with a $$DOC{ref:'Model'}.</p>
  */},

  properties: [
    {
      name: 'className',
      defaultValue: '',
    },
    {
      name: 'documentViewRef',
      factory: function() { return this.SimpleValue.create(this.DocRef.create()); },
    }
  ],

  methods: {
    init: function() { /* <p>Warns if this.documentViewRef is missing.</p>
      */
      this.SUPER();
      if (!this.documentViewRef) {
        console.warn("*** Warning: DocView ",this," can't find documentViewRef in its context "+this.X.NAME);
      }
    },

    toHTML: function() {
      // from View.toHTML():
      this.invokeDestructors();
      return '<' + this.tagName + ' id="' + this.id + '"' + this.cssClassAttr() + '>' +
        this.toInnerHTML() +
        '</' + this.tagName + '>';
    },

    createReferenceView: function(opt_args) { /*
      <p>Creates $$DOC{ref:'foam.documentation.DocRefView'} reference views from $$DOC{ref:'.',text:'$$DOC'}
          tags in documentation templates.</p>
      */
      var X = ( opt_args && opt_args.X ) || this.X;
      var v = X.foam.documentation.DocRefView.create(opt_args, X);
      this.addChild(v);
      return v;
    },

    createTemplateView: function(name, opt_args) {
      /*
        Overridden to add support for the $$DOC{ref:'.',text:'$$DOC'} and
        $$DOC{ref:'.',text:'$$THISDATA'} tags.
      */
      // name has been constantized ('PROP_NAME'), but we're
      // only looking for certain doc tags anyway.
      if (name === 'DOC') {
        var v = this.createReferenceView(opt_args);
        return v;
      } else {
        //if (opt_args && !opt_args.X) opt_args.X = this.X;
        return this.SUPER(name, opt_args);
      }
    }
  },


});
