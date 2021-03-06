/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

CLASS({
  package: 'foam.flow',
  name: 'Slides',
  extendsModel: 'foam.flow.Element',

  requires: [
    'foam.flow.Grid'
  ],

  properties: [
    {
      name: 'slides',
      singular: 'slide',
      factory: function() { return []; }
    },
    {
      name: 'currentSlide',
      getter: function() { return this.slides[this.position-1]; },
      transient: true
    },
    {
      model_: 'IntProperty',
      name: 'position',
      displayWidth: 5,
      defaultValue: 1,
      preSet: function(o, n) {
        return Math.max(1, Math.min(n, this.slides.length));
      },
      postSet: function(_, p) {
        if ( this.$ ) this.setView(this.currentSlide());
      }
    }
  ],

  methods: {
    initHTML: function() {
      this.SUPER();
      this.position = 1;
    },
    fromElement: function(e) {
      var slides = [];
      for ( var i = 0 ; i < e.children.length ; i++ )
        if ( e.children[i].nodeName === 'slide' )
          slides.push(ViewFactoryProperty.ADAPT.defaultValue(null, e.children[i].innerHTML));
      this.slides = slides;
    },
    setView: function(v) {
      this.currentView_ && this.currentView_.destroy && this.currentView_.destroy();
      this.currentView_ = v;
      this.$.querySelector('deck').innerHTML = v.toHTML();
      v.initHTML();
    }
  },

  actions: [
    {
      name: 'back',
      label: '<',
      isEnabled: function() { return this.position > 1; },
      action: function() {
        this.position--;
      }
    },
    {
      name: 'forth',
      label: '>',
      isEnabled: function() { return this.position < this.slides.length; },
      action: function() {
        this.position++;
      }
    },
    {
      name: 'legend',
      label: '[+]',
      action: function() { this.setView(this.Grid.create({cards: this.slides})); }
    }
  ],

  templates: [
    function CSS() {/*
      slides .card-grid .card {
        box-shadow: 0 5px 15px #aaa;
        height: 16.4%;
        overflow: hidden;
        padding: 2px;
        width: 17%;
        min-width: initial;
      }
      slides .card-grid .card .card-inset {
        height: 90%;
        overflow: hidden;
        position: absolute;
        transform-origin: 0 0;
        transform: scale(0.15);
        width: 100%;
      }
      slides * {
        box-sizing: border-box;
      }
      slides, slides > deck, slides > controls {
        display: block;
      }
      slides > deck {
        border: 1px solid black;
        border: 1px solid gray;
        flex-grow: 1;
        overflow: auto;
        width: 100%;
      }
      slides > controls {
        background: #f5f5f0;
        border: 1px solid #aaa;
        flex-shrink: 0;
        font-size: 20px;
        height: 48px;
        padding: 10px;
        width: 100%;
        z-index: 2;
      }
      slides > controls input {
        font-size: 20px;
        margin-right: 10px;
        width: 50px;
      }
      slides > controls .of {
        margin-top: 2px;
      }
      slides > controls .actionButton-back {
        margin-left: 20px;
      }
    */},
    function toInnerHTML() {/*
      <deck></deck>
      <controls style="display:flex;">
        $$position <span class="of">of {{this.slides.length}}</span> <span style="flex-grow:1;"></span> $$legend $$back $$forth
      </controls>
    */}
  ]
});
