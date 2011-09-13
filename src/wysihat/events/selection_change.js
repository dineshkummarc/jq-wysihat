jQuery(document).ready(function(){
	
	var
	$		= jQuery,
	$doc	= $(document),
	previousRange,
	selectionChangeHandler;
	
	if ( 'onselectionchange' in document &&
		 'selection' in document )
	{
		selectionChangeHandler = function()
		{
			var
			range	= document.selection.createRange(),
			element	= range.parentElement();
			$(element).trigger("selection:change");
		}

 		$doc.bind("selectionchange", selectionChangeHandler);
	}
	else
	{
		selectionChangeHandler = function() {
			var
			element        = document.activeElement,
			elementTagName = element.tagName.toLowerCase(),
			selection, range;

			if (elementTagName == "textarea" || elementTagName == "input")
			{
				previousRange = null;
				$(element).trigger("selection:change");
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

				$(element).trigger("selection:change");
			}
		};

		$doc.mouseup(selectionChangeHandler);
		$doc.keyup(selectionChangeHandler);
	}

});
