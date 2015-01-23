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
  name: 'Controller',
  package: 'foam.navigator',
  extendsModel: 'View',
  requires: [
    'CachingDAO',
    'FutureDAO',
    'IDBDAO',
    'MDAO',
    'TableView',
    'TextFieldView',
    'ToolbarView',
    'foam.navigator.BrowserConfig',
    'foam.navigator.FOAMlet',
    'foam.navigator.FOAMletBrowserConfig',
    'foam.navigator.types.Todo',
    'foam.navigator.views.OverlayView',
    'foam.navigator.views.SelectTypeView',
    'foam.navigator.dao.MultiDAO'
  ],
  exports: [
    'dao',
    'overlay'
  ],

  properties: [
    {
      name: 'config',
      documentation: 'Sets up the default BrowserConfig, which loads FOAMlets.',
      factory: function() {
        return this.FOAMletBrowserConfig.create();
      }
    },
    {
      name: 'dao',
      factory: function() {
        return this.config.dao;
      }
    },
    {
      name: 'queryParser',
      factory: function() {
        // Constructs and returns our query parser. This parser is
        // model-agnostic and simply turns any "foo:bar" into an axis search.
        // TODO(braden): Actually implement the sophisticated parsing here.
        return function(q) {
          return this.config.queryParser;
        };
      }
    },
    {
      name: 'q',
      view: {
        factory_: 'TextFieldView',
        name: 'search',
        type: 'search',
        onKeyMode: true,
        displayWidth: 95
      }
    },
    {
      name: 'count',
      view: {
        factory_: 'TextFieldView',
        name: 'count',
        mode: 'read-only',
        displayWidth: 10
      }
    },
    {
      name: 'table',
      factory: function() {
        return this.TableView.create({
          model: this.config.model,
          dao: this.dao,
          scrollEnabed: true,
          rows: 20
        });
      },
      postSet: function(old, nu) {
        if (old) Events.unlink(old.scrollbar.value$, this.count$);
        Events.link(nu.scrollbar.value$, this.count$);
      }
    },
    {
      name: 'selection',
      postSet: function(old, nu) {
        this.toolbar.actions = nu.model_.actions;
      }
    },
    {
      name: 'itemToolbar',
      documentation: 'The toolbar for each selected item.',
      factory: function() {
        return this.ToolbarView.create({
          actions: this.config.model.actions,
          value$: this.table.selection$
        });
      }
    },
    {
      name: 'configToolbar',
      documentation: 'The toolbar for the whole config, with top-level ' +
          'operations like creating new items.',
      factory: function() {
        return this.ToolbarView.create({
          actions: this.config.model_.actions,
          value$: this.table.selection$
        });
      }
    },
    {
      name: 'overlay',
      factory: function() {
        return this.OverlayView.create();
      }
    },
  ],

  templates: [
    function CSS() {/*
    */},
    function toInnerHTML() {/*
      %%overlay
      Search: $$q
      Count: $$count
      %%configToolbar
      %%itemToolbar
      %%table
    */}
  ]
});