jQuery(document).ready(function(){
	
	var
	$		= jQuery,
	DOC		= document,
	$doc	= $(DOC),
	previousRange,
	selectionChangeHandler;
	
	// IE
	if ( 'onselectionchange' in DOC &&
		 'selection' in DOC )
	{
		selectionChangeHandler = function()
		{
			var
			range	= DOC.selection.createRange(),
			element	= range.parentElement();
			$(element).trigger( 'WysiHat-selection:change' );
		}

 		$doc.bind( 'selectionchange', selectionChangeHandler );
	}
	else
	{
		selectionChangeHandler = function()
		{
			var
			element        = DOC.activeElement,
			elementTagName = element.tagName.toLowerCase(),
			selection, range;

			if ( elementTagName == 'textarea' ||
				 elementTagName == 'input' )
			{
				previousRange = null;
				$(element).trigger( 'WysiHat-selection:change' );
			}
			else
			{
				selection = window.getSelection();
				if (selection.rangeCount < 1) { return };

				range = selection.getRangeAt(0);
				if ( range && range.equalRange(previousRange) ) { return; }
				
				previousRange	= range;
				element			= range.commonAncestorContainer;
				while (element.nodeType == Node.TEXT_NODE)
				{
					element = element.parentNode;
				}

				$(element).trigger( 'WysiHat-selection:change' );
			}
		};

		$doc.mouseup( selectionChangeHandler );
		$doc.keyup( selectionChangeHandler );
	}

});
