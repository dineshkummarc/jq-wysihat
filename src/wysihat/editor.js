/** section: wysihat
 * WysiHat.Editor
 **/
(function($){
	
	var
	WYSIHAT 	= WysiHat.name,
	EDITOR		= '-editor',
	FIELD		= '-field',
	CHANGE		= ':change',
	CLASS		= WYSIHAT + EDITOR,
	ID			= 'id',
	E_EVT		= CLASS + CHANGE,
	F_EVT		= WYSIHAT + FIELD + CHANGE,
	IMMEDIATE	= ':immediate',
	
	INDEX		= 0,
	NULL		= null,
	EMPTY		= '';
	
	WysiHat.Editor = {
		
		/** section: WysiHat
		 *  WysiHat.Editor.attach($field) -> undefined
		 *  - $field (jQuery): a jQuery wrapped field that you want to convert 
		 * to a rich-text field.
		 *
		 *  Creates a new editor for the textarea.
		**/
		attach: function( $field )
		{
			
			var
			t_id	= $field.attr( ID ),
			e_id	= ( t_id != EMPTY ? t_id : WYSIHAT + INDEX++ ) + EDITOR,
			fTimer	= NULL,
			eTimer	= NULL,
			$editor	= $( '#' + e_id );
			
			if ( t_id == EMPTY )
			{
				t_id = e_id.replace( EDITOR, FIELD );
				$field.attr( ID, t_id );
			}
		
			if ( $editor.length )
			{
				if ( ! $editor.hasClass( CLASS ) )
				{
					$editor.addClass( CLASS );
				}
				return $editor;
			}
			else
			{
				$editor = $('<div id="' + e_id + '" class="' + CLASS + '" contentEditable="true" role="application"></div>')
									.html( WysiHat.Formatting.getBrowserMarkupFrom( $field ) )
									.data( 'field', $field );

				$.extend( $editor, WysiHat.Commands );

				$field
					.data( 'editor', $editor )
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
						$editor
							.bind( E_EVT, function(){
								if ( this.eTimer )
								{
									clearTimeout( this.eTimer );
								}
								this.eTimer = setTimeout(updateField, 500 );
							 })
							.bind( E_EVT + IMMEDIATE, updateField )
					 );

				function updateField()
				{
					$field.val( WysiHat.Formatting.getApplicationMarkupFrom( $editor ) );
					this.fTimer = null;
				}
				function updateEditor()
				{
					$editor.html( WysiHat.Formatting.getBrowserMarkupFrom( $field ) );
					this.eTimer = null;
				}
			}

			//WysiHat.BrowserFeatures.run();
			
			return $editor;
		}
	};
	
})(jQuery);