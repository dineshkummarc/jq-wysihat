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
	
	function isRoot( $el )
	{
		return is( $el, roots );
	}
	function isSection( $el )
	{
		return is( $el, sections );
	}
	function isContainer( $el )
	{
		return is( $el, containers  );
	}
	function isSubContainer( $el )
	{
		return is( $el, sub_containers  );
	}
	function isBlock( $el )
	{
		return is( $el, content, sub_containers, containers, sections, roots );
	}
	function isContent( $el )
	{
		return is( $el, content, sub_containers );
	}
	function isMedia( $el )
	{
		return is( $el, media );
	}
	function isPhrase( $el )
	{
		return is( $el, phrases );
	}
	function isFormatter( $el )
	{
		return is( $el, formatting );
	}
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