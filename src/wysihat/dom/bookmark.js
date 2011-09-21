//= require "./selection"

(function( DOC, $ ){

	if ( $.browser.msie )
	{

		Selection.prototype.setBookmark = function()
		{
			var
			$bookmark	= $('#wysihat-bookmark'),
			$parent		= $('<div/>'),
			range		= this._document.selection.createRange();
			
			if ( $bookmark.length > 0 )
			{
				$bookmark.remove();
			}
			
			$bookmark = $( '<span id="wysihat-bookmark">&nbsp;</span>' )
							.appendTo( $parent );
			
			range.collapse();
			range.pasteHTML( $parent.html() );
	    };
		Selection.prototype.moveToBookmark = function()
		{
			var
			$bookmark	= $('#wysihat-bookmark'),
			range		= this._document.selection.createRange();
			
			if ( $bookmark.length > 0 )
			{
				$bookmark.remove();
			}
			
			range.moveToElementText( $bookmark.get(0) );
			range.collapse();
			range.select();
			
			$bookmark.remove();
	    };
	
	}
	else
	{

		Selection.prototype.setBookmark = function()
		{
			var $bookmark	= $('#wysihat-bookmark');
			
			if ( $bookmark.length > 0 )
			{
				$bookmark.remove();
			}
			
			$bookmark = $( '<span id="wysihat-bookmark">&nbsp;</span>' );
			
			this.getRangeAt(0).insertNode( $bookmark.get(0) );
	    };
		Selection.prototype.moveToBookmark = function()
		{
			var
			$bookmark	= $('#wysihat-bookmark'),
			range		= DOC.createRange();
			
			if ( $bookmark.length > 0 )
			{
				$bookmark.remove();
			}
			
			range.setStartBefore( $bookmark.get(0) );
			this.removeAllRanges();
			this.addRange(range);
			
			$bookmark.remove();
	    };

	}

})(document,jQuery);