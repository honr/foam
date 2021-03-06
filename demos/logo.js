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
  name:  'Logo',
  extendsModel: 'foam.graphics.CView',

  requires: [
    'foam.graphics.Circle'
  ],

  constants: {
    COLOURS: ['#33f','#f00','#fc0','#33f','#3c0']
    // COLOURS: ['#333','#aaa','#ccc','#888','#3999']
  },

  properties: [
    {
      name: 'timer',
      factory: function() { return Timer.create(); },
      postSet: function(_, timer) {
        var self = this;
        Events.dynamic(
          function() { self.timer.time; },
          function() { self.paint(); });
      }
    }
  ],

  methods: {
    paintChildren: function() {
      this.SUPER();
      this.addBubble();
    },
    addBubble: function() {
      if ( Math.random() < 0.5 ) return;

      var c = this.canvas;
      var Y = 120;
      var X = 10+Math.random()*310;

      var circle = this.Circle.create({
        x: X,
        y: Y,
        r: 5,
        alpha: 0.8,
        color: null,
        borderWidth: 1,
        border: this.COLOURS[Math.floor(Math.random() * this.COLOURS.length)]});

      this.addChild(circle);
      var M = Movement;

      M.compile([
        [
          [4000, function() {
            circle.x = circle.x + Math.random()*200-100;
            circle.alpha = 0;
            circle.y = Y - 100 - Math.random() * 50;
            circle.r = 25 + Math.random() * 50;
            circle.borderWidth = 8;
           },
           M.easeIn(0.5)
          ]
        ],
        (function() { this.removeChild(circle); }).bind(this)
      ])();
    }
  }
});


CLASS({
  name:  'Logo2',
  extendsModel: 'foam.graphics.CView',

  properties: [
    {
      name: 'text',
      defaultValue: 'FOAM'
    },
    {
      name: 'font',
      defaultValue: '120px Georgia'
    }
  ],

  methods: {
    paintSelf: function() {
      this.SUPER();
      var c = this.canvas;

      c.fillStyle = 'white';
      c.fillRect(0, 0, 700, 140);

      c.font = this.font;
      c.fillStyle = 'rgba(0,0,0,1)';
      c.strokeStyle = 'white';

/*
      c.shadowOffsetX = 5;
      c.shadowOffsetY = 5;
      c.shadowBlur = 8;
      c.shadowColor = '#999';
*/
      c.lineWidth = 1;
      c.strokeStyle = 'gray';
      c.globalCompositeOperation = '';
      c.strokeText(this.text, 0, 100);
      c.globalCompositeOperation = 'destination-out';

      c.fillText(this.text, 0, 100);

//      c.lineWidth = 5;
//      c.strokeText(this.text, 100, 100);
    }
  }
});
