//= require "ierange"
//= require "range"

// WebKit does not have a public Selection prototype
if ( typeof Selection == 'undefined' )
{
	var Selection = {};
	Selection.prototype = window.getSelection().__proto__;
}

(function( DOC, $ ){
	
	if ( $.browser.msie )
	{
		
		// TODO: More robust getNode
		function getNode()
		{
			var range = this._document.selection.createRange();
			return $(range.parentElement());
		}

		// TODO: IE selectNode should work with range.selectNode
		function selectNode(element)
		{
			var range = this._document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		}

	}
	else
	{

		function getNode()
		{
			return ( this.rangeCount > 0 ) ? this.getRangeAt(0).getNode() : null;
		}

		function selectNode(element)
		{
			var range = document.createRange();
			range.selectNode(element[0]);
			this.removeAllRanges();
			this.addRange(range);
		}

	}
	
	$.extend(Selection.prototype, {
		getNode:    getNode,
		selectNode: selectNode
	});
	
})( document, jQuery );