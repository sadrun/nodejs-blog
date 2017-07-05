
function TurnPage(options){
	this.init(options);
}

TurnPage.prototype = {
	init : function(options){
		this.options = this.extend({
			view : 'turnpage', //视窗
			container : 'pages', // 列表容器
			speed : 1, //滑动时间
			limit : 100 //翻页临界值
		},options);
		this.$View = document.querySelector('#'+this.options.view);
		this.$Container = document.querySelector('#'+this.options.container);
		this.addClass(this.$Container.querySelector(':first-child'),'active');
		this.pageSize = this.getpageSize();
		this.curPos = 0;
		this.bindEvent();
	},
	bindEvent : function(){
		var self = this;
		var Events = ['touchstart','touchmove','touchend'];
		Events.forEach(function(event){
			/*self.$View.addEventListener(event,self,false);*/
			document.addEventListener(event,self,false);
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
		this.startX=this.pageX = e.touches[0].pageX;
		this.startY =this.pageY = e.touches[0].pageY;
		this.endPos ={pageX:e.touches[0].pageX,pageY:e.touches[0].pageY};
	},
	_move : function(e){
		if(this.flag) return;
		this.endPos ={pageX:e.touches[0].pageX,pageY:e.touches[0].pageY};
		var flag_X = e.touches[0].pageX - this.pageX,
			flag_Y = e.touches[0].pageY - this.pageY;
		this.pageX = e.touches[0].pageX,
		this.pageY = e.touches[0].pageY;
		this.curpage = this.$Container.querySelector(".active");
		this.nextsibling = this.nextPage(this.curpage);
		this.prevsibling = this.prevPage(this.curpage);
		this.dragMove(flag_X,flag_Y);

	},
	_end : function(e){
		if(this.flag) return;
		var flag_X = this.endPos.pageX - this.startX,
			flag_Y = this.endPos.pageY - this.startY;
		if(Math.abs(flag_Y) > this.options.limit){
			this.freeMove(flag_X,flag_Y,true);
		}else{
			this.freeMove(flag_X,flag_Y,false);
		}
	},
	dragMove : function(flag_X,flag_Y){ //拖动
		if((flag_Y > 0 && this.prevsibling)  || (flag_Y < 0 && this.nextsibling)){
			this.curPos += flag_Y;
			this.$Container.style.cssText = '-webkit-transform:translate(0px,'+this.curPos+'px)';
		}
	},
	freeMove : function(flag_X,flag_Y,ischange){ //自由滑动
		if((flag_Y > 0 && this.prevsibling)  || (flag_Y < 0 && this.nextsibling)){
			this.flag = true;
			var time,
			    _height = this.pageSize.height;
			this.animateEnd(this.$Container);

			if(ischange){
				time =  (_height-Math.abs(flag_Y))*this.options.speed/_height;
				this.curPos += (flag_Y < 0 ? -(_height-Math.abs(flag_Y)) :(_height-Math.abs(flag_Y)));
				//矫正
				this.curPos = Math.round(this.curPos/_height)*_height;
				this.$Container.style.cssText = '-webkit-transform:translate(0px,'+this.curPos+'px);-webkit-transition-duration:'+time+'s;';
				this.removeClass(this.curpage,"active");
				if(flag_Y<0){
					this.addClass(this.nextsibling,"active");
				}else{
					this.addClass(this.prevsibling,"active");
				}
			}else{
				time =  Math.abs(flag_Y)*this.options.speed/_height;
				this.curPos += (flag_Y < 0 ? Math.abs(flag_Y) :-Math.abs(flag_Y));
				//矫正
				this.curPos = Math.round(this.curPos/_height)*_height;
				this.$Container.style.cssText = '-webkit-transform:translate(0px,'+this.curPos+'px);-webkit-transition-duration:'+time+'s;';
			}
		}
	},
	animateEnd : function(obj){
		var self = this;
		obj.addEventListener("webkitTransitionEnd",function(e){
			self.flag = false;
		})
	},
	nextPage : function(active){
		return active.nextElementSibling;
	},
	prevPage : function(active){
		return active.previousElementSibling;
	},
	getpageSize:function(){
		return {
			height:this.$View.offsetHeight,
			width:this.$View.offsetWidth
		}
	},
	extend : function(defaultopt,options){
		for(var i in options){
			if(defaultopt.hasOwnProperty(i)){
				defaultopt[i] = options[i];
			}
		}
		return defaultopt;
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
	}
}