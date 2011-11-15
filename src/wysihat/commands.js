//= require "./element"
//= require "./dom/selection"
//= require "./events/field_change"

/** section: WysiHat
 *  mixin WysiHat.Commands
 *
 *  Methods will be mixed into the editor element. Most of these
 *  methods will be used to bind to button clicks or key presses.
 *
 *  var editor = WysiHat.Editor.attach(textarea);
 *  $('#bold_button').click(function(event) {
 *    editor.boldSelection();
 *    return FALSE;
 *  });
 *
 *  In this example, it is important to stop the click event so you don't
 *  lose your current selection.
**/
WysiHat.Commands = (function( WIN, DOC, $ ){
	
	var
	TRUE			= true,
	FALSE			= false,
	NULL			= null,
	UNDEFINED,
	OL				= 'ol',
	UL				= 'ul',
	WYSIHAT_EDITOR	= 'WysiHat-editor',
	CHANGE_EVT		= WYSIHAT_EDITOR + ':change',
	
	valid_cmds		= [ 'backColor', 'bold', 'createLink', 'fontName', 'fontSize', 'foreColor', 'hiliteColor', 
						'italic', 'removeFormat', 'strikethrough', 'subscript', 'superscript', 'underline', 'unlink',
						'delete', 'formatBlock', 'forwardDelete', 'indent', 'insertHorizontalRule', 'insertHTML', 
						'insertImage', 'insertLineBreak', 'insertOrderedList', 'insertParagraph', 'insertText', 
						'insertUnorderedList', 'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight', 'outdent',
						'copy', 'cut', 'paste', 'selectAll', 'styleWithCSS', 'useCSS' ],
						
	block_els		= WysiHat.Element.getContentElements().join(',').replace( ',div,', ',div:not(.' + WYSIHAT_EDITOR + '),' );
	
	/**
	*  WysiHat.Commands#boldSelection() -> undefined
	*
	*  Bolds the current selection.
	**/
	function boldSelection()
	{
		// this.execCommand(BOLD, FALSE, NULL);
		if ( isBold )
		{
			this.manipulateSelection(function( range ){
				this.getRangeElements( range, 'b,strong' ).each(this.clearElement);
			});
		}
		else
		{
			this.manipulateSelection(function( range ){
				range.surroundContents( 'strong' );
			}, $quote);
		}
	}
	/**
	*  WysiHat.Commands#boldSelected() -> boolean
	*
	*  Check if current selection is bold or strong.
	**/
	function isBold()
	{
		return selectionIsWithin('b,strong');
	}
	/**
	*  WysiHat.Commands#underlineSelection() -> undefined
	*
	*  Underlines the current selection.
	**/
	function underlineSelection()
	{
		// this.execCommand(UNDERLINE, FALSE, NULL);
		if ( isUnderlined )
		{
			this.manipulateSelection(function( range ){
				this.getRangeElements( range, 'u,ins' ).each(this.clearElement);
			});
		}
		else
		{
			this.manipulateSelection(function( range ){
				range.surroundContents( 'ins' );
			}, $quote);
		}
	}
	/**
	*  WysiHat.Commands#underlineSelected() -> boolean
	*
	*  Check if current selection is underlined.
	**/
	function isUnderlined()
	{
		return selectionIsWithin('u,ins');
	}
	/**
	*  WysiHat.Commands#italicSelection() -> undefined
	*
	*  Italicizes the current selection.
	**/
	function italicizeSelection()
	{
		//this.execCommand(ITALIC, FALSE, NULL);
		if ( isItalic )
		{
			this.manipulateSelection(function( range ){
				this.getRangeElements( range, 'i,em' ).each(this.clearElement);
			});
		}
		else
		{
			this.manipulateSelection(function( range ){
				range.surroundContents( 'em' );
			}, $quote);
		}
	}
	/**
	*  WysiHat.Commands#isItalic() -> boolean
	*
	*  Check if current selection is italic or emphasized.
	**/
	function isItalic()
	{
		return selectionIsWithin('i,em');
	}
	/**
	*  WysiHat.Commands#italicSelection() -> undefined
	*
	*  Strikethroughs the current selection.
	**/
	function strikethroughSelection()
	{
		// this.execCommand(STRIKETHROUGH, FALSE, NULL);
		if ( isStruckthrough )
		{
			this.manipulateSelection(function( range ){
				this.getRangeElements( range, 's,del' ).each(this.clearElement);
			});
		}
		else
		{
			this.manipulateSelection(function( range ){
				range.surroundContents( 'del' );
			}, $quote);
		}
	}
	/**
	*  WysiHat.Commands#isStruckthrough() -> undefined
	*
	*  Check if current selection is struck through.
	**/
	function isStruckthrough()
	{
		return selectionIsWithin('s,del');
	}

	
	/**
	*  WysiHat.Commands#quoteSelection() -> undefined
	*
	*  Places the currently selected block(s) in a blockquote.
	**/
	function quoteSelection()
	{
		//this.execCommand('indent', FALSE, NULL);
		var $quote = $('<blockquote/>');
		this.manipulateSelection(function( range, $quote ){
			var $q = $quote.clone();
			this.getRangeElements( range, block_els ).each(function(i){
				var
				$this	= $(this),
				list	= false,
				$el;
				if ( $this.is('li') )
				{
					list = true;
					$el = $('<p/>').html( $this.html() );
					$this.replaceWith( $el );
					$this = $el;
				}
				if ( ! i )
				{
					if ( list )
					{
						$q.wrap('<li/>');
						$el = $q.parent();
						$this.replaceWith( $el );
					}
					else
					{
						$this.replaceWith( $q );
					}
				}
				$this.appendTo( $q );
			});
		}, $quote);
	}
	/**
	*  WysiHat.Commands#unquoteSelection() -> undefined
	*
	*  removes the blockquote around the current selection.
	**/
	function unquoteSelection()
	{
		//this.execCommand('outdent', FALSE, NULL);
		this.manipulateSelection(function( range ){
			this.getRangeElements( range, 'blockquote > *' ).each(function(){
				var
				$this	= $(this).unwrap('blockquote'),
				$parent	= $this.parent();
				// strip unnecessary paragraphs
				if ( $parent.is('li') &&
				 	 $parent.children().length == 1 )
				{
					$parent.html( $this.html() );
				}
			});
		});
	}
	/**
	*  WysiHat.Commands#toggleIndentation() -> undefined
	*
	*  Toggles indentation the current selection.
	**/
	function toggleIndentation()
	{
		if ( this.isIndented() )
		{
			this.unquoteSelection();
		}
		else
		{
			this.quoteSelection();
		}
	}
	/**
	*  WysiHat.Commands#isIndented() -> boolean
	*
	*  Check if current selection is indented.
	**/
	function isIndented()
	{
		return selectionIsWithin('blockquote');
	}


	/**
	* WysiHat.Commands#fontSelection(font) -> undefined
	*
	* Sets the font for the current selection
	**/
	function fontSelection(font)
	{
		this.execCommand('fontname', FALSE, font);
	}
	/**
	* WysiHat.Commands#fontSizeSelection(fontSize) -> undefined
	* - font size (int) : font size for selection
	*
	* Sets the font size for the current selection
	**/
	function fontSizeSelection(fontSize)
	{
		this.execCommand('fontsize', FALSE, fontSize);
	}
	/**
	*  WysiHat.Commands#colorSelection(color) -> undefined
	*  - color (String): a color name or hexadecimal value
	*
	*  Sets the foreground color of the current selection.
	**/
	function colorSelection(color)
	{
		this.execCommand('forecolor', FALSE, color);
	}
	/**
	*  WysiHat.Commands#backgroundColorSelection(color) -> undefined
	*  - color (string) - a color or hexadecimal value
	*
	* Sets the background color.  Firefox will fill in the background
	* color of the entire iframe unless hilitecolor is used.
	**/
	function backgroundColorSelection(color)
	{
		if ( $.browser.mozilla )
		{
			this.execCommand('hilitecolor', FALSE, color);
		}
		else
		{
			this.execCommand('backcolor', FALSE, color);
		}
	}


	/**
	*  WysiHat.Commands#alignSelection(color) -> undefined
	*  - alignment (string) - how the text should be aligned (left, center, right)
	*
	**/
	function alignSelection(alignment)
	{
		this.execCommand('justify' + alignment);
	}
	/**
	*  WysiHat.Commands#backgroundColorSelected() -> alignment
	*
	*  Returns the alignment of the selected text area
	**/
	function alignSelected()
	{
		var node = WIN.getSelection().getNode();
		return $(node).css('textAlign');
	}


	/**
	*  WysiHat.Commands#linkSelection(url) -> undefined
	*  - url (String): value for href
	*
	*  Wraps the current selection in a link.
	**/
	function linkSelection(url)
	{
		this.execCommand('createLink', FALSE, url);
	}
	/**
	*  WysiHat.Commands#unlinkSelection() -> undefined
	*
	*  Selects the entire link at the cursor and removes it
	**/
	function unlinkSelection()
	{
		//var node = WIN.getSelection().getNode();
		//if ( this.linkSelected() )
		//{
		//	WIN.getSelection().selectNode(node);
		//}
		//this.execCommand('unlink', FALSE, NULL);
		this.manipulateSelection(function( range ){
			this.getRangeElements( range, '[href]' ).each(this.clearElement);
		});
	}
	/**
	*  WysiHat.Commands#isLinked() -> boolean
	*
	*  Check if current selection is link.
	**/
	function isLinked()
	{
		// inside some sort of link
		return selectionIsWithin('[href]');
	}
	

	/**
	*  WysiHat.Commands#toggleOrderedList() -> undefined
	*
	*  Formats current selection as an ordered list. If the selection is empty
	*  a new list is inserted.
	*
	*  If the selection is already a ordered list, the entire list
	*  will be toggled. However, toggling the last item of the list
	*  will only affect that item, not the entire list.
	**/
	function toggleOrderedList()
	{
		//var
		//selection	= WIN.getSelection(),
		//$node		= $( selection.getNode() );
        //
		//if ( this.orderedListSelected() &&
		//	 ! $node.is( 'ol li:last-child, ol li:last-child *' ) )
		//{
		//	selection.selectNode( $node.parent(OL) );
		//}
		//else if ( this.unorderedListSelected() )
		//{
		//	// Toggle list type
		//	selection.selectNode( $node.parent(UL) );
		//}
		//this.execCommand('insertorderedlist', FALSE, NULL);
		var
		$list	= $('<ol/>');
		
		if ( isOrderedList() )
		{
			this.manipulateSelection(function( range, $list ){
				this.getRangeElements( range, 'ol' ).each(function(i){
					var $this = $(this);
					$this.children('li').each(function(){
						var $this = $(this);
						replaceElement( $this, 'p' );
						$this.find('ol,ul').each(function(){
							var	$parent = $(this).parent();
							if ( $parent.is('p') )
							{
								deleteElement.apply( $parent );
							}
						});
					});
					deleteElement.apply( $this );
				});
			});
		}
		else
		{
			this.manipulateSelection(function( range, $list ){
				var $l = $list.clone();
				this.getRangeElements( range, block_els ).each(function(i){
					var $this = $(this);
					if ( $this.parent().is('ul') )
					{
						replaceElement( $this.parent(), 'ol' );
						$l = $this.parent();
					}
					else
					{
						if ( ! i )
						{
							$this.replaceWith( $l );
						}
						$this.appendTo( $l );
					} 
				});
				$l.children(':not(li)').each(function(){
					replaceElement( $(this), 'li' );
				});
			}, $list );
		}
		
	}
	/**
	*  WysiHat.Commands#insertOrderedList() -> undefined
	*
	*  Alias for WysiHat.Commands#toggleOrderedList
	**/
	function insertOrderedList()
	{
		toggleOrderedList();
	}
	/**
	*  WysiHat.Commands#orderedListSelected() -> boolean
	*
	*  Check if current selection is within an ordered list.
	**/
	function isOrderedList()
	{
		return selectionIsWithin('ol');
	}
	/**
	*  WysiHat.Commands#toggleUnorderedList() -> undefined
	*
	*  Formats current selection as an unordered list. If the selection is empty
	*  a new list is inserted.
	*
	*  If the selection is already a unordered list, the entire list
	*  will be toggled. However, toggling the last item of the list
	*  will only affect that item, not the entire list.
	**/
	function toggleUnorderedList()
	{
		//var
		//selection	= WIN.getSelection(),
		//node		= selection.getNode();
        //
		//if ( this.unorderedListSelected() &&
		//	 ! node.is("ul li:last-child, ul li:last-child *") )
		//{
		//	selection.selectNode(node.parent(UL));
		//}
		//else if ( this.orderedListSelected() )
		//{
		//	// Toggle list type
		//	selection.selectNode(node.parent(OL));
		//}
		//this.execCommand('insertunorderedlist', FALSE, NULL);
		var
		$list	= $('<ul/>');
		
		if ( isUnorderedList() )
		{
			this.manipulateSelection(function( range, $list ){
				this.getRangeElements( range, 'ul' ).each(function(i){
					var $this = $(this);
					$this.children('li').each(function(){
						var $this = $(this);
						replaceElement( $this, 'p' );
						$this.find('ol,ul').each(function(){
							var	$parent = $(this).parent();
							if ( $parent.is('p') )
							{
								deleteElement.apply( $parent );
							}
						});
					});
					deleteElement.apply( $this );
				});
			});
		}
		else
		{
			this.manipulateSelection(function( range, $list ){
				var $l = $list.clone();
				this.getRangeElements( range, block_els ).each(function(i){
					var $this = $(this);
					if ( $this.parent().is('ol') )
					{
						replaceElement( $this.parent(), 'ul' );
						$l = $this.parent();
					}
					else
					{
						if ( ! i )
						{
							$this.replaceWith( $l );
						}
						$this.appendTo( $l );
					} 
				});
				$l.children(':not(li)').each(function(){
					replaceElement( $(this), 'li' );
				});
			}, $list );
		}
		
	}
	/**
	*  WysiHat.Commands#insertUnorderedList() -> undefined
	*
	*  Alias for WysiHat.Commands#toggleUnorderedList()
	**/
	function insertUnorderedList()
	{
		toggleUnorderedList();
	}
	/**
	*  WysiHat.Commands#unorderedListSelected() -> boolean
	*
	*  Check if current selection is within an unordered list.
	**/
	function isUnorderedList()
	{
		return selectionIsWithin('ul');
	}

	
	/**
	*  WysiHat.Commands#insertImage(url) -> undefined
	*
	*  - url (String): value for src
	*  Insert an image at the insertion point with the given url.
	**/
	function insertImage(url)
	{
		this.execCommand('insertImage', FALSE, url);
	}


	/**
	*  WysiHat.Commands#insertHTML(html) -> undefined
	*
	*  - html (String): HTML or plain text
	*  Insert HTML at the insertion point.
	**/
	function insertHTML(html)
	{
		if ( $.browser.msie )
		{
			var range = WIN.document.selection.createRange();
			range.pasteHTML(html);
			range.collapse(FALSE);
			range.select();
		}
		else
		{
			this.execCommand('insertHTML', FALSE, html);
		}
	}

	/**
	*  WysiHat.Commands#wrapHTML( tagName[, tagName]+) -> undefined
	*  - tagName (String): Tag to wrap around content
	*
	*  Wraps the selected text in the supplied tags, in reverse order
	**/
	function wrapHTML()
	{
		var
		selection	= WIN.getSelection(),
		range		= selection.getRangeAt(0),
		node		= selection.getNode(),
		arg_length	= arguments.length,
		el;
		
		if (range.collapsed)
		{
			range = DOC.createRange();
			range.selectNodeContents(node);
			selection.removeAllRanges();
			selection.addRange(range);
		}
		range = selection.getRangeAt(0);
		while ( arg_length-- )
		{
			el = $('<' + arguments[arg_length] + '/>');
			range.surroundContents( el.get(0) );
			// ToDo: update the range
		}
		$(DOC.activeElement).trigger( CHANGE_EVT );
	}
	
	/**
	*  WysiHat.Commands#blockFormat( tagName ) -> undefined
	*  - tagName (String): block tag to establish
	*
	*  swaps the current block for another block-level tag
	**/
	function changeContentBlock( tagName )
	{
		// Sample:
		// <h1>This is a test</h2>
		// <p><img src="http://easy-designs.net/img/logo.png" alt=""/></p>
		
		var
		selection	= WIN.getSelection(),
		editor		= this,
		$editor		= $(editor),
		replaced	= 'WysiHat-replaced',
		i			= selection.rangeCount,
		ranges		= [],
		range;
		
		while ( i-- )
		{
			range	= selection.getRangeAt( i );
			ranges.push( range );

			// update as necessary
			this.getRangeElements( range, block_els )
				.each(function(){
					editor.replaceElement( $(this), tagName );
				 })
				.data( replaced, TRUE );
			
		}
		// cleanup
		$editor
			.children( tagName )
				.removeData( replaced );

		$(DOC.activeElement).trigger( CHANGE_EVT );

		this.restoreRanges( ranges );
	}

	/**
	*  WysiHat.Commands#unformatContentBlock() -> undefined
	*
	*  Returns the current content block to the default paragraph type
	**/
	function unformatContentBlock()
	{
		this.changeContentBlock('p');
	}

	/**
	*  WysiHat.Commands#replaceElement( $el, tagName ) -> undefined
	*  - $el (jQuery Object): $element to be replaced
	*  - tagName (String): block tag to establish
	*
	*  swaps the current block for another block-level tag
	**/
	function replaceElement( $el, tagName )
	{
		// don't change the editor EVER!
		if ( $el.is( '.' + WYSIHAT_EDITOR ) )
		{
			return;
		}

		var
		old		= $el.get(0),
		$new	= $('<'+tagName+'/>')
					.html( $el.html() ),
		
		// copy attributes?
		attrs	= old.attributes,
		len		= attrs.length;
		if ( len )
		{
			while ( len-- )
			{
				$new.attr( attrs[len].name, attrs[len].value );
			}
		}
		
		$el.replaceWith( $new );
		
		return $new;
	}
	
	/**
	*  WysiHat.Commands#deleteElement() -> undefined
	*
	*  Replaces an existing content with it's contents
	**/
	function deleteElement()
	{
		var $this = $(this);
		$this.replaceWith( $this.html() );
	}

	/**
	*  WysiHat.Commands#stripFormattingElements() -> undefined
	*
	*  Removes any elements classified as formatting elements
	**/
	function stripFormattingElements()
	{
		// Sample:
		// <h1>This is <em><del>a</del></em> test</h1>
		// <h2>This is <strong>not</strong> a test</h2>
		// <h2><img src="http://easy-designs.net/img/logo.png" alt=""></h2>
		// <h2>This is a <em>test</em></h2>

		function stripFormatters( i, el )
		{
			var $el = $(el);

			// clean children first
			$el.children().each(stripFormatters);

			if ( isFormatter( $el ) )
			{
				deleteElement.apply( $el );
			}
		}
		
		var
		selection	= WIN.getSelection(),
		isFormatter	= WysiHat.Element.isFormatter,
		i			= selection.rangeCount,
		ranges		= [],
		range;

		while ( i-- )
		{
			range = selection.getRangeAt( i );
			ranges.push( range );
			this.getRangeElements( range, block_els ).each( stripFormatters );
		}

		$(DOC.activeElement).trigger( CHANGE_EVT );
		
		this.restoreRanges( ranges );
	}
	
	/**
	*  WysiHat.Commands#isValidCommand( cmd ) -> boolean
	*  - cmd (String): the command you want to make sure is valid
	* 
	*  Checks the validity of the command
	**/
	function isValidCommand( cmd )
	{
		return ( $.inArray( cmd, valid_cmds ) > -1 );
	}
	/**
	*  WysiHat.Commands#execCommand(command[, ui = FALSE][, value = NULL]) -> undefined
	*  - command (String): Command to execute
	*  - ui (Boolean): Boolean flag for showing UI. Currenty this not
	*    implemented by any browser. Just use FALSE.
	*  - value (String): Value to pass to command
	*
	*  A simple delegation method to the documents execCommand method.
	**/
	function execCommand( command, ui, value )
	{
		var handler = this.commands[command];
		if ( handler )
		{
			handler.bind(this)(value);
		}
		else
		{
			try {
				WIN.document.execCommand(command, ui, value);
			}
			catch(e) { return NULL; }
		}
		$(DOC.activeElement).trigger( CHANGE_EVT );
	}
	/**
	*  WysiHat.Commands#queryCommandState(state) -> Boolean
	*  - state (String): bold, italic, underline, etc
	*
	*  A delegation method to the document's queryCommandState method.
	*
	*  Custom states handlers can be added to the queryCommands hash,
	*  which will be checked before calling the native queryCommandState
	*  command.
	*
	*  editor.queryCommands.set("link", editor.linkSelected);
	**/
	function queryCommandState(state)
	{
		var handler = this.queryCommands[state];
		if ( handler )
		{
			return handler();
		}
		else
		{
			try {
				return WIN.document.queryCommandState(state);
			}
			catch(e) { return NULL; }
		}
	}

	/**
	*  WysiHat.Commands#getSelectedStyles() -> Hash
	*
	*  Fetches the styles (from the styleSelectors hash) from the current
	*  selection and returns it as a hash
	**/
	function getSelectedStyles()
	{
		var
		styles = {},
		editor = this;
		editor.styleSelectors.each(function(style){
			var node = editor.selection.getNode();
			styles[style.first()] = $(node).css(style.last());
		});
		return styles;
	}
	
	/**
	*  WysiHat.Commands#toggleHTML( e ) -> undefined
	*  - e (Event): the click event
	* 
	*  Toggles the visibility of the HTML produced
	**/
	function toggleHTML( e )
	{
		var 
		HTML	= FALSE,
		$editor	= $(this),
		$target	= $( e.target ),
		text	= $target.text(),
		$btn	= $target.closest( 'a[role=button]' ),
		$field	= $editor.data('field'),
		$tools	= $btn.siblings();
		
		if ( $btn.data('toggle-text') == UNDEFINED )
		{
			$btn.data('toggle-text','View Content');
		}

		this.toggleHTML = function()
		{
			if ( ! HTML )
			{
				$btn.find('span').text($btn.data('toggle-text'));
				$tools.hide();
				$editor.trigger('WysiHat-editor:change:immediate').hide();
				$field.show();
			}
			else
			{
				$btn.find('span').text(text);
				$tools.show();
				$field.trigger('WysiHat-field:change:immediate').hide();
				$editor.show();
			}
			HTML = ! HTML;
		};
		
		this.toggleHTML();
	}
	
	
	/**
	*  WysiHat.Commands#manipulateSelection( callback )
	*  - callback (Function): the function you want to run
	* 
	*  Runs the supplied function in the context of the Commands object
	*  Any additional arguments are passed directly to the callback
	**/
	function manipulateSelection()
	{
		var
		selection	= WIN.getSelection(),
		i			= selection.rangeCount,
		ranges		= [],
		args		= arguments,
		callback	= args[0],
		range;

		while ( i-- )
		{
			range	= selection.getRangeAt( i );
			ranges.push( range );
			
			// change the first arg to the range
			args[0] = range;

			// run the callback
			callback.apply( this, args );
		}
		$(DOC.activeElement).trigger( CHANGE_EVT );
		this.restoreRanges( ranges );
	}
	/**
	*  WysiHat.Commands#getRangeElements(range) -> collection
	*  - range (Range): the range to find the elements within
	*  - tagNames (String): a comma-separated string of tag names
	* 
	*  Fetches a collection of elements within a given Range and returns a jQuery object
	**/
	function getRangeElements( range, tagNames )
	{
		var
		// find the start and end of the range
		$from	= $( range.startContainer ).closest( tagNames ),
		$to		= $( range.endContainer ).closest( tagNames ),
		$els	= $('nullset');

		// make sure we never go higher in the DOM than the editor
		if ( !! $from.parents('.WysiHat-editor').length &&
		 	 !! $to.parents('.WysiHat-editor').length )
		{
			$els = $from;
			
			// figure out the elements to collect
			if ( ! $from.filter( $to ).length )
			{
				if ( $from.nextAll().filter( $to ).length )
				{
					$els = $from.nextUntil( $to ).andSelf().add( $to );
				}
				else
				{
					$els = $from.prevUntil( $to ).andSelf().add( $to );
				}
			}
			
		}
		
		return $els;
	}
	/**
	*  WysiHat.Commands#restoreRanges(ranges) -> undefined
	*  - ranges (Array): an array of Range objects to be re-established
	* 
	*  Restores previously selected ranges
	**/
	function restoreRanges( ranges )
	{
		var
		selection = WIN.getSelection(),
		i = ranges.length;
		
		selection.removeAllRanges();
		while ( i-- )
		{
			selection.addRange( ranges[i] );
		}
	}
	/**
	*  WysiHat.Commands#selectionIsWithin( tagNames ) -> boolean
	*  - tagNames (String): a comma-separated list of tags
	* 
	*  Checks to see if the selection is within one of the supplied tags
	**/
	function selectionIsWithin( tagNames )
	{
		return !! $( WIN.getSelection().getNode() ).closest( tagNames ).length;
	}
	
	
	return {
		// phrase-level formatting
		boldSelection:				boldSelection,
		isBold:						isBold,
		italicizeSelection:			italicizeSelection,
		isItalic:					isItalic,
		underlineSelection:			underlineSelection,
		isUnderlined:				isUnderlined,
		strikethroughSelection:		strikethroughSelection,
		isStruckthrough:			isStruckthrough,
		
		// blockquote-related
		quoteSelection:				quoteSelection,
		unquoteSelection:			unquoteSelection,
		toggleIndentation:			toggleIndentation,
		isIndented:					isIndented,
		
		fontSelection:				fontSelection,
		fontSizeSelection:			fontSizeSelection,
		colorSelection:				colorSelection,
		backgroundColorSelection:	backgroundColorSelection,
		
		alignSelection:				alignSelection,
		alignSelected:				alignSelected,
		
		linkSelection:				linkSelection,
		unlinkSelection:			unlinkSelection,
		isLinked:					isLinked,
		
		toggleOrderedList:			toggleOrderedList,
		insertOrderedList:			insertOrderedList,
		isOrderedList:				isOrderedList,
		toggleUnorderedList:		toggleUnorderedList,
		insertUnorderedList:		insertUnorderedList,
		isUnorderedList:			isUnorderedList,

		insertImage:				insertImage,

		insertHTML:					insertHTML,
		wrapHTML:					wrapHTML,

		changeContentBlock:			changeContentBlock,
		unformatContentBlock:		unformatContentBlock,
		replaceElement:				replaceElement,
		deleteElement:				deleteElement,
		stripFormattingElements:	stripFormattingElements,

		execCommand:				execCommand,
		queryCommandState:			queryCommandState,
		getSelectedStyles:			getSelectedStyles,

		toggleHTML:					toggleHTML,
		
		isValidCommand:				isValidCommand,
		manipulateSelection:		manipulateSelection,
		getRangeElements:			getRangeElements,
		restoreRanges:				restoreRanges,
		selectionIsWithin:			selectionIsWithin,
		
		commands: {},

		queryCommands: {
			bold:			isBold,
			italic:			isItalic,
			underline:		isUnderlined,
			strikethrough:	isStruckthrough,
			createLink:		isLinked,
			orderedlist:	isOrderedList,
			unorderedlist:	isUnorderedList
		},

		styleSelectors: {
			fontname:		'fontFamily',
			fontsize:		'fontSize',
			forecolor:		'color',
			hilitecolor:	'backgroundColor',
			backcolor:		'backgroundColor'
		}
	};
})( window, document, jQuery );