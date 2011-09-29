//= require "events/selection_change"

/** section: WysiHat
 *  class WysiHat.Toolbar
**/
(function($){
	
	WysiHat.Toolbar = function()
	{
		var
		$editor,
		$toolbar;

		/**
		*  new WysiHat.Toolbar()
		* 
		*  Creates a toolbar element above the editor. The WysiHat.Toolbar object
		*  has many helper methods to easily add buttons to the toolbar.
		*
		*  This toolbar class is not required for the Editor object to function.
		*  It is merely a set of helper methods to get you started and to build
		*  on top of. If you are going to use this class in your application,
		*  it is highly recommended that you subclass it and override methods
		*  to add custom functionality.
		**/
		function initialize( $el )
		{
			$editor	= $el;
			createToolbarElement();
		}
		
		/**
		*  WysiHat.Toolbar#createToolbarElement() -> Element
		*
		*  Creates a toolbar container element and inserts it right above the
		*  original textarea element. The element is a div with the class
		*  'editor_toolbar'.
		*
		*  You can override this method to customize the element attributes and
		*  insert position. Be sure to return the element after it has been
		*  inserted.
		**/
		function createToolbarElement()
		{
			$toolbar = $('<div class="editor_toolbar" role="presentation"></div>')
							.insertBefore( $editor );
		}

		/**
		*  WysiHat.Toolbar#addButtonSet(set) -> undefined
		*  - set (Array): The set array contains nested arrays that hold the
		*  button options, and handler.
		*
		*  Adds a button set to the toolbar.
		**/
		function addButtonSet(options)
		{
			$(options.buttons).each(function(index, button){
				addButton(button);
			});
		}

		/**
		*  WysiHat.Toolbar#addButton(options[, handler]) -> undefined
		*  - options (Hash): Required options hash
		*  - handler (Function): Function to bind to the button
		*
		*  The options hash accepts two required keys, name and label. The label
		*  value is used as the link's inner text. The name value is set to the
		*  link's class and is used to check the button state. However the name
		*  may be omitted if the name and label are the same. In that case, the
		*  label will be down cased to make the name value. So a "Bold" label
		*  will default to "bold" name.
		*
		*  The second optional handler argument will be used if no handler
		*  function is supplied in the options hash.
		*
		*  toolbar.addButton({
		*    name: 'bold', label: "Bold" }, function(editor) {
		*      editor.boldSelection();
		*  });
		*
		*  Would create a link,
		*  "<a href='#' class='button bold'><span>Bold</span></a>"
		**/
		function addButton( options, handler )
		{
			var name, button;
			
			if ( ! options['name'] )
			{
				options['name'] = options['label'].toLowerCase();
			}
			name = options['name'];

			$button = createButtonElement( $toolbar, options );

			if ( handler )
			{
				options['handler'] = handler;
			}
			handler = buttonHandler( name, options );
			observeButtonClick( $button, handler );

			handler = buttonStateHandler( name, options );
			observeStateChanges( $button, name, handler );
		}

		/**
		*  WysiHat.Toolbar#createButtonElement(toolbar, options) -> Element
		*  - toolbar (Element): Toolbar element created by createToolbarElement
		*  - options (Hash): Options hash that pass from addButton
		*
		*  Creates individual button elements and inserts them into the toolbar
		*  container. The default elements are 'button' tags with ARIA roles.
		**/
		function createButtonElement( $toolbar, options )
		{
			var $btn = $('<a role="button" aria-pressed="false" href="#" tabindex="-1"><span>' + options['label'] + '</span></a>')
							.addClass( 'button ' + options['name'] )
							.appendTo( $toolbar );
			
			if ( options['cssClass'] )
			{
				$btn.addClass( options['cssClass'] );
			}
			
			if ( options['title'] )
			{
				$btn.attr('title',options['title']);
			}
			
			if ( options['toggle-text'] )
			{
				$btn.data( 'toggle-text', options['toggle-text'] );
			}
			
			return $btn;
						
		}

		/**
		*  WysiHat.Toolbar#buttonHandler(name, options) -> Function
		*  - name (String): Name of button command: 'bold', 'italic'
		*  - options (Hash): Options hash that pass from addButton
		*
		*  Returns the button handler function to bind to the buttons onclick
		*  event. It checks the options for a 'handler' attribute otherwise it
		*  defaults to a function that calls execCommand with the button name.
		**/
		function buttonHandler( name, options )
		{
			var handler = function(){};
			if ( options['handler'] )
			{
				handler = options['handler'];
			}
			else if ( WysiHat.Commands.isValidCommand( name ) )
			{
				handler = function( $editor )
				{
					return $editor.execCommand(name);
				};
			}
			return handler;
		}

		/**
		*  WysiHat.Toolbar#observeButtonClick(element, handler) -> undefined
		*  - $button (jQuery): Button element
		*  - handler (Function): Handler function to bind to element
		*
		*  Bind handler to elements onclick event.
		**/
		function observeButtonClick( $button, handler )
		{
			$button.click(function(e){
				handler( $editor, e );
				//event.stop();
				$( document.activeElement ).trigger( 'WysiHat-selection:change' );
				return false;
			});
		}

		/**
		*  WysiHat.Toolbar#buttonStateHandler(name, options) -> Function
		*  - name (String): Name of button command: 'bold', 'italic'
		*  - options (Hash): Options hash that pass from addButton
		*
		*  Returns the button handler function that checks whether the button
		*  state is on (true) or off (false). It checks the options for a
		*  'query' attribute otherwise it defaults to a function that calls
		*  queryCommandState with the button name.
		**/
		function buttonStateHandler( name, options )
		{
			var handler = function(){};
			if ( options['query'] )
			{
				handler = options['query'];
			}
			else if ( WysiHat.Commands.isValidCommand( name ) )
			{
				handler = function( $editor )
				{
					return $editor.queryCommandState(name);
				};
			}
			return handler;
		}

		/**
		*  WysiHat.Toolbar#observeStateChanges($element, name, handler) -> undefined
		*  - $button (jQuery): Button element
		*  - name (String): Button name
		*  - handler (Function): State query function
		*
		*  Determines buttons state by calling the query handler function then
		*  calls updateButtonState.
		**/
		function observeStateChanges( $button, name, handler )
		{
			var previousState;
			$editor.bind( 'WysiHat-selection:change', function(){
				var state = handler( $editor );
				if (state != previousState)
				{
					previousState = state;
					updateButtonState( $button, name, state );
				}
			});
		}

		/**
		*  WysiHat.Toolbar#updateButtonState(element, name, state) -> undefined
		*  - $button (jQuery): Button element
		*  - name (String): Button name
		*  - state (Boolean): Whether button state is on/off
		*
		*  If the state is on, it adds a 'selected' class to the button element.
		*  Otherwise it removes the 'selected' class.
		*
		*  You can override this method to change the class name or styles
		*  applied to buttons when their state changes.
		**/
		function updateButtonState( $button, name, state )
		{
			if ( state )
			{
				$button
					.addClass('selected')
					.attr('aria-pressed','true');
			}
			else
			{
				$button
					.removeClass('selected')
					.attr('aria-pressed','false');
			}
		}

		return {
			initialize:           initialize,
			createToolbarElement: createToolbarElement,
			addButtonSet:         addButtonSet,
			addButton:            addButton,
			createButtonElement:  createButtonElement,
			buttonHandler:        buttonHandler,
			observeButtonClick:   observeButtonClick,
			buttonStateHandler:   buttonStateHandler,
			observeStateChanges:  observeStateChanges,
			updateButtonState:    updateButtonState
		};
	};
	
})(jQuery);


/**
 * WysiHat.Toolbar.ButtonSets
 *
 *  A namespace for various sets of Toolbar buttons. These sets should be
 *  compatible with WysiHat.Toolbar, and can be added to the toolbar with:
 *  toolbar.addButtonSet(WysiHat.Toolbar.ButtonSets.Basic);
**/
WysiHat.Toolbar.ButtonSets = {};

/**
 * WysiHat.Toolbar.ButtonSets.Basic
 *
 *  A basic set of buttons: bold, underline, and italic. This set is
 *  compatible with WysiHat.Toolbar, and can be added to the toolbar with:
 *  toolbar.addButtonSet(WysiHat.Toolbar.ButtonSets.Basic);
**/
WysiHat.Toolbar.ButtonSets.Basic = [
	{ label: "Bold" },
	{ label: "Underline" },
	{ label: "Italic" }
];

/**
 * WysiHat.Toolbar.ButtonSets.Standard
 * 
 * The most common set of buttons that I will be using.
**/
WysiHat.Toolbar.ButtonSets.Standard = [
	{ label: "Bold", cssClass: 'toolbar_button' },
	{ label: "Italic", cssClass: 'toolbar_button' },
	{ label: "Strikethrough", cssClass: 'toolbar_button' },
	{ label: "Bullets", cssClass: 'toolbar_button', handler: function(editor) { return editor.toggleUnorderedList(); } }
];
