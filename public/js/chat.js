window.onload = function(){
	var socket = io.connect();
	var page ={
		init:function(){
			this.$chat_mini = $('.chat_mini');
			this.$chat_window = $('.chat_window');
			this.$chat_message_list = $('.chat_message_list');
			this.$send_value = $('#send_value');
			this.$chat_title = $(".chat_title");
			this.$msg_send = $('#msg_send');
			this.$listbox = $('.chat_message_listbox')
			this.boxheight = this.$listbox.offsetHeight;
			this.initEvent();
		},
		initEvent:function(){
			var self =this;
			Sky.bind(self.$chat_mini,'click',function(){
				this.nickname =prompt("请输入你的聊天昵称！");
				if(this.nickname){
					socket.emit("join",this.nickname,function(curpeople){
						self.setCurpeople(curpeople);
						self.addTipMessage('欢迎加入聊天室');
					});
					self.hide(this)
					self.show(self.$chat_window);
				}
			});
			Sky.bind(self.$msg_send,'click',function(){
				var sendmsg = self.$send_value.value;
				self.$send_value.value ="";
				self.addmessage('me',sendmsg);
				socket.emit("sendmsg",sendmsg,function(sucess){
					console.log(sucess);
				});
			});
			socket.on("receivemsg",function(nickname,sendmsg){
				self.addmessage(nickname,sendmsg);
			});
			socket.on("announcement",function(msg,curpeople){
				self.setCurpeople(curpeople);
				self.addTipMessage(msg);
			});
		},
		addTipMessage:function(msg){
			var self = this;
			this.$chat_message_list.innerHTML += this.getTipsHtml(msg);
			setTimeout(function(){
				self.initPosition();
			},0);
		},
		addmessage:function(user,msg){
			var self = this;
			var classstyle= "";
			if(user == "me"){
				classstyle="me";
				user="我";
			}
			this.$chat_message_list.innerHTML += this.getmsgHtml(user,msg,classstyle);
			setTimeout(function(){
				self.initPosition();
			},0);
		},
		getmsgHtml:function(user,msg,classstyle){
			return [
				'<li class="chat_message_listrow '+classstyle+'">',
					'<div class="chatpeople_name">'+user+'：</div>',
					'<div class="chatpeople_msgbox">',
						'<div class="chatpeople_msg">'+msg+'</div>',
					'</div>',
				'</li>'
			].join("");
		},
		getTipsHtml:function(msg){
			return [
				'<li class="chat_message_listrow tips">',
					'<div class="chatpeople_msgbox">',
						'<div class="chatpeople_msg">'+msg+'</div>',
					'</div>',
				'</li>'
			].join("");
		},
		setCurpeople :function(num){
			this.$chat_title.innerHTML = num+' 人在线';
		},
		show:function(ele){
			ele.style.display = "block";
		},
		hide:function(ele){
			ele.style.display = "none";
		},
		initPosition:function(){
			var scrollHeight = this.$listbox.scrollHeight;
			this.$listbox.scrollTop = scrollHeight - this.boxheight;
		}
	};
	page.init();

	function $(select){
		return document.querySelector(select);
	}
}

