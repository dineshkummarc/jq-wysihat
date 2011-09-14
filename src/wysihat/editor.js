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
		sync:	false,
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
				.bind( 'field:change', function(){
					$editArea.html( WysiHat.Formatting.getBrowserMarkupFrom( $textarea ) );
				 })
				.hide()
				.before(
					$editArea.bind( 'editor:change', function(){
						$textarea.val( WysiHat.Formatting.getApplicationMarkupFrom( $editArea ) );
					})
				 );

			WysiHat.BrowserFeatures.run();

			return $editArea;
		}
	};
	
})(jQuery);