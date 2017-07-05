$(function() {
	var frequency = {};
	$(document).on('keydown',
		function(e) {
			var keyCode = e.keyCode;
			var $this = $('span[keyCode=' + keyCode + ']');
			$this.addClass('active');
			if (frequency[keyCode]) {
				frequency[keyCode] += 1;
			} else {
				frequency[keyCode] = 1;
			}
			var c = _.color();
			$this.css({
				'background-color': c,
				'border-color': c
			});
			// _.bubble($this, frequency[keyCode], c);
			_.bubble($this, $this.html(), c);
			return false;
		});
	$(document).on('keyup',
		function(e) {
			var keyCode = e.keyCode;
			var $this = $('span[keyCode=' + keyCode + ']');
			$this.removeClass('active');
			$this.css({
				'background-color': 'transparent',
				'border-color': '#ccc'
			});
			return false;
		});
	var _color = ['#ed5565', '#da4453', '#fc6e51', '#e9573f', '#ffce54', '#f6bb42', '#a0d468', '#8cc152', '#48cfad', '#37bc9b', '#4fc1e9', '#3bafda', '#5d9cec', '#4a89dc', '#ac92ec', '#967adc', '#ec87c0', '#d77oad', '#008B8B', '#49A6C2'];
	var _ = {
		bubble: function($target, n, c) {
			var w = $target.innerWidth(),
				h = $target.innerHeight(),
				l = $target.position().left,
				t = $target.position().top,
				sl = l + ((w - 30) / 2),
				st = t + ((h - 30) / 2),
				$this = $('<span class="ball" style="height:'+h+'px;width:'+w+'px;line-height:'+h+'px;">' + n + '</span>').css({
					'left': sl,
					'top': st,
					'background-color': c
				});
			$this.appendTo('#main');
			$this.stop(true, true).animate({
					top: st - 50 * (Math.random() * 30) * (Math.random() > 0.5 ? -1 : 1),
					left: sl + 50 * (Math.random() * 30) * (Math.random() > 0.5 ? -1 : 1),
					height: 30,
					width: 30,
					'line-height': 30,
					'border-radius': 15
				}, 3000,
				function() {
					$this.fadeOut(400,
						function() {
							$(this).remove()
						});
				});
		},
		color: function() {
			var l = _color.length+1;
			var n = Math.floor(Math.random() * l);
			return _color[n];
		}
	};
	// document.addEventLitener('mousedown',function(){},false);
	$('.code ').on('mousedown', 'span', function() {
		var $this = $(this);
		$this.addClass('active');
		var c = _.color();
		$this.css({
			'background-color': c,
			'border-color': c
		});
		_.bubble($this, $this.html(), c);
	});
	$(document).on('mouseup', function() {
		$('.active').css({
			'background-color': 'transparent',
			'border-color': '#ccc',

		});
		$('.active').removeClass('active');
	});
	(function() {
		var flag1 = $('span[keycode=72]'),
			flag2 = $('span[keycode=73]');
		for (var i = 0; i < 100; i++) {
			flag1.mousedown();
			flag2.mousedown();
		}
		flag1.mouseup();
		flag2.mouseup();
	})();
});