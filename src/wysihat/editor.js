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
			$editArea,
			id = ( $textarea.attr('id') != '' ? $textarea.attr('id') : this.id + this.id_i++ ) + '_editor';
		
			if ( $editArea == $('#' + id) )
			{
				return $editArea;
			}

			$editArea = $('<div id="' + id + '" class="editor" contentEditable="true"></div>');

			$editArea.html(WysiHat.Formatting.getBrowserMarkupFrom($textarea.val()));

			$.extend($editArea, WysiHat.Commands);

			$textarea.before($editArea);
			$textarea.hide();

			WysiHat.BrowserFeatures.run();

			return $editArea;
		}
	};
	
})(jQuery);