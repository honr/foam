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
  name: 'InterfaceFullPageDocView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.FullPageDocView',

  requires: ['foam.ui.DAOListView',
             'foam.documentation.SimpleRowDocView'],

  documentation: "A full-page documentation view for $$DOC{ref:'Interface'} instances.",

  templates: [

    function toInnerHTML()    {/*
<%    this.destroy(); %>
<%    if (this.data) {  %>
        $$data{ model_: 'foam.documentation.SummaryDocView', model: this.data.model_ }
        <div class="members">
          <p class="feature-type-heading">Methods:</p>
          <div class="memberList">$$methods{ model_: 'foam.ui.DAOListView', rowView: 'foam.documentation.SimpleRowDocView', mode: 'read-only' }</div>
        </div>
<%    } %>
    */}
  ]

});
