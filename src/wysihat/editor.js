/** section: wysihat
 * WysiHat.Editor
 **/
(function($){

	WysiHat.Editor = {
		/** section: wysihat
		 *  WysiHat.Editor.attach(textarea) -> undefined
		 *  - $textarea (jQuery): a jQuery wrapped textarea that you want to convert 
		 * to a rich-text field.
		 *
		 *  Creates a new editor for the textarea.
		**/
		id:		'Wysihat_',
		id_i:	0,
		attach: function($textarea)
		{
			var
			t_id = $textarea.attr('id'),
			e_id = ( t_id != '' ? $textarea.attr('id') : this.id + this.id_i++ ) + '_editor',
			$editArea = $('#' + e_id);
			
			if ( t_id == '' )
			{
				t_id = e_id.replace('_editor');
				$textarea.attr('id',t_id);
			}
		
			if ( $editArea.length )
			{
				if ( ! $editArea.hasClass('editor') )
				{
					$editArea.addClass('editor');
				}
				return $editArea;
			}
			
			$editArea = $('<div id="' + e_id + '" class="editor" contentEditable="true"></div>')
							.html( WysiHat.Formatting.getBrowserMarkupFrom( $textarea ) );
							
			//console.log($editArea);

			$.extend($editArea, WysiHat.Commands);

			//console.log($editArea);

			$textarea
				.bind( 'field:change', syncValues )
				.hide()
				.before(
					$editArea.bind( 'field:change', syncValues )
				 );
				
			function syncValues( e )
			{
				var $el = $(this);

				if ( $el.is('div.editor') )
				{
					$textarea.val( WysiHat.Formatting.getApplicationMarkupFrom( $editArea ) );
				}
				else if ( $el.attr('id') == t_id )
				{
					$editArea.html( WysiHat.Formatting.getBrowserMarkupFrom( $textarea ) );
				}
			}

			WysiHat.BrowserFeatures.run();

			return $editArea;
		}
	};
	
})(jQuery);