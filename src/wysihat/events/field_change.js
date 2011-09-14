(function($){

	$(document).ready(function(){

		function fieldChangeHandler( e )
		{
			var
			$element	= $(this),
			value;

			element		= $element.get(0);

			if ( $element.is('*[contenteditable=""],*[contenteditable=true]') )
			{
				value = $element.html();
			}
			else
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
