(function($){

	$(document).ready(function(){

		function fieldChangeHandler( e )
		{
			var
			$element	= $(this),
			value;

			element		= $element.get(0);

			if ( $element.attr('contentEditable') &&
			 	 $element.attr('contentEditable') !== 'false' )
			{
				value = $element.html();
			}
			else if ( $element.is('input,textarea') )
			{
				value = $element.val();
			}

			if ( value &&
				 element.previousValue != value )
			{
				$element.trigger('field:change');
				element.previousValue = value;
			}
		}

		$('body').delegate('input,textarea,*[contenteditable=""],*[contenteditable=true]', 'keyup', fieldChangeHandler );
		
	});
	
})(jQuery);
