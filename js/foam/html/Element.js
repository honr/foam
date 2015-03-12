/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
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


LOAD_CLASS({
  package: 'foam.html',
  name: 'Element',

  documentation: function() {/*
    A sub-set of the DOM Element interface that we use for FOAM tag parsing.
    This lets us transparently build FOAM objects and views from either real DOM
    or from the output of FOAM's HTML parser.
    */},
  constants: {
    OPTIONAL_CLOSE_TAGS: {
      HTML: true,
      HEAD: true,
      BODY: true,
      P: true,
      DT: true,
      DD: true,
      LI: true,
      OPTION: true,
      THEAD: true,
      TH: true,
      TBODY: true,
      TR: true,
      TD: true,
      TFOOT: true,
      COLGROUP: true,
    },
    ILLEGAL_CLOSE_TAGS: {
      IMG: true,
      INPUT: true,
      BR: true,
      HR: true,
      FRAME: true,
      AREA: true,
      BASE: true,
      BASEFONT: true,
      COL: true,
      ISINDEX: true,
      LINK: true,
      META: true,
      PARAM: true
    }
  },

  properties: [
    {
      name: 'id'
    },
    {
      name: 'nodeName'/*,
      preSet: function(_, v) {
        return v.toLowerCase();
      }*/
    },
    {
      name: 'attributeMap_',
      transient: true,
      factory: function() { return {}; }
    },
    {
      name: 'attributes',
      factory: function() { return []; },
      postSet: function(_, attrs) {
        for ( var i = 0 ; i < attrs.length ; i++ )
          this.attributeMap_[attrs[i].name] = attrs[i];
      }
    },
    {
      name: 'childNodes',
      factory: function() { return []; }
    },
    {
      name: 'children',
      transient: true,
      getter: function() {
        return this.childNodes.filter(function(c) { return typeof c !== 'string'; });
      }
    },
    {
      name: 'outerHTML',
      transient: true,
      getter: function() {
        var out = '<' + this.nodeName;
        if ( this.id ) out += ' id="' + this.id + '"';
        for ( key in this.attributeMap_ ) {
          var value = this.attributeMap_[key].value;

          out += value == undefined ?
            ' ' + key :
            ' ' + key + '="' + this.attributeMap_[key].value + '"';
        }
        if ( ! this.ILLEGAL_CLOSE_TAGS[this.nodeName] &&
             ( ! this.OPTIONAL_CLOSE_TAGS[this.nodeName] || this.childNodes.length ) ) {
          out += '>';
          out += this.innerHTML;
          out += '</' + this.nodeName;
        }
        out += '>';
        return out;
      }
    },
    {
      name: 'innerHTML',
      transient: true,
      getter: function() {
        var out = '';
        for ( var i = 0 ; i < this.childNodes.length ; i++ )
          out += this.childNodes[i].toString();
        return out;
      }
    }
  ],

  methods: {
    setAttribute: function(name, value) {
      var attr = this.getAttributeNode(name);

      if ( attr ) {
        attr.value = value;
      } else {
        attr = {name: name, value: value};
        this.attributes.push(attr);
        this.attributeMap_[name] = attr;
      }
    },
    getAttributeNode: function(name) { return this.attributeMap_[name]; },
    getAttribute: function(name) {
      var attr = this.getAttributeNode(name);
      return attr && attr.value;
    },
    appendChild: function(c) { this.childNodes.push(c); },
    removeChild: function(c) {
      for ( var i = 0; i < this.childNodes.length; ++i ) {
        if ( this.childNodes[i] === c ) {
          this.childNodes.splice(i, 1);
          break;
        }
      }
    },
    toString: function() { return this.outerHTML; }
  }
});

