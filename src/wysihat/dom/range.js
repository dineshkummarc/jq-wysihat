//= require "ierange"

jQuery.extend(Range.prototype, (function(){
	
	function beforeRange(range)
	{
		if ( ! range ||
			 ! range.compareBoundaryPoints )
		{
			return false;
		}
		return ( this.compareBoundaryPoints( this.START_TO_START, range ) == -1 &&
				 this.compareBoundaryPoints( this.START_TO_END, range ) == -1 &&
				 this.compareBoundaryPoints( this.END_TO_END, range ) == -1 &&
				 this.compareBoundaryPoints( this.END_TO_START, range ) == -1 );
	}

	function afterRange(range)
	{
		if ( ! range ||
			 ! range.compareBoundaryPoints )
		{
			return false;
		}
		return ( this.compareBoundaryPoints( this.START_TO_START, range ) == 1 &&
				 this.compareBoundaryPoints( this.START_TO_END, range ) == 1 &&
				 this.compareBoundaryPoints( this.END_TO_END, range ) == 1 &&
				 this.compareBoundaryPoints( this.END_TO_START, range ) == 1 );
	}

	function betweenRange(range)
	{
		if ( ! range ||
			 ! range.compareBoundaryPoints )
		{
			return false;
		}
		return ! ( this.beforeRange(range) || this.afterRange(range) );
	}

	function equalRange(range)
	{
		if ( ! range ||
			 ! range.compareBoundaryPoints )
		{
			return false;
		}
		return ( this.compareBoundaryPoints( this.START_TO_START, range ) == 0 &&
				 this.compareBoundaryPoints( this.START_TO_END, range ) == 1 &&
				 this.compareBoundaryPoints( this.END_TO_END, range ) == 0 &&
				 this.compareBoundaryPoints( this.END_TO_START, range ) == -1 );
	}

	function getNode()
	{
		var
		parent	= this.commonAncestorContainer,
		that	= this,
		child;

		while (parent.nodeType == Node.TEXT_NODE)
		{
			parent = parent.parentNode;
		}
		
		jQuery(parent).children().each(function(){
			var range = document.createRange();
			range.selectNodeContents(this);
			child = that.betweenRange(range);
		});

		return $(child || parent).get(0);
	}

	return {
		beforeRange:  beforeRange,
		afterRange:   afterRange,
		betweenRange: betweenRange,
		equalRange:   equalRange,
		getNode:      getNode
	};
	
})());
