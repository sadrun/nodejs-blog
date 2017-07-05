(function(){
	if(localStorage && localStorage.mask){
		return;
	}
	var coverGuide = function(cover, target) {
		var body = document.body, doc = document.documentElement;
		if (cover && target) {
			// target size(width/height)
			var targetWidth = target.clientWidth,
				targetHeight = target.clientHeight;

			// page size
			var pageHeight = doc.scrollHeight,
				pageWidth = doc.scrollWidth;
				
			// offset of target	
			var offsetTop = target.getBoundingClientRect().top + (body.scrollTop || doc.scrollTop),
				offsetLeft = target.getBoundingClientRect().left + (body.scrollLeft || doc.scrollLeft);
			
			// set size and border-width
			cover.style.width = targetWidth + 'px';
			cover.style.height = targetHeight + 'px';	
			cover.style.borderWidth = 
				offsetTop + 'px ' + 
				(pageWidth - targetWidth - offsetLeft) + 'px ' +
				(pageHeight - targetHeight - offsetTop) + 'px ' + 
				offsetLeft + 'px';
			
			cover.style.display = 'block';
				
			// resize
			if (!cover.isResizeBind) {
				if (window.addEventListener) {
					window.addEventListener('resize', function() {
						coverGuide(cover, target);
					});	
					cover.isResizeBind = true;
				} else if (window.attachEvent) {
					window.attachEvent('onresize', function() {
						coverGuide(cover, target);
					});
					cover.isResizeBind = true;
					
					// IE7, IE8 box-shadow hack
					cover.innerHTML = '<img src="guide-shadow.png">';
				}
			}
		}
	};
	var stylesheet =['#cover {display: none;position: absolute;width: 0; height: 0;left: 0; top: 0; right: 0; bottom: 0;border: 0 solid #000;opacity: .75;filter: alpha(opacity=75);z-index: 9;/* 过渡效果 */transition: all .25s;/* 边缘闪动问题fix */box-shadow: 0 0 0 100px #000;overflow: hidden;}',
				'#cover::before {content: "";width: 100%; height:100%;border-radius: 50%;border: 400px solid #000; position: absolute;left: -400px; top: -400px;box-shadow: inset 0 0 5px 2px rgba(0,0,0,.75);}',
				'#cover > img {width: 100%; height: 100%;}',
				'.coverclose {position: absolute;top: 5px; right: 10px;font: status-bar;font-size: 20px;color: #fff;z-index: 10;}',
				'.coverclose:hover {text-decoration: underline;}'
		];
	var style = document.createElement("style");
	style.innerHTML =stylesheet.join('');
	document.head.appendChild(style); 

	var cover = document.createElement('div');
	cover.id = 'cover';
	var a = document.createElement('a');
	a.className ="coverclose";
	a.innerHTML = 'X';
	a.onclick = function() {
	    cover.parentNode.removeChild(cover);
	    this.style.display="none";
	};

	var arrElTarget = [ 
	    document.getElementById('min-home'), 
	    document.getElementById('min-example'),
	    document.getElementById('min-qq'),
	    document.getElementById('min-sina'),
	    document.getElementById('min-resume')
	], index = 0;
	coverGuide(cover, arrElTarget[index]);
	document.body.appendChild(cover);
	document.body.appendChild(a);
	cover.onclick = function() {
	    index++;
	    if (!arrElTarget[index]) {
	        index = 0;    
	    }
	    coverGuide(cover, arrElTarget[index]);
	};
	localStorage.mask = true;
})();