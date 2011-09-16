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
		id:			'Wysihat_',
		id_i:		0,
		attach: function($textarea)
		{
			var
			t_id = $textarea.attr('id'),
			e_id = ( t_id != '' ? $textarea.attr('id') : this.id + this.id_i++ ) + '_editor',
			$editArea = $('#' + e_id),
			fTimer = null,
			eTimer = null;
			
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
					if ( this.fTimer )
					{
						clearTimeout( this.fTimer );
					}
					this.fTimer = setTimeout(updateEditor, 500 );
				 })
				.bind( 'field:change:immediate', updateEditor )
				.hide()
				.before(
					$editArea
						.bind( 'editor:change', function(){
							if ( this.eTimer )
							{
								clearTimeout( this.eTimer );
							}
							this.eTimer = setTimeout(updateField, 500 );
						 })
						.bind( 'editor:change:immediate', updateField )
				 );

			WysiHat.BrowserFeatures.run();
			
			function updateField()
			{
				console.log('updating the field');
				$textarea.val( WysiHat.Formatting.getApplicationMarkupFrom( $editArea ) );
				this.fTimer = null;
			}
			function updateEditor()
			{
				console.log('updating the editor');
				$editArea.html( WysiHat.Formatting.getBrowserMarkupFrom( $textarea ) );
				this.eTimer = null;
			}
			
			return $editArea;
		}
	};
	
})(jQuery);