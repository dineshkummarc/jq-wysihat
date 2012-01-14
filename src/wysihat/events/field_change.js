(function($){

	$(document).ready(function(){

		function fieldChangeHandler( e )
		{
			var
			$element	= $(this),
			element		= $element.get(0),
			val, evt;
			
			if ( $element.is('*[contenteditable=""],*[contenteditable=true]') )
			{
				val	= $element.html();
				evt	= 'editor:change';
			}
			else
			{
				val	= $element.val();
				evt	= 'field:change';
			}
			
			if ( val &&
				 element.previousValue != val )
			{
				$element.trigger( 'WysiHat-' + evt );
				element.previousValue = val;
			}
		}

		$('body')
			.delegate('input,textarea,*[contenteditable],*[contenteditable=true]', 'keydown', fieldChangeHandler )
			.delegate('.WysiHat-editor', 'input paste', function(){
				WysiHat.Formatting.cleanup( $(this) );
			});
		
	});
	
})(jQuery);
