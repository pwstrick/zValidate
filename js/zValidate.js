/*!
 * zValidate
 * Date: 2015-10-28
 * https://github.com/pwstrick/zValidate
 * author：pwstrick
 */
;(function($, global){
	'use strict';
	
	$.fn.zValidate = function(options){
        return new zValidate(this, options);
    };
	var zValidate = function (element, options) {
        this.options = $.extend({}, zValidate.defaults, options);//合并参数设置
        this.$currentForm = $(element);
        this.init();
    };

    /**
     * 默认配置项
     */
    zValidate.defaults = {
    	errorClass: "error",//错误样式
		errorElement: "label",//错误标签
		errorContainer: "",//展示错误信息的容器
    	debug: false, //开启或关闭调试
    	errorPlacement: null,//自定义错误处理$error, $element
    	highlight: function($element) {//高亮 当前作用域是zValidate
    		if(zValidate.checkable($element)) {
    			$element.parent().addClass(this.options.errorClass);
    		}else {
    			$element.addClass(this.options.errorClass);
    		}
    	},
    	unhighlight: function($element) {//取消高亮
    		if(zValidate.checkable($element)) {
    			$element.parent().removeClass(this.options.errorClass);
    		}else {
    			$element.removeClass(this.options.errorClass);
    		}
    	},
    	submit: function($form, params) {//提交逻辑
    		$.post($form.attr('action'), params, function(data) {
    			
    		});
    	}
    };

    /**
     * 插件的方法
     */
    zValidate.prototype = {
        init: function () {
        	var me = this;
        	var $elements = me.elements();//获取当前元素
        	var $submit = me.$currentForm.find('[type=submit]');//获取提交按钮
        	me.rules = [];//规则列表
        	$.each(me.methods, function(key) {
        		me.rules.push(key);
        	});
        	me.cacheError = {};//错误信息缓存对象
        	me.$currentForm.submit(function() {
        		var result = me.check($elements);//检查规则
        		if(result !== false) {
        			me.options.submit.call(me, me.$currentForm, result);//执行自定义事件
        		}
        		return false;
        	});
        },
        refresh: function($elements) {//刷新 将错误样式去除
        	var me = this;
			$.each(me.cacheError, function(key, $error) {//隐藏缓存的错误信息
				$error.hide();
			});
			$elements.each(function() {//去除控件的错误样式
				me.options.unhighlight.call(me, $(this));
			});
        },
        elements: function() {//获取当前form表单中的标签
			return this.$currentForm
				.find("input, select, textarea")
				.not("[type=submit], [type=reset], image, [disabled], [readonly], button");
		},
		check: function($elements) {//返回false或标签内容数组
			var isError = false;//判断是否是错误
			var message = '';
			var me = this;
			var params = {};
			me.refresh($elements);//清除错误信息
			$.each($elements, function(index, input) {
				var $input = $(input);
				var name = $input.attr('name') || $input.attr('id');
				if(isError || name == '') {
	        		return;
	        	}
	        	var datas = $input[0].dataset;//获取data-*开头的属性
	        	var val = me.elementValue($input);//获取value
	        	params[name] = val;//设置要传递的值
	        	$.each(datas, function(key, rule) {
	        		if(isError) return isError;
	        		rule = zValidate.deserializeValue($.trim(rule));//格式化类型
	        		if($.inArray(key, me.rules) >= 0) {
	        			if(rule === false || rule === null || rule === undefined)
	        				return;
	        			var success = me.methods[key].call(me, val, $input, rule);
	        			if(!success) {
	        				isError = true;
	        				message = $input.data(key+'Message');//错误提示
	        				me.options.highlight.call(me, $input);//高亮
	        				me.showLabel(name, $input, message);//显示错误信息
	        			}
	        		}
	        	});
	        });
	        if(isError) {//如果是错误
	        	return false;
	        }
	        return params;
		},
		showLabel: function(name, $element, message) {
			var $error, id = name + '-error';
			if(this.cacheError[id] !== undefined) {//加入到缓存中
				$error = this.cacheError[id];
				$error.show();
			}else {
				$error = $( "<" + this.options.errorElement + ">" ).addClass(this.options.errorClass);
				this.cacheError[id] = $error;
			}
			$error.html(message || "");
			var errorContainer = this.options.errorContainer;
			var errorPlacement = this.options.errorPlacement;
			if(errorContainer.length) {
				errorContainer.append($error);
			}else if(errorPlacement && typeof errorPlacement === "function") {
				errorPlacement.call(this, $error, $element);
			}else{
				if(zValidate.checkable($element)) {
					$element.parent().append($error);
				}else {
					$error.insertAfter($element);
				}
			}
		},
		elementValue: function($element) {//获取元素的值 单选或多选返回数组
	    	var type = $element[0].type;
			if(zValidate.checkable($element)) {//判断是check or radio
				return this.checked($element.attr("name"), $element[0].type.toLowerCase());
			}else if(type === "number" && typeof $element[0].validity !== "undefined") {
				return $element[0].validity.badInput ? false : $element.val();
			}
			var val = $element.val();
			return val.replace(/\r/g, "");//将换行去除
	    },
	    optional: function($element) {//判断是否是必填项
	    	if($element == undefined) return false;
			var val = this.elementValue($element);//根据长度来 如果长度>0才去做判断
			return !this.methods.required.call(this, val, $element);
		},
		addMethod: function(name, method) {
			this.methods[name] = method;
			this.rules.push(name);
		},
		checked: function(name, type) {//获取单选框与多选框选中的元素
			var vals = [];
			$('input[name="'+name+'"]').filter(function() {
				return $(this).attr('checked');
			}).each(function() {
				vals.push($(this).val());
			});
			if(type == "radio")//单选框就不要返回数组
				return vals.length > 0 ? vals[0] : '';
			return vals;//多选框返回数组
		},
		methods: {//验证方法 可自定义扩展
	    	required: function(value, $element, param) {//必填
	    		return value.length > 0 || false;
	    	},
	    	email: function(value, $element, param) {//邮箱
	    		return this.optional($element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
	    	},
	    	url: function(value, $element, param) {//链接地址
	    		return this.optional($element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test( value );
			},
			date: function(value, $element, param) {//日期
				return this.optional($element) || !/Invalid|NaN/.test(new Date(value).toString());
			},
			number: function(value, $element, param) {//合法的数字(负数，小数)
				return this.optional($element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
			},
	    	digits: function(value, $element, param) {//整数
				return this.optional($element) || /^\d+$/.test(value);
			},
			minlength: function(value, $element, param) {//最小长度 包括相等
				var length = value.length;
				return this.optional($element) || length >= param;
			},
			maxlength: function(value, $element, param) {//最大长度 包括相等
				var length = value.length;
				return this.optional($element) || length <= param;
			},
			rangelength: function(value, $element, param) {//长度范围 包括相等
				var length = value.length;
				return this.optional($element) || (length >= param[0] && length <= param[1]);
			},
			min: function(value, element, param) {//最小值
				return this.optional(element) || value >= param;
			},
			max: function(value, element, param) {//最大值
				return this.optional(element) || value <= param;
			},
			range: function(value, element, param) {//值的范围
				return this.optional(element) || (value >= param[0] && value <= param[1]);
			},
			equalTo: function(value, element, param) {//与指定的标签判断值是否相等 例如密码确认
				var target = $(param);
				return value === target.val();
			},
			notEqual: function(value, element, param) {//与指定值不匹配 例如下拉框的第一个值
				return value != param;
			}
	    },
        console: function(msg) {//控制台调试
	    	if(this.options.debug === false)
	    		return '';
	    	if(typeof console !== 'undefined') {
	    		console.log(msg);
	    	}
	    }    
    };

    /**
     * 判断当前是否是checkbox or radio
     */
    zValidate.checkable = function($element) {//判断元素是否是单选或多选框
		return (/radio|checkbox/i).test($element[0].type);
	};
    /**
     * 将值类型转换
     * "true"  => true "false" => false "null"  => null "42"    => 42
  	 * "42.5"  => 42.5 "08"    => "08" JSON    => parse if valid String  => self
     */
    zValidate.deserializeValue = function(value) {
	    try {
	      return value ?
	        value == "true" || 
	        (value == "false" ? false :
	          value == "null" ? null :
	          +value + "" == value ? +value :
	          /^[\[\{]/.test(value) ? $.parseJSON(value) :
	          value)
	        : value;
	    }catch(e) {
	      return value
	    }
  	}
	global['zValidate'] = zValidate;
})(Zepto, window);