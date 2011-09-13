(function($){

	$(document).ready(function(){

		function fieldChangeHandler(event, element)
		{
			var
			$element	= $(element),
			value;

			element		= $element.get(0);

			if ( $element.attr('contentEditable') === 'true' )
			{
				value = $element.html();
			}
			value = $element.val();

			if ( value && element.previousValue != value )
			{
				$element.trigger("field:change");
				element.previousValue = value;
			}
		}

		$('input,textarea,*[contenteditable=""],*[contenteditable=true]').keyup(fieldChangeHandler);
	});
	
})(jQuery);
