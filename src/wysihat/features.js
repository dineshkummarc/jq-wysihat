WysiHat.BrowserFeatures = (function($){
	
	var features = {};

	function createTmpIframe(callback)
	{
	    var
		frameDocument,
	    $frame	= $('<iframe></iframe>'),
		frame	= $frame.get(0);
	
	    $frame
			.css({
	      		position: 'absolute',
	      		left: '-1000px'
	    	 })
			.load(function(){
				if ( typeof frame.contentDocument !== 'undefined' )
				{
					frameDocument = frame.contentDocument;
				}
				else if ( typeof frame.contentWindow !== 'undefined' &&
						  typeof frame.contentWindow.document !== 'undefined' )
				{
	        		frameDocument = frame.contentWindow.document;
				}
				frameDocument.designMode = 'on';
				callback(frameDocument);
				$frame.remove();
			 });
	    $('body').append($frame);
	}

  	function detectParagraphType(doc)
	{
		var tagName;

    	doc.body.innerHTML = '';
    	doc.execCommand('insertparagraph', false, null);

    	element = doc.body.childNodes[0];
    	if (element && element.tagName)
		{
	      tagName = element.tagName.toLowerCase();
		}

    	if (tagName == 'div')
		{
	    	features.paragraphType = "div";
		}
		else if (doc.body.innerHTML == "<p><br></p>")
		{
			features.paragraphType = "br";
		}
		else
		{
			features.paragraphType = "p";
		}
	}

	function detectIndentType(doc)
	{
		var tagName;

		doc.body.innerHTML = 'tab';
		doc.execCommand('indent', false, null);

		element = doc.body.childNodes[0];
		if (element && element.tagName)
		{
			tagName = element.tagName.toLowerCase();
		}
		
		features.indentInsertsBlockquote = (tagName == 'blockquote');
	}

	features.run = function run()
	{
		if (features.finished) return;

		createTmpIframe(function(document){
			detectParagraphType(document);
			detectIndentType(document);
			features.finished = true;
		});
	};

	return features;
	
})(jQuery);