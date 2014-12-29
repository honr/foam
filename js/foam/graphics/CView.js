CLASS({
  package: 'foam.graphics',
  name:  'CView',
  label: 'CView',

  requires: [
    'foam.graphics.PositionedCViewView',
    'foam.graphics.CViewView'
  ],

  documentation: function() {/*
      The base class for a canvas item. A $$DOC{ref:'.'} can be directly inserted
      into the DOM with $$DOC{ref:'.write'}, and will generate a $$DOC{ref:'CViewView'}
      wrapper.</p>
      <p>$$DOC{ref:'.'} submodels directly nest inside each other, with a single
      root $$DOC{ref:'.'} attached to the canvas. Use $$DOC{ref:'.addChild'} to attach a new
      $$DOC{ref:'.'} to the scene graph:</p>
      <p><code>
            var rootNode = this.X.CView.create({width:300, height:200});<br/>
            <br/>
            rootNode.write(document); // a CViewView wrapper is created for us<br/>
            <br/>
            rootNode.addChild(this.X.Circle.create({x:30, y:50, radius: 30, color: 'blue'});<br/>
            rootNode.addChild(this.X.Label.create({x: 50, y: 30, text: "Hello", color: 'black'});<br/>
      </code></p>
      <p>When modeling your own $$DOC{ref:'foam.graphics.CView'} submodel, override $$DOC{ref:'.paintSelf'}
      to render your content. Children will automatically be painted for you. For more direct
      control over child rendering, override $$DOC{ref:'.paint'}.
    */},

  properties: [
    {
      name:  'view',
      type:  'Canvas2',
      postSet: function(_, view) {
        for ( var key in this.children ) {
          var child = this.children[key];
          child.view = view;
          if (view) child.addListener(view.paint);
        }
      },
      hidden: true,
      documentation: function() {/* The canvas view this scene draws into */ }
    },
    {
      name:  'canvas',
      getter: function() { return this.view && this.view.canvas; },
      hidden: true,
      documentation: function() {/* Safe getter for the canvas view this scene draws into */ }
    },
    {
      name:  '$',
      getter: function() { return this.view && this.view.$; },
      hidden: true,
      documentation: function() {/* Safe getter for the canvas DOM element this scene draws into */ }
    },
    {
      name: 'state',
      defaultValue: 'initial',
      documentation: function() {/* Indicates if canvas setup is in progress ('initial'),
                                  or ready to paint ('active'). */}
    },
    {
      name: 'className',
      help: 'CSS class name(s), space separated. Used if adapted with a CViewView.',
      defaultValue: '',
      documentation: function() {/* CSS class name(s), space separated.
          Only used if this is the root node adapted with a $$DOC{ref:'CViewView'}. */}
    },
    {
      name:  'x',
      type:  'int',
      view:  'IntFieldView',
      defaultValue: 0,
      documentation: function() {/*
          The X offset of this view relative to its parent. */}
    },
    {
      name:  'y',
      type:  'int',
      view:  'IntFieldView',
      defaultValue: 0,
      documentation: function() {/*
          The Y offset of this view relative to its parent. */}
    },
    {
      name:  'width',
      type:  'int',
      view:  'IntFieldView',
      defaultValue: 10,
      documentation: function() {/*
          The width of this view. Painting is not automatically clipped, so a view
          may render outside of its apparent rectangle. */},
    },
    {
      name:  'height',
      type:  'int',
      view:  'IntFieldView',
      defaultValue: 10,
      documentation: function() {/*
          The height of this view. Painting is not automatically clipped, so a view
          may render outside of its apparent rectangle. */}
    },
    {
      name: 'parent',
      type: 'foam.graphics.CView'
    },
    {
      name:  'children',
      type:  'foam.graphics.CView[]',
      factory: function() { return []; },
      hidden: true,
      documentation: function() {/*
          Child views render relative to their parent, but are not clipped
          by the parent's apparent rectangle. */}
    },
    {
      name:  'alpha',
      type:  'float',
      defaultValue: 1,
      documentation: function() {/*
          The desired opacity of the content, from 0:transparent to 1:opaque.
          Child views do not inherit and are not limited by this value. */}
    },
    {
      name:  'color',
      label: 'Foreground Color',
      type:  'String',
      defaultValue: 'black',
      documentation: function() {/*
          The foreground color for rendering primary content. */}
    },
    {
      name:  'background',
      label: 'Background Color',
      type:  'String',
      defaultValue: 'white',
      documentation: function() {/*
          The optional background color for opaque items that $$DOC{ref:'.erase'}
          their background. */}
    },
    {
      name: 'font',
      documentation: function() {/*
          The font to use for rendering text, in CSS string format: <code>'24px Roboto'</code>. */}
    }
  ],

  methods: {
    toView_: function() { /* Internal. Creates a CViewView wrapper. */
      if ( ! this.view ) {
        var params = {cview: this};
        if ( this.className ) params.className = this.className;
        if ( this.tooltip )   params.tooltip   = this.tooltip;
        this.view = this.CViewView.create(params);
      }
      return this.view;
    },

    toPositionedView_: function() { /* Internal. Creates a PositionedCViewView wrapper. */
      if ( ! this.view ) {
        var params = {cview: this};
        if ( this.className ) params.className = this.className;
        this.view = this.PositionedCViewView.create(params);
      }
      return this.view;
    },

    initCView: function() { /* Override in submodels for initialization. Callled
          once on first $$DOC{ref:'.paint'} when transitioning from 'initial'
          to 'active' '$$DOC{ref:'.state'}. */ },

    write: function(document) { /* Inserts this $$DOC{ref:'foam.graphics.CView'} into the DOM
                                   with an $$DOC{ref:'foam.graphics.AbstractCViewView'} wrapper. */
      var v = this.toView_();
      document.writeln(v.toHTML());
      v.initHTML();
    },

    addChild: function(child) { /* Adds a child $$DOC{ref:'foam.graphics.CView'} to the scene
                                   under this. */
      this.children.push(child);
      if ( this.view ) {
        child.view = this.view;
        child.addListener(this.view.paint);
      }
      child.parent = this;
      return this;
    },

    addChildren: function() { /* Calls $$DOC{ref:'.addChild'} for each parameter. */
      for ( var key in arguments ) this.addChild(arguments[key]);
      return this;
    },

    removeChild: function(child) { /* Removes a child from the scene. */
      this.children.deleteI(child);
      child.view = undefined;
      child.removeListener(this.view.paint);
      child.parent = undefined;
      return this;
    },

    erase: function() { /* Wipes the canvas area of this $$DOC{ref:'.'}. Primarily used
                          by the root node to clear the entire canvas, but an opaque child
                          may choose to erase its own area, if required. */
      this.canvas.clearRect(0, 0, this.width, this.height);
      this.canvas.fillStyle = this.background;
      this.canvas.fillRect(0, 0, this.width, this.height);
    },

    paintChildren: function() { /* Paints each child. */
      for ( var i = 0 ; i < this.children.length ; i++ ) {
        var child = this.children[i];
        this.canvas.save();
        this.canvas.beginPath(); // reset any existing path (canvas.restore() does not affect path)
        child.paint();
        this.canvas.restore();
      }
    },

    paintSelf: function() { /* Implement this in sub-models to do your painting. */ },

    paint: function() { /* Translates the canvas to our ($$DOC{ref:'.x'}, $$DOC{ref:'.y'}),
                          does a $$DOC{ref:'.paintSelf'} then paints all the children. */
      if ( ! this.$ ) return;
      if ( this.state === 'initial' ) {
        this.initCView();
        this.state = 'active';
      }
      this.canvas.save();
      this.canvas.translate(this.x, this.y);
      //this.erase(); // let the canvas AbstractCViewView take care of erasing the root node
      this.paintSelf();
      this.paintChildren();
      this.canvas.restore();
    },

    mapToParent: function(point) { /* Maps a coordinate from this to our parents'. */
      point.x += this.x;
      point.y += this.y;
      return point;
    },

    mapToCanvas: function(point) { /* Maps a coordinate from this to the canvas.
                    Useful for sharing a point between sibling or cousin items. */
      this.mapToParent(point);
      if (this.parent && this.parent.mapToCanvas) {
        return this.parent.mapToCanvas(point);
      } else {
        return point;
      }
    },

    destroy: function() {
      /* Implement me in submodels to do cleanup when the view is removed. */
    }
  }
});