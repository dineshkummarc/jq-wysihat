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
	BOLD			= 'bold',
	UNDERLINE		= 'underline',
	ITALIC			= 'italic',
	STRIKETHROUGH	= 'strikethrough',
	OL				= 'ol',
	UL				= 'ul';
	
	/**
	*  WysiHat.Commands#boldSelection() -> undefined
	*
	*  Bolds the current selection.
	**/
	function boldSelection()
	{
		//this.wrapHTML('strong');
		this.execCommand(BOLD, FALSE, NULL);
	}

	/**
	*  WysiHat.Commands#boldSelected() -> boolean
	*
	*  Check if current selection is bold or strong.
	**/
	function boldSelected()
	{
		return this.queryCommandState(BOLD);
	}

	/**
	*  WysiHat.Commands#underlineSelection() -> undefined
	*
	*  Underlines the current selection.
	**/
	function underlineSelection()
	{
		this.execCommand(UNDERLINE, FALSE, NULL);
	}

	/**
	*  WysiHat.Commands#underlineSelected() -> boolean
	*
	*  Check if current selection is underlined.
	**/
	function underlineSelected()
	{
		return this.queryCommandState(UNDERLINE);
	}

	/**
	*  WysiHat.Commands#italicSelection() -> undefined
	*
	*  Italicizes the current selection.
	**/
	function italicSelection()
	{
		this.execCommand(ITALIC, FALSE, NULL);
	}

	/**
	*  WysiHat.Commands#italicSelected() -> boolean
	*
	*  Check if current selection is italic or emphasized.
	**/
	function italicSelected()
	{
		return this.queryCommandState(ITALIC);
	}

	/**
	*  WysiHat.Commands#italicSelection() -> undefined
	*
	*  Strikethroughs the current selection.
	**/
	function strikethroughSelection()
	{
		this.execCommand(STRIKETHROUGH, FALSE, NULL);
	}

	/**
	*  WysiHat.Commands#indentSelection() -> undefined
	*
	*  Indents the current selection.
	**/
	function indentSelection()
	{
		//this.wrapHTML('blockquote','p');
		// TODO: Should use feature detection
		if ($.browser.mozilla)
		{
			var
			selection	= WIN.getSelection(),
			range		= selection.getRangeAt(0),
			node		= selection.getNode(),
			blockquote	= $('<blockquote/>');
			if (range.collapsed)
			{
				range = DOC.createRange();
				range.selectNodeContents(node);
				selection.removeAllRanges();
				selection.addRange(range);
			}
			range = selection.getRangeAt(0);
			range.surroundContents(blockquote);
		}
		else
		{
			this.execCommand('indent', FALSE, NULL);
		}
	}

	/**
	*  WysiHat.Commands#outdentSelection() -> undefined
	*
	*  Outdents the current selection.
	**/
	function outdentSelection()
	{
		this.execCommand('outdent', FALSE, NULL);
	}

	/**
	*  WysiHat.Commands#toggleIndentation() -> undefined
	*
	*  Toggles indentation the current selection.
	**/
	function toggleIndentation()
	{
		if ( this.indentSelected() )
		{
			this.outdentSelection();
		}
		else
		{
			this.indentSelection();
		}
	}

	/**
	*  WysiHat.Commands#indentSelected() -> boolean
	*
	*  Check if current selection is indented.
	**/
	function indentSelected()
	{
		var node = WIN.getSelection().getNode();
		return node.is("blockquote, blockquote *");
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
		var node = WIN.getSelection().getNode();
		if ( this.linkSelected() )
		{
			WIN.getSelection().selectNode(node);
		}
		this.execCommand('unlink', FALSE, NULL);
	}

	/**
	*  WysiHat.Commands#linkSelected() -> boolean
	*
	*  Check if current selection is link.
	**/
	function linkSelected()
	{
		var node = WIN.getSelection().getNode();
		return node instanceof Element
					? $(node).is('a')
					: ( node ? node : FALSE );
	}

	/**
	* DEPRECATED 
	* WysiHat.Commands#formatblockSelection(element) -> undefined
	*  - element (String): the type of element you want to wrap your selection
	*    with (like 'h1' or 'p').
	*
	*  Wraps the current selection in a header or paragraph.
	**/
	function formatblockSelection(element)
	{
		this.execCommand('formatblock', FALSE, element);
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
		var
		selection	= WIN.getSelection(),
		$node		= $( selection.getNode() );

		if ( this.orderedListSelected() &&
			 ! $node.is( 'ol li:last-child, ol li:last-child *' ) )
		{
			selection.selectNode( $node.parent(OL) );
		}
		else if ( this.unorderedListSelected() )
		{
			// Toggle list type
			selection.selectNode( $node.parent(UL) );
		}
		this.execCommand('insertorderedlist', FALSE, NULL);
	}

	/**
	*  WysiHat.Commands#insertOrderedList() -> undefined
	*
	*  Alias for WysiHat.Commands#toggleOrderedList
	**/
	function insertOrderedList()
	{
		this.toggleOrderedList();
	}

	/**
	*  WysiHat.Commands#orderedListSelected() -> boolean
	*
	*  Check if current selection is within an ordered list.
	**/
	function orderedListSelected()
	{
		var $el = $( WIN.getSelection().getNode() );
		if ( $el.length )
		{
			return $el.is( '*[contenteditable=""] ol, *[contenteditable=true] ol, ' +
			               '*[contenteditable=""] ol *, *[contenteditable=true] ol *' );
		}
		return FALSE;
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
		var
		selection	= WIN.getSelection(),
		node		= selection.getNode();

		if ( this.unorderedListSelected() &&
			 ! node.is("ul li:last-child, ul li:last-child *") )
		{
			selection.selectNode(node.parent(UL));
		}
		else if ( this.orderedListSelected() )
		{
			// Toggle list type
			selection.selectNode(node.parent(OL));
		}
		this.execCommand('insertunorderedlist', FALSE, NULL);
	}

	/**
	*  WysiHat.Commands#insertUnorderedList() -> undefined
	*
	*  Alias for WysiHat.Commands#toggleUnorderedList()
	**/
	function insertUnorderedList()
	{
		this.toggleUnorderedList();
	}

	/**
	*  WysiHat.Commands#unorderedListSelected() -> boolean
	*
	*  Check if current selection is within an unordered list.
	**/
	function unorderedListSelected()
	{
		var element = WIN.getSelection().getNode();
		if (element)
		{
			return element.is('*[contenteditable=""] ul, *[contenteditable=true] ul, *[contenteditable=""] ul *, *[contenteditable=true] ul *');
		}
		return FALSE;
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
		$(DOC.activeElement).trigger( 'WysiHat-editor:change' );
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
		$(DOC.activeElement).trigger( 'WysiHat-editor:change' );
	}

	/**
	*  WysiHat.Commands#blockFormat( tagName ) -> undefined
	*  - tagName (String): block tag to establish
	*
	*  swaps the current block for another block-level tag
	**/
	function changeContentBlock( tagName )
	{
		// <h1>This is a test</h2>
		// <p><img src="http://easy-designs.net/img/logo.png" alt=""/></p>
		
		var
		selection	= WIN.getSelection(),
		editor		= this,
		$editor		= $(editor),
		edit_class	= '.WysiHat-editor',
		replace		= 'WysiHat-replaced',
		blocks		= WysiHat.Element.getContentElements().join(',').replace( ',div,', ',div:not(.WysiHat-editor),' ),
		ranges		= selection.rangeCount,
		range, $from, $to, $els;
		
		while ( ranges-- )
		{
			// get the range
			range	= selection.getRangeAt( ranges );
			
			// find the start and end of the range
			$from	= $( range.startContainer ).closest( blocks );
			$to		= $( range.endContainer ).closest( blocks );
			$els	= $from;
			
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

			// update as necessary
			$els.each(function(){
					editor.replaceElement( $(this), tagName );
				 })
				.data( replace, TRUE );
			
		}
		// cleanup
		$editor
			.children( tagName )
				.each(function(){
					$(this).removeData( replace );
				 });

		$(DOC.activeElement).trigger( 'WysiHat-editor:change' );
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
		if ( $el.is('.WysiHat-editor') )
		{
			return;
		}
		console.log( 'converting', $el, 'to', tagName );
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
	*  WysiHat.Commands#stripFormattingElements() -> undefined
	*
	*  Removes any elements classified as formatting elements
	**/
	function stripFormattingElements()
	{
		// sample: <h1><del><del>This is <em>a</em> test</del></del></h1>
		var
		selection	= WIN.getSelection(),
		isFormatter	= WysiHat.Element.isFormatter,
		ranges		= selection.rangeCount,
		range, $el, el, text, frag;

		while ( ranges-- )
		{
			range	= selection.getRangeAt( ranges );
			$el		= $( range.commonAncestorContainer );
			el		= $el.get(0);
			
			// make sure we're in an element, not a text node
			if ( el.nodeType == 3 )
			{
				$el = $el.parent();
			}
			
			// check to see that we're as high up in the DOM as we need to be
			if ( isFormatter( $el ) )
			{
				if ( range.startOffset === 0 &&
					 el.firstChild == range.startContainer &&
					 el.lastChild == range.endContainer &&
					 range.endOffset === el.lastChild.length )
				{
					text = $el.text();
					if ( $el.parent().text() == text &&
					 	 isFormatter( $el.parent() ) )
					{
						do {
							$el = $el.parent();
						} while ( $el.text() == text &&
						 		  isFormatter( $el ) )
					}
				}
			}
			
			// don't adjust the editor
			$el.find('*')
				.andSelf()
				.not('.WysiHat-editor')
				.each(function(){
					var $this = $(this);
					if ( isFormatter( $this ) )
					{
						$this.replaceWith( $this.html() );
					}
				});
		}

		$(DOC.activeElement).trigger( 'WysiHat-editor:change' );
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
	function queryCommandState(state) {
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
	
	return {
		boldSelection:				boldSelection,
		boldSelected:				boldSelected,
		underlineSelection:			underlineSelection,
		underlineSelected:			underlineSelected,
		italicSelection:			italicSelection,
		italicSelected:				italicSelected,
		strikethroughSelection:		strikethroughSelection,
		indentSelection:			indentSelection,
		outdentSelection:			outdentSelection,
		toggleIndentation:			toggleIndentation,
		indentSelected:				indentSelected,
		fontSelection:				fontSelection,
		fontSizeSelection:			fontSizeSelection,
		colorSelection:				colorSelection,
		backgroundColorSelection:	backgroundColorSelection,
		alignSelection:				alignSelection,
		alignSelected:				alignSelected,
		linkSelection:				linkSelection,
		unlinkSelection:			unlinkSelection,
		linkSelected:				linkSelected,
		toggleOrderedList:			toggleOrderedList,
		insertOrderedList:			insertOrderedList,
		orderedListSelected:		orderedListSelected,
		toggleUnorderedList:		toggleUnorderedList,
		insertUnorderedList:		insertUnorderedList,
		unorderedListSelected:		unorderedListSelected,
		insertImage:				insertImage,
		insertHTML:					insertHTML,
		wrapHTML:					wrapHTML,
		changeContentBlock:			changeContentBlock,
		unformatContentBlock:		unformatContentBlock,
		replaceElement:				replaceElement,
		stripFormattingElements:	stripFormattingElements,
		execCommand:				execCommand,
		queryCommandState:			queryCommandState,
		getSelectedStyles:			getSelectedStyles,

		commands: {},

		queryCommands: {
			link:			linkSelected,
			orderedlist:	orderedListSelected,
			unorderedlist:	unorderedListSelected
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
