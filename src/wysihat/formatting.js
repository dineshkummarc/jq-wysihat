WysiHat.Formatting = (function($){

	var
	ACCUMULATING_LINE      = {},
	EXPECTING_LIST_ITEM    = {},
	ACCUMULATING_LIST_ITEM = {};

	return {
		getBrowserMarkupFrom: function( $el )
		{

			var $container = $('<div>' + $el.val() + '</div>');

			function spanify( $element, style )
			{
				$element.replaceWith(
					'<span style="' + style + '" class="Apple-style-span">' + $element.html() + '</span>'
				);
			}

			function convertStrongsToSpans()
			{
				$container.find( 'strong' ).each(function(){
					spanify( $(this), 'font-weight: bold' );
				});
			}

			function convertEmsToSpans()
			{
				$container.find( 'em' ).each(function(){
					spanify( $(this), 'font-style: italic' );
				});
			}

			function convertDivsToParagraphs()
			{
				$container.find( 'div' ).each(function(){
					var $this = $(this);
					$this.replaceWith('<p>' + $this.html() + '</p>');
				});
			}

			if ( $.browser.webkit || $.browser.mozilla )
			{
				convertStrongsToSpans();
				convertEmsToSpans();
			}
			else if ( $.browser.msie || $.browser.opera )
			{
				convertDivsToParagraphs();
			}

			return $container.html();

		},

		getApplicationMarkupFrom: function( $el )
		{
			var
			mode = ACCUMULATING_LINE,
			$result, $container,
			$line, $lineContainer,
			previousAccumulation;

			function walk( nodes )
			{
				var
				editor	= $el.get(0),
				length	= nodes.length,
				$p		= $('<p></p>'),
				node, $newNode, tagName, i;

		        for ( i=0; i < length; i++ )
				{
					node = nodes[i];
					
					// stray text
					if ( node.nodeType == Node.TEXT_NODE &&
						 node.parentNode == editor )
					{
						$newNode = $p.clone().text(node.nodeValue);
						$(node).replaceWith( $newNode );
						node = $newNode.get();
					}

					if ( node.nodeType == Node.ELEMENT_NODE )
					{
						tagName = node.tagName.toLowerCase();
						open( tagName, node );
						walk( node.childNodes );
						close( tagName );

					}
					else if ( node.nodeType == Node.TEXT_NODE )
					{
						read( node.nodeValue );
					}
		        }
			}

			function open( tagName, node )
			{
				$node = $(node);

				if ( mode == ACCUMULATING_LINE )
				{
					if ( isBlockElement(tagName) )
					{
						if ( isEmptyParagraph( $node ) )
						{
							accumulate( $('<br />') );
							flush();
						}

						if ( isListElement(tagName) )
						{
							$container	= insertList( tagName );
							mode		= EXPECTING_LIST_ITEM;
						}
					}
					else if ( isLineBreak(tagName) )
					{
						if ( isLineBreak( getPreviouslyAccumulatedTagName() ) )
						{
							$(previousAccumulation).remove();
							flush();
						}

						accumulate( $node.clone(false) );

						if ( ! previousAccumulation.previousNode )
						{
							flush();
						}
					}
					else
					{
						accumulateInlineElement( tagName, $node );
					}

				}
				else if ( mode == EXPECTING_LIST_ITEM )
				{
					if ( isListItemElement(tagName) )
					{
						mode = ACCUMULATING_LIST_ITEM;
					}

				}
				else if ( mode == ACCUMULATING_LIST_ITEM )
				{
					if ( isLineBreak(tagName) )
					{
						accumulate( $node.clone(false) );
					}
					else if ( ! isBlockElement(tagName) )
					{
						accumulateInlineElement( tagName, node );
					}
				}
			}

			function close( tagName )
			{
				if ( mode == ACCUMULATING_LINE )
				{
					if ( isLineElement( tagName ) )
					{
						flush();
					}

					if ( $line != $lineContainer )
					{
						$lineContainer = $lineContainer.parent();
					}
				}
				else if ( mode == EXPECTING_LIST_ITEM )
				{
					if ( isListElement(tagName) )
					{
						$container = $result;
						mode = ACCUMULATING_LINE;
					}
				}
				else if ( mode == ACCUMULATING_LIST_ITEM )
				{
					if ( isListItemElement(tagName) )
					{
						flush();
						mode = EXPECTING_LIST_ITEM;
					}

					if ( $line != $lineContainer )
					{
						$lineContainer = $lineContainer.parent();
					}
				}
			}

			function isBlockElement( tagName )
			{
				return isLineElement(tagName) || isListElement(tagName);
			}

			function isLineElement( tagName )
			{
				return tagName == "p" || tagName == "div";
			}

			function isListElement( tagName )
			{
				return tagName == "ol" || tagName == "ul";
			}

			function isListItemElement(tagName)
			{
				return tagName == "li";
			}

			function isLineBreak(tagName)
			{
				return tagName == "br";
			}

			function isEmptyParagraph( $node )
			{
				return $node.is('p') && $node.html() == '';
			}

			function read(value)
			{
				accumulate($(document.createTextNode(value)));
			}

			function accumulateInlineElement( tagName, $node )
			{
				var $element = $node.clone(false);

				if ( tagName == "span" )
				{
					if ( $node.css( 'fontWeight' ) == 'bold' )
					{
						$element = $('<strong></strong>');
					}
					else if ( $node.css('fontStyle') == 'italic' )
					{
						$element = $("<em></em>");
					}
				}

				accumulate( $element );
				$lineContainer = $element;
			}

			function accumulate( $node )
			{
				if ( mode != EXPECTING_LIST_ITEM )
				{
					if ( ! $line )
					{
						$line = $lineContainer = createLine();
					}
					previousAccumulation = $node.get(0);
					$lineContainer.append( $node );
				}
			}

			function getPreviouslyAccumulatedTagName()
			{
				if ( previousAccumulation &&
					 previousAccumulation.nodeType == Node.ELEMENT_NODE )
				{
					return previousAccumulation.tagName.toLowerCase();
				}
			}

			function flush()
			{
				if ( $line &&
					 $line.contents().length )
				{
					$container.append( $line );
					$line = $lineContainer = null;
				}
			}

			function createLine()
			{
				if ( mode == ACCUMULATING_LINE )
				{
					return $('<p></p>');
				}
				else if (mode == ACCUMULATING_LIST_ITEM)
				{
					return $('<li></li>');
				}
			}

			function insertList(tagName)
			{
				return $('<'+tagName+'></'+tagName+'>')
							.appendTo($result);
			}
			
			function replaceEmptyParagraphs( $el )
			{
				$el.find('p>br:only-child').parent().remove();
				return $el;
			}

			$result = $container = $('<div></div>');
			walk( $el.get(0).childNodes );
			flush();
			replaceEmptyParagraphs( $container );
			return $container.html();
		}
	};

})(jQuery);