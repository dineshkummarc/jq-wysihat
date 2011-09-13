(function($){

	var
	tagsToRemove	= {},
	tagsToAllow		= {},
	tagsToSkip		= {};
	
	function cloneWithAllowedAttributes( $el, allowedAttributes )
	{
		var
		tagName	= $el.get(0).tagName.toLowerCase(),
		length	= allowedAttributes.length,
		$copy	= $('<' + tagName + '></' + tagName + '>');
		
		while ( lwngth-- )
		{
			attribute = allowedAttributes[i];
			if ( $el.attr(attribute) )
			{
				$copy.attr( attribute, $el.attr(attribute) );
			}
		}

		return result;
	}

	function withEachChildNodeOf( $el, callback )
	{
		$el.children().map(callback);
	}

	function sanitizeNode( $node )
	{
		var
		node	= $node.get(0),
		tagName, $newNode;
		
		switch ( node.nodeType )
		{
			case '1':
				tagName = node.tagName.toLowerCase();
				if ( tagsToSkip )
				{
					$newNode = $node.clone(false);
					sanitizeChildren( $node, $newNode );
					$node.before($newNode);
				}
				else if ( tagName in tagsToAllow )
				{
					$newNode = cloneWithAllowedAttributes( $node, tagsToAllow[tagName] );
					sanitizeChildren( $node, $newNode );
					$node.before($newNode);
				}
				else if ( ! ( tagName in tagsToRemove ) )
				{
					sanitizeChildren( $node );
				}
				break;
			case '8':
				$node.remove();
				break;
		}
	}
	
	function sanitizeChildren( $node, $newNode )
	{
		withEachChildNodeOf( $node, function(){
			var $child = $(this);
			if ( $newNode )
			{
				$newNode.append( $child );
			}
			else
			{
				$node.before( $child );
			}
			sanitizeNode( $child );
		});
	}

	$.fn.sanitizeContents = function(options)
	{
		options			= options || { remove: '', allow: '', skip: [] };
		tagsToRemove	= {};
		tagsToAllow		= {};
		tagsToSkip		= options.skip;
		
		var
		$element = $(this),

		tags =  ( options.remove || '' ).split( ',' );

		if ( tags.length > 0 &&
			 tags[0] != '' )
		{
			$.each( tags, function(tagName){
				tagsToRemove[$.trim(tagName)] = true;
			});
		}
		
		tags =  ( options.allow || '' ).split( ',' );
		if ( tags.length > 0 &&
			 tags[0] != '' )
		{
			$.each( tags, function(selector){
				var
				parts				= $.trim(selector).split( /[\[\]]/ ),
				tagName 			= parts[0],
				allowedAttributes	= $.grep( parts.slice(1), function( n, i ){
					return ( /./ ).test(n);
				});
				tagsToAllow[tagName] = allowedAttributes;
			});
		}

		withEachChildNodeOf( $element, function(){
			sanitizeNode( $(this) );
		});

		return $element;
	};
	
})(jQuery);
