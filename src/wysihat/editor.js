/** section: wysihat
 * WysiHat.Editor
 **/
(function($){
	
	var
	WYSIHAT 	= WysiHat.name,
	EDITOR		= '-editor',
	CLASS		= WYSIHAT + EDITOR,
	ID			= 'id',
	E_EVT		= WYSIHAT + '-editor:change',
	F_EVT		= WYSIHAT + '-field:change',
	IMMEDIATE	= ':immediate',
	
	INDEX		= 0,
	NULL		= null,
	EMPTY		= '';
	
	WysiHat.Editor = {
		/** section: WysiHat
		 *  WysiHat.Editor.attach(textarea) -> undefined
		 *  - $textarea (jQuery): a jQuery wrapped textarea that you want to convert 
		 * to a rich-text field.
		 *
		 *  Creates a new editor for the textarea.
		**/
		attach: function($textarea)
		{
			var
			t_id = $textarea.attr( ID ),
			e_id = ( t_id != EMPTY ? t_id : WYSIHAT + INDEX++ ) + EDITOR,
			$editArea = $( '#' + e_id ),
			fTimer = NULL,
			eTimer = NULL;
			
			if ( t_id == EMPTY )
			{
				t_id = e_id.replace( EDITOR );
				$textarea.attr( ID, t_id );
			}
		
			if ( $editArea.length )
			{
				if ( ! $editArea.hasClass( CLASS ) )
				{
					$editArea.addClass( CLASS );
				}
				return $editArea;
			}
			
			$editArea = $('<div id="' + e_id + '" class="' + CLASS + '" contentEditable="true"></div>')
							.html( WysiHat.Formatting.getBrowserMarkupFrom( $textarea ) );
							
			//console.log($editArea);

			$.extend($editArea, WysiHat.Commands);

			//console.log($editArea);

			$textarea
				.bind( F_EVT, function(){
					if ( this.fTimer )
					{
						clearTimeout( this.fTimer );
					}
					this.fTimer = setTimeout(updateEditor, 500 );
				 })
				.bind( F_EVT + IMMEDIATE, updateEditor )
				.hide()
				.before(
					$editArea
						.bind( E_EVT, function(){
							if ( this.eTimer )
							{
								clearTimeout( this.eTimer );
							}
							this.eTimer = setTimeout(updateField, 500 );
						 })
						.bind( E_EVT + IMMEDIATE, updateField )
				 );

			//WysiHat.BrowserFeatures.run();
			
			function updateField()
			{
				$textarea.val( WysiHat.Formatting.getApplicationMarkupFrom( $editArea ) );
				this.fTimer = null;
			}
			function updateEditor()
			{
				$editArea.html( WysiHat.Formatting.getBrowserMarkupFrom( $textarea ) );
				this.eTimer = null;
			}
			
			return $editArea;
		}
	};
	
})(jQuery);