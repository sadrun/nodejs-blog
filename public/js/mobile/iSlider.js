
function ISlider(options){
	this.init(options);
}

ISlider.prototype = {
	constructor : ISlider,
	init : function(options){

		this.options = this.extend({
			container : 'pages',
			speed : 1, //滑动时间
			limit : 80 //翻页临界值
		},options);

		this.$Container = document.querySelector("#"+this.options.container);
		this.$PageList = this.$Container.querySelectorAll(".page");

		this.initStyle(this.$PageList);
		this.bindEvent();

	},
	bindEvent : function(){
		var self = this;
		var Events = ['touchstart','touchmove','touchend'];
		Events.forEach(function(event){
			self.$Container.addEventListener(event,self,false);
		});
	},
	handleEvent :function(e){
		e.preventDefault();
		switch(e.type){
			case 'touchstart':
				this._start(e);
				break;
			case 'touchmove':
				this._move(e);
				break;
			case 'touchend':
				this._end(e);
				break;
		}
	},
	_start : function(e){
		this.pageX = e.touches[0].pageX;
		this.pageY = e.touches[0].pageY;
		this.endPos ={pageX:e.touches[0].pageX,pageY:e.touches[0].pageY};
	},
	_move : function(e){
		if(this.isMove) return;
		this.endPos ={pageX:e.touches[0].pageX,pageY:e.touches[0].pageY};
		var flag_X = e.touches[0].pageX - this.pageX,
			flag_Y = e.touches[0].pageY - this.pageY;
		this.current = this.$Container.querySelector(".current");
		this.nextsibling = this.nextPage(this.current);
		this.prevsibling = this.prevPage(this.current);
		this.dragmove(flag_X,flag_Y);
	},
	_end : function(e){
		if(this.isMove) return;
		var flag_X = this.endPos.pageX - this.pageX,
			flag_Y = this.endPos.pageY - this.pageY;
		if(Math.abs(flag_Y) >this.options.limit){
			this.pullmove(flag_X,flag_Y,false);
		}else{
			this.pullmove(flag_X,flag_Y,true);
		}

	},
	dragmove : function(flag_X,flag_Y){
		if((flag_Y > 0 && this.prevsibling)  || (flag_Y < 0 && this.nextsibling)){
			var windowSize = this.windowSize();
			this.current.style.cssText = '-webkit-transform:translate3d(0px,'+flag_Y+'px,0px)';
			this.nextsibling && (this.nextsibling.style.cssText = '-webkit-transform:translate3d(0px,'+(windowSize.height+flag_Y)+'px,0px);') ;
			this.prevsibling && (this.prevsibling.style.cssText = '-webkit-transform:translate3d(0px,'+(-windowSize.height+flag_Y)+'px,0px);') ;
		}
	},
	pullmove : function(flag_X,flag_Y,isInit){
		if((flag_Y > 0 && this.prevsibling)  || (flag_Y < 0 && this.nextsibling)){
			var windowSize = this.windowSize();
			var time;
			this.isMove = true;
			this.animateEnd(this.current);
			if(isInit){
				time = Math.abs(flag_Y)*this.options.speed/windowSize.height;
				this.current.style.cssText = '-webkit-transform:translate3d(0px,'+0+'px,0px);transition-duration:'+time+'s;';
				this.nextsibling && (this.nextsibling.style.cssText = '-webkit-transform:translate3d(0px,'+windowSize.height+'px,0px);transition-duration:'+time+'s;') ;
				this.prevsibling && (this.prevsibling.style.cssText = '-webkit-transform:translate3d(0px,'+(-windowSize.height)+'px,0px);transition-duration:'+time+'s;') ;
			}else{
				time = (windowSize.height-Math.abs(flag_Y))*this.options.speed/windowSize.height;
				this.current.style.cssText = '-webkit-transform:translate3d(0px,'+(flag_Y<0 ? -windowSize.height : windowSize.height)+'px,0px);transition-duration:'+time+'s;';
				this.nextsibling && (this.nextsibling.style.cssText = '-webkit-transform:translate3d(0px,'+(flag_Y<0 ? 0 : windowSize.height)+'px,0px);transition-duration:'+time+'s;') ;
				this.prevsibling && (this.prevsibling.style.cssText = '-webkit-transform:translate3d(0px,'+(flag_Y<0 ? -windowSize.height : 0)+'px,0px);transition-duration:'+time+'s;') ;
				this.removeClass(this.current,"current");
				if(flag_Y<0){
					this.addClass(this.nextsibling,"current");
				}else{
					this.addClass(this.prevsibling,"current");
				}
			}
		}
	},
	animateEnd : function(obj){
		var self = this;
		obj.addEventListener("webkitTransitionEnd",function(e){
			self.isMove = false;
		})
	},
	nextPage : function(cur){
		return cur.nextElementSibling;
	},
	prevPage : function(cur){
		return cur.previousElementSibling;
	},
	hasClass : function(obj,cls){
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	},
	addClass : function(obj,cls){
		if (!this.hasClass(obj, cls)) obj.className += " " + cls;
	},
	removeClass : function(obj,cls){
		if (this.hasClass(obj, cls)) {  
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
	        obj.className = obj.className.replace(reg, ' ');  
	    } 
	},
	initStyle : function(elements){
		var self = this;
		var windowSize = self.windowSize();
		
		[].forEach.call(elements,function(row,index){
			row.style.cssText= !!index ? ['-webkit-transform:translate3d(0px,',windowSize.height,'px,0px);'].join("") : '-webkit-transform:translate3d(0px,0px,0px);';
			!index  && self.addClass(row,'current');
		});
	},
	windowSize :function(){
		return {
			height:document.body.offsetHeight,
			width:document.body.offsetWidth
		}
	},
	extend : function(defaultopt,options){
		for(var i in options){
			if(defaultopt.hasOwnProperty(i)){
				defaultopt[i] = options[i];
			}
		}
		return defaultopt;
	}
}