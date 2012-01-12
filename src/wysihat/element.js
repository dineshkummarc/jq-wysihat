WysiHat.Element = (function( $ ){
	
	var
	FALSE = false,
	
	roots			= [ 'blockquote', 'details', 'fieldset', 'figure', 'td' ],
	
	sections		= [ 'article', 'aside', 'header', 'footer', 'nav', 'section' ],
	
	containers		= [ 'col', 'colgroup', 'dl', 'menu', 'ol', 'table', 'tbody', 'thead', 'tfoot', 'tr', 'ul' ],
	
	sub_containers	= [ 'command', 'dd', 'dt', 'li', 'td', 'th' ],
	
	content			= [ 'address', 'caption', 'dd', 'div', 'dt', 'figcaption', 'figure', 'h1', 'h2', 'h3',
						'h4', 'h5', 'h6', 'hgroup', 'hr', 'p', 'pre', 'summary', 'small' ],
	
	media			= [ 'audio', 'canvas', 'embed', 'iframe', 'img', 'object', 'param', 'source', 'track', 'video' ],
	
	phrases			= [ 'a', 'abbr', 'b', 'br', 'cite', 'code', 'del', 'dfn', 'em', 'i', 'ins', 'kbd',
	 					'mark', 'span', 'q', 'samp', 's', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr' ],
	
	formatting		= [ 'b', 'code', 'del', 'em', 'i', 'ins', 'kbd', 'span', 's', 'strong', 'u' ],
	
	html4_blocks	= [ 'address', 'blockquote', 'div', 'dd', 'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre' ],
	
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
	*  WysiHat.Element#isHTML4Block( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the HTML4 block formatting types
	**/
	function isHTML4Block( $el )
	{
		return is( $el, html4_blocks );
	}
	/**
	*  WysiHat.Element#isContentElement( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "content container" types
	**/
	function isContentElement( $el )
	{
		return is( $el, sub_containers, content );
	}
	/**
	*  WysiHat.Element#isMediaElement( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "media" types
	**/
	function isMediaElement( $el )
	{
		return is( $el, media );
	}
	/**
	*  WysiHat.Element#isPhraseElement( $el ) -> boolean
	*  - $el (jQuery Object): $element to be tested
	*
	*  Checks to see if the element is one of the "phrasing" types
	**/
	function isPhraseElement( $el )
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
	
	/**
	*  WysiHat.Element#getRoots() -> array
	*
	*  Returns an array of "rooting" element names
	**/
	function getRoots()
	{
		return roots;
	}
	/**
	*  WysiHat.Element#getSections() -> array
	*
	*  Returns an array of sectioning element names
	**/
	function getSections( $el )
	{
		return sections;
	}
	/**
	*  WysiHat.Element#getContainers() -> array
	*
	*  Returns an array of "container" element names
	**/
	function getContainers()
	{
		return containers;
	}
	/**
	*  WysiHat.Element#getSubContainers() -> array
	*
	*  Returns an array of "subcontainer" element names
	**/
	function getSubContainers()
	{
		return sub_containers;
	}
	/**
	*  WysiHat.Element#getBlocks() -> array
	*
	*  Returns an array of "block" element names
	**/
	function getBlocks()
	{
		return roots.concat( sections, containers, sub_containers, content );
	}
	/**
	*  WysiHat.Element#getHTML4Blocks() -> array
	*
	*  Returns an array of the HTML4 block formatting names
	**/
	function getHTML4Blocks()
	{
		return html4_blocks;
	}
	/**
	*  WysiHat.Element#getContentElements() -> array
	*
	*  Returns an array of content element names
	**/
	function getContentElements()
	{
		return sub_containers.concat(  content );
	}
	/**
	*  WysiHat.Element#getMediaElements() -> array
	*
	*  Returns an array of "media" type element names
	**/
	function getMediaElements()
	{
		return media;
	}
	/**
	*  WysiHat.Element#getPhraseElements() -> array
	*
	*  Returns an array of "phrasing" element names
	**/
	function getPhraseElements()
	{
		return phrases;
	}
	/**
	*  WysiHat.Element#getFormatters() -> array
	*
	*  Returns an array of formatting element names
	**/
	function getFormatters()
	{
		return formatting;
	}
	/**
	*  WysiHat.Element#getFormComponents() -> array
	*
	*  Returns an array of form-related element names
	**/
	function getFormComponents()
	{
		return forms;
	}

	return {
		isRoot:				isRoot,
		isSection:			isSection,
		isContainer:		isContainer,
		isSubContainer:		isSubContainer,
		isBlock:			isBlock,
		isHTML4Block:		isHTML4Block,
		isContentElement:	isContentElement,
		isMediaElement:		isMediaElement,
		isPhraseElement:	isPhraseElement,
		isFormatter:		isFormatter,
		isFormComponent:	isFormComponent,
		getRoots:			getRoots,
		getSections:		getSections,
		getContainers:		getContainers,
		getSubContainers:	getSubContainers,
		getBlocks:			getBlocks,
		getHTML4Blocks:		getHTML4Blocks,
		getContentElements:	getContentElements,
		getMediaElements:	getMediaElements,
		getPhraseElements:	getPhraseElements,
		getFormatters:		getFormatters,
		getFormComponents:	getFormComponents
	};
	
})( jQuery );