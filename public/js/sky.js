(function(global,factory,extend){
	window.Sky || (window.Sky = factory());
})(this,function(){
	return {
		addClass: function(n, c) {
        	var e = new RegExp('(^|\\s)' + c + '(\\s|$)');
	        !e.test(n.className) && (n.className += n.className ? ' ' + c : c);
	    },
	    removeClass: function(n, c) {
	        var e = new RegExp('(^|\\s)' + c + '(\\s|$)', 'g');
	        n.className = n.className.replace(e, ' ').replace(/(^\s*)|(\s*$)/g, '');
	    },
	    hasClass: function(n, c) {
	        var e = new RegExp('(^|\\s)' + c + '(\\s|$)');
	        return e.test(n.className);
	    },
	    jsonToParams: function(json) {
	        var a = [];
	        for (var i in json) {
	            a.push(i + '=' + json[i]);
	        }
	        return a.join('&');
	    },
	    append: function(parent, childs) {
	        var parent = parent || document.body, i, l;
	        if (childs.constructor == Array) {
	            for (i = 0, l = childs.length; i < l; i++) {
	                parent.appendChild(childs[i]);
	            }
	        }
	        else {
	            parent.appendChild(childs);
	        }
	    },
	    formatTime: function (nStart, nEnd) {//格式化时间,精确到秒
	        var nDiff, //差值
	            dateStart,
	            dateEnd;

	        nStart = nStart || 0;
	        nEnd = nEnd || 0;
	        if (!nStart || !nEnd) {
	            return '';
	        }
	        nDiff = nEnd - nStart;
	        if (nDiff < 60) { //1分钟以内
	            return [Math.max(2, nDiff), '秒前'].join('');
	        }
	        if (nDiff < 60 * 60) { //1小时以内
	            return [parseInt(nDiff / 60, 10), '分钟前'].join('');
	        }

	        dateStart = new Date(nStart * 1000);
	        dateEnd = new Date(nEnd * 1000);

	        if (dateEnd.getFullYear() > dateStart.getFullYear()) {//跨年
	            return [dateStart.getFullYear(), '年', dateStart.getMonth() + 1, '月', dateStart.getDate(), '日'].join('');
	        }
	        if (dateEnd.getMonth() > dateStart.getMonth()) {//跨月
	            return [dateStart.getMonth() + 1, '月', dateStart.getDate(), '日', dateStart.getHours() < 10 ? '0' + dateStart.getHours() : dateStart.getHours(), ':', dateStart.getMinutes() < 10 ? '0' + dateStart.getMinutes() : dateStart.getMinutes()].join('');
	        }
	        if (dateEnd.getDate() > dateStart.getDate()) {//跨天
	            return [dateStart.getMonth() + 1, '月', dateStart.getDate(), '日', dateStart.getHours() < 10 ? '0' + dateStart.getHours() : dateStart.getHours(), ':', dateStart.getMinutes() < 10 ? '0' + dateStart.getMinutes() : dateStart.getMinutes()].join('');
	        }
	        return ['今天 ', dateStart.getHours() < 10 ? '0' + dateStart.getHours() : dateStart.getHours(), ':', dateStart.getMinutes() < 10 ? '0' + dateStart.getMinutes() : dateStart.getMinutes()].join('');
	    },
	    loadScript: function (options) { //动态加载脚本或样式,如果路径中没有明确后缀，默认为js
	    	var self = this;
	        var defaults = {
	            url: '',            // 请求地址
	            params: {},         // 附加参数
	            remove: true,       // 加载完成后，是否删除script
	            version: false,     // 是否需要版本号
	            onload: null,       // 加载完成
	            onerror: null,      // 加载失败
	            error: 3            // 加载失败重试次数
	        };

	        // 内部函数
	        var extend = function() {
	            var args = Array.prototype.slice.apply(arguments), json = {};
	            if (args.length) {
	                json = args.shift();
	                for (var i = 0, len = args.length; i < len; i ++) for (var id in args[i]) json[id] = args[i][id];
	            }
	            return json;
	        };
	        var j2p = function(json) {
	            var a = [];
	            for (var i in json) a.push(i + '=' + json[i]);
	            return a.join('&');
	        };

	        // 合并配置
	        var options = extend({}, defaults, options);

	        // 加载失败
	        if (options.error <= 0) {
	            options.onerror && options.onerror.constructor == Function && options.onerror();
	            return false;
	        }

	        var head = document.getElementsByTagName('head')[0],
	            script = document.createElement('script'),
	            url = options.url,
	            random = parseInt(Math.random() * 1000000000000 + 1000000000000);

	        if (options.version) {
	            options.params['_'] = random;
	        }

	        var params = j2p(options.params);
	        if (params) {
	            var urls = url.split('?'), s = '';
	            if (urls[1] === undefined) s = '?';
	            else if (urls[1] !== '') s = '&';
	            url = [url, s, params].join('');
	        }

	        script.src = url;
	        
	        var loaded = function() {
	            options.onload && options.onload.constructor == Function && options.onload();
	            options.remove && head.removeChild(script);
	        };

	        if (script.addEventListener) {
	            script.addEventListener('load', loaded, false);
	        }
	        else {
	            if ('onreadystatechange' in script) {
	                script.onreadystatechange = function() {
	                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
	                        loaded();
	                    }
	                }
	            }
	            else {
	                script.attachEvent('onload', loaded);
	            }
	        }

	        // 失败重试，次数-1
	        script.onerror = function() {
	            options.error -= 1;
	            self.loadScript(options);
	        };
	        head.appendChild(script);
	    },
	    extend: function() {
	        var args = Array.prototype.slice.apply(arguments), json = {};
	        if (args.length) {
	            json = args.shift();
	            for (var i = 0, len = args.length; i < len; i ++) for (var id in args[i]) json[id] = args[i][id];
	        }
	        return json;
	    },
	    setCaretPosition: function(obj,startpos,endpos){//设置光标位置函数。obj应是含有value属性的html控件
	    	var vlength = obj.value.length;
	    	if(!startpos){
	    		startpos = 0;
	    	}
	    	if(!endpos){
	    		endpos = vlength;
	    	}
	    	if(!startpos){
	    		startpos = vlength;
	    	}
	    	if(endpos > vlength){
	    		endpos = vlength;
	    	}
	    	if(startpos < 0){
				startpos = vlength + startpos;
			}
			if(endpos < 0){
				endpos = vlength + endpos;	
			}

	        if(obj.setSelectionRange) {
	            obj.setSelectionRange(startpos, endpos);
	            obj.focus();
	        }else if (obj.createTextRange) {
	            var range = obj.createTextRange();         
				range.moveStart("character",-vlength);              
				range.moveEnd("character",-vlength);
				range.moveStart("character", startpos);
				range.moveEnd("character",endpos);
				range.select();
		    }
	    },
	    Position: function(obj) {
	        var x = y = 0;
	        do {
	            x += obj.offsetLeft,
	            y += obj.offsetTop;
	        }
	        while ((obj = obj.offsetParent) && obj.tagName != 'BODY');
	        return {
	            x: x, y: y
	        };
	    },
	    createRequest: function() {
	        if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
	        else if(window.XMLHttpRequest) return new XMLHttpRequest();
	    },
	    each: function(array, fn, scope) {
	        var i, len;
	        for (i = 0, len = array.length; i < len; i ++) {
	            fn.call(scope, array[i], i, array);
	        }
	    },
	    jsonp: function (options) { //jsonp
	        // 配置
	        var defaults = {
	            url: '',            // 请求地址
	            params: {},         // 附加参数
	            jsonp: 'callback',  // jsonp回调函数，?jsonp=jsonpCallback
	            jsonpCallback: '',  // jsonp回调函数，如果此值为空，函数名将会随机生成，?jsonp=jsonpCallback
	            version: false,     // 是否需要版本号
	            remove: true,       // 加载完成后，是否删除script
	            onload: null,       // 加载完成
	            onerror: null,      // 加载失败
	            error: 3            // 加载失败重试次数
	        };
	        // 内部函数
	        var extend = function() {
	            var args = Array.prototype.slice.apply(arguments), json = {};
	            if (args.length) {
	                json = args.shift();
	                for (var i = 0, len = args.length; i < len; i ++) for (var id in args[i]) json[id] = args[i][id];
	            }
	            return json;
	        };
	        var j2p = function(json) {
	            var a = [];
	            for (var i in json) a.push(i + '=' + json[i]);
	            return a.join('&');
	        };

	        // 合并配置
	        var options = extend({}, defaults, options);

	        // 加载失败函数回调执行
	        if (options.error <= 0) {
	            options.onerror && options.onerror.constructor == Function && options.onerror();
	            return false;
	        }

	        var head = document.getElementsByTagName('head')[0],
	            script = document.createElement('script'),
	            url = options.url,
	            random = parseInt(Math.random() * 1000000000000 + 1000000000000);

	        // jsonpCallback，若无传值，取随机值
	        options.jsonpCallback = options.jsonpCallback || ['JSONPCallback', random].join('');
	        options.params[options.jsonp] = options.jsonpCallback;
	        
	        if (options.version) {
	            options.params['_'] = random;
	        }
	        
	        window[options.jsonpCallback] = function() {
	            // onload事件回调
	            options.onload && options.onload.constructor == Function && options.onload.apply(options, arguments);
	            // 是否删除当前请求载体
	            options.remove && head.removeChild(script) && (window[options.jsonpCallback]=null);
	        };

	        var params = j2p(options.params);
	        if (params) {
	            var urls = url.split('?'), s = '';
	            if (urls[1] === undefined) s = '?';
	            else if (urls[1] !== '') s = '&';
	            url = [url, s, params].join('');
	        }
	        script.src = url;

	        // 失败重试，次数 -1
	        script.onerror = function() {
	            options.error -= 1;
	            GLOBALS.jsonp(options);
	        };

	        // script节点插入文档
	        head.appendChild(script);
	    },
	    stopPropagation: function(e) {
	        var e = e || window.event;
	        if (e.stopPropagation) e.stopPropagation();
	        else e.cancelBubble = true;
	    },
	    getQueryString: function (k, s) {
	        var r, t, s = s || '?';
	        k = k.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	        r = new RegExp("[\\" + s + "&]" + k + "=([^&#]*)");
	        t = r.exec(window.location.href);
	        return (null == t) ? "": t[1];
	    },
	    bind: function(obj, type, fn) {
	        obj.addEventListener && obj.addEventListener(type, fn, false);
	        obj.attachEvent && obj.attachEvent('on' + type, fn);
	        return fn;
	    },
	    unbind: function(obj, type, fn) {
	        obj.removeEventListener && obj.removeEventListener(type, fn, false);
	        obj.detachEvent && obj.detachEvent('on' + type, fn);
	        return fn;
	    }
	};
});