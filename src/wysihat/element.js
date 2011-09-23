WysiHat.Element = (function( $ ){
	
	var
	FALSE = false,
	
	roots			= [ 'blockquote', 'details', 'fieldset', 'figure', 'td' ],
	
	sections		= [ 'article', 'aside', 'header', 'footer', 'nav', 'section' ],
	
	containers		= [ 'col', 'colgroup', 'dl', 'menu', 'ol', 'table', 'tbody', 'thead', 'tfoot', 'tr', 'ul' ],
	
	sub_containers	= [ 'command', 'dd', 'dt', 'li', 'td', 'th' ],
	
	content			= [ 'address', 'caption', 'dd', 'div', 'dt', 'figcaption', 'h1', 'h2', 'h3',
						'h4', 'h5', 'h6', 'hgroup', 'hr', 'p', 'pre', 'summary', 'small' ],
	
	media			= [ 'audio', 'canvas', 'embed', 'iframe', 'img', 'object', 'param', 'source', 'track', 'video' ],
	
	phrases			= [ 'a', 'abbr', 'b', 'br', 'cite', 'code', 'del', 'dfn', 'em', 'i', 'ins', 'kbd',
	 					'mark', 'span', 'q', 'samp', 's', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr' ],
	
	formatting		= [ 'b', 'code', 'del', 'em', 'i', 'ins', 'kbd', 'span', 's', 'strong', 'u' ],
	
	forms			= [ 'button', 'datalist', 'fieldset', 'form', 'input', 'keygen', 'label', 
						'legend', 'optgroup', 'option', 'output', 'select', 'textarea' ];
	
	function is( $el )
	{
		var
		i	= arguments.length,
		ret	= FALSE;
		while ( ret == FALSE &&
				i-- > 1 )
		{
			ret	= $el.is( arguments[i].join(',') );
		}
		return ret;
	}
	
	/**
	*  WysiHat.Element#isRoot( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "rooting" types
	**/
	function isRoot( $el )
	{
		return is( $el, roots );
	}
	/**
	*  WysiHat.Element#isSection( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "sectioning" types
	**/
	function isSection( $el )
	{
		return is( $el, sections );
	}
	/**
	*  WysiHat.Element#isContainer( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "container" types that don't hold content
	**/
	function isContainer( $el )
	{
		return is( $el, containers );
	}
	/**
	*  WysiHat.Element#isSubContainer( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "subcontainer" types
	**/
	function isSubContainer( $el )
	{
		return is( $el, sub_containers );
	}
	/**
	*  WysiHat.Element#isBlock( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "block" types
	**/
	function isBlock( $el )
	{
		return is( $el, roots, sections, containers, sub_containers, content );
	}
	/**
	*  WysiHat.Element#isContent( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "content container" types
	**/
	function isContent( $el )
	{
		return is( $el, sub_containers, content );
	}
	/**
	*  WysiHat.Element#isMedia( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "media" types
	**/
	function isMedia( $el )
	{
		return is( $el, media );
	}
	/**
	*  WysiHat.Element#isPhrase( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "phrasing" types
	**/
	function isPhrase( $el )
	{
		return is( $el, phrases );
	}
	/**
	*  WysiHat.Element#isFormatter( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is a formatting element
	**/
	function isFormatter( $el )
	{
		return is( $el, formatting );
	}
	/**
	*  WysiHat.Element#isFormComponent( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the form-related types
	**/
	function isFormComponent( $el )
	{
		return is( $el, forms );
	}
	
	return {
		isRoot:				isRoot,
		isSection:			isSection,
		isContainer:		isContainer,
		isSubContainer:		isSubContainer,
		isBlock:			isBlock,
		isContent:			isContent,
		isMedia:			isMedia,
		isPhrase:			isPhrase,
		isFormatter:		isFormatter,
		isFormComponent:	isFormComponent
	};
	
})( jQuery );