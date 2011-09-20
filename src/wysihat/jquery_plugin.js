// Set wysihat as a jQuery plugin
jQuery.fn.wysihat = function(options) {
	options = jQuery.extend({
		buttons: WysiHat.Toolbar.ButtonSets.Standard
	}, options);

	return this.each(function(){
		var
		editor	= WysiHat.Editor.attach( jQuery(this) ),
		toolbar	= new WysiHat.Toolbar(editor);
		toolbar.initialize(editor);
		toolbar.addButtonSet(options);
	});
};