//= require "./selection"

(function( DOC, $ ){

	if ( $.browser.msie )
	{

		function setBookmark()
		{
			var
			$bookmark	= $('#WysiHat-bookmark'),
			$parent		= $('<div/>'),
			range		= this._document.selection.createRange();

			if ( $bookmark.length > 0 )
			{
				$bookmark.remove();
			}

			$bookmark = $( '<span id="WysiHat-bookmark">&nbsp;</span>' )
							.appendTo( $parent );

			range.collapse();
			range.pasteHTML( $parent.html() );
		}

		function moveToBookmark(element)
		{
			var
			$bookmark	= $('#WysiHat-bookmark'),
			range		= this._document.selection.createRange();

			if ( $bookmark.length > 0 )
			{
				$bookmark.remove();
			}

			range.moveToElementText( $bookmark.get(0) );
			range.collapse();
			range.select();

			$bookmark.remove();
		}
	
	}
	else
	{

		function setBookmark()
		{
			var $bookmark	= $('#WysiHat-bookmark');

			if ( $bookmark.length > 0 )
			{
				$bookmark.remove();
			}

			$bookmark = $( '<span id="WysiHat-bookmark">&nbsp;</span>' );

			this.getRangeAt(0).insertNode( $bookmark.get(0) );
		}

		function moveToBookmark(element)
		{
			var
			$bookmark	= $('#WysiHat-bookmark'),
			range		= DOC.createRange();

			if ( $bookmark.length > 0 )
			{
				$bookmark.remove();
			}

			range.setStartBefore( $bookmark.get(0) );
			this.removeAllRanges();
			this.addRange(range);

			$bookmark.remove();
		}
			
	}
	
	$.extend( Selection.prototype, {
		setBookmark:    setBookmark,
		moveToBookmark: moveToBookmark
	});

})(document,jQuery);