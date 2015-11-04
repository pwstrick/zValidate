describe("methods", function() {//验证方法测试
	var validate = null;
	beforeEach(function() {
		this.validate = new zValidate();
	});
	
	describe("required", function() {
		it("0", function() {
	    	result = this.validate.methods.required(0);
	    	expect(result).toBe(false);
	  	});
	  	it("空字符串", function() {
	    	result = this.validate.methods.required('');
	    	expect(result).toBe(false);
	  	});
	  	it("false", function() {
	    	result = this.validate.methods.required(false);
	    	expect(result).toBe(false);
	  	});
	});
	
	describe("email", function() {
	  	it("格式错误", function() {
	    	result = this.validate.methods.email.call(this.validate, '4311.com');
	    	expect(result).toBe(false);
	  	});
	  	it("正确格式", function() {
	    	result = this.validate.methods.email.call(this.validate, '4311@ee.com');
	    	expect(result).toBe(true);
	  	});
	});
	
	describe("url", function() {
	  	it("www.pwstrick.com", function() {
	    	result = this.validate.methods.url.call(this.validate, 'www.pwstrick.com');
	    	expect(result).toBe(false);
	  	});
	  	it("http://www.pwstrick.com", function() {
	    	result = this.validate.methods.url.call(this.validate, 'http://www.pwstrick.com');
	    	expect(result).toBe(true);
	  	});
	  	it("ftp://www.pwstrick.com", function() {
	    	result = this.validate.methods.url.call(this.validate, 'ftp://www.pwstrick.com');
	    	expect(result).toBe(true);
	  	});
	  	it("https://www.pwstrick.com", function() {
	    	result = this.validate.methods.url.call(this.validate, 'https://www.pwstrick.com');
	    	expect(result).toBe(true);
	  	});
	});
	
	describe("date", function() {
	  	it("2010-10-10", function() {
	    	result = this.validate.methods.date.call(this.validate, '2010-10-10');
	    	expect(result).toBe(true);
	  	});
	  	it("2010-13-10", function() {
	    	result = this.validate.methods.date.call(this.validate, '2010-13-10');
	    	expect(result).toBe(false);
	  	});
	  	it("10:10", function() {
	    	result = this.validate.methods.date.call(this.validate, '10:10');
	    	expect(result).toBe(false);
	  	});
	  	it("2010-10-10 10:10", function() {
	    	result = this.validate.methods.date.call(this.validate, '2010-10-10 10:10');
	    	expect(result).toBe(true);
	  	});
	});
	
	describe("number", function() {
	  	it("0.1", function() {
	    	result = this.validate.methods.number.call(this.validate, '0.1');
	    	expect(result).toBe(true);
	  	});
	  	it("-0.1", function() {
	    	result = this.validate.methods.number.call(this.validate, '-0.1');
	    	expect(result).toBe(true);
	  	});
	  	it("11", function() {
	    	result = this.validate.methods.number.call(this.validate, '11');
	    	expect(result).toBe(true);
	  	});
	  	it("NaN", function() {
	    	result = this.validate.methods.number.call(this.validate, NaN);
	    	expect(result).toBe(false);
	  	});
	});
	
	describe("digits", function() {
		it("0.1", function() {
	    	result = this.validate.methods.digits.call(this.validate,'0.1');
	    	expect(result).toBe(false);
	  	});
	  	it("1", function() {
	    	result = this.validate.methods.digits.call(this.validate,'1');
	    	expect(result).toBe(true);
	  	});
	  	it("-1", function() {
	    	result = this.validate.methods.digits.call(this.validate,'-1');
	    	expect(result).toBe(false);
	  	});
	});
	
	describe("minlength", function() {
		it("2", function() {
	    	result = this.validate.methods.minlength.call(this.validate,'22', undefined, 2);
	    	expect(result).toBe(true);
	  	});
	  	it("3", function() {
	    	result = this.validate.methods.minlength.call(this.validate,'22', undefined, 3);
	    	expect(result).toBe(false);
	  	});
	});
	
	describe("maxlength", function() {
		it("2", function() {
	    	result = this.validate.methods.maxlength.call(this.validate,'22', undefined, 2);
	    	expect(result).toBe(true);
	  	});
	  	it("1", function() {
	    	result = this.validate.methods.maxlength.call(this.validate,'22', undefined, 1);
	    	expect(result).toBe(false);
	  	});
	});
	
	describe("rangelength", function() {
		it("2~4", function() {
	    	result = this.validate.methods.rangelength.call(this.validate,'2222', undefined, [2,4]);
	    	expect(result).toBe(true);
	  	});
	  	it("1", function() {
	    	result = this.validate.methods.rangelength.call(this.validate,'2', undefined, [2,4]);
	    	expect(result).toBe(false);
	  	});
	  	it("5", function() {
	    	result = this.validate.methods.rangelength.call(this.validate,'22222', undefined, [2,4]);
	    	expect(result).toBe(false);
	  	});
	});
	
	describe("min", function() {
		it("5", function() {
	    	result = this.validate.methods.min.call(this.validate, 2, undefined, 5);
	    	expect(result).toBe(false);
	  	});
	  	it("4", function() {
	    	result = this.validate.methods.min.call(this.validate, 5, undefined, 4);
	    	expect(result).toBe(true);
	  	});
	  	it("22", function() {
	    	result = this.validate.methods.min.call(this.validate,'22', undefined, 1);
	    	expect(result).toBe(true);
	  	});
	});
	
	describe("max", function() {
		it("5", function() {
	    	result = this.validate.methods.max.call(this.validate, 2, undefined, 5);
	    	expect(result).toBe(true);
	  	});
	  	it("4", function() {
	    	result = this.validate.methods.max.call(this.validate, 5, undefined, 4);
	    	expect(result).toBe(false);
	  	});
	  	it("22", function() {
	    	result = this.validate.methods.max.call(this.validate,'22', undefined, 1);
	    	expect(result).toBe(false);
	  	});
	});
	
	describe("range", function() {
		it("5~10", function() {
	    	result = this.validate.methods.range.call(this.validate, 2, undefined, [5,10]);
	    	expect(result).toBe(false);
	  	});
	  	it("5~10", function() {
	    	result = this.validate.methods.range.call(this.validate, 6, undefined, [5,10]);
	    	expect(result).toBe(true);
	  	});
	  	it("5~10", function() {
	    	result = this.validate.methods.range.call(this.validate,11, undefined, [5,10]);
	    	expect(result).toBe(false);
	  	});
	});
	
	describe("notEqual", function() {
		it("10", function() {
	    	result = this.validate.methods.notEqual.call(this.validate, 10, undefined, 10);
	    	expect(result).toBe(false);
	  	});
	  	it("字符串10", function() {
	    	result = this.validate.methods.notEqual.call(this.validate, '10', undefined, 10);
	    	expect(result).toBe(false);
	  	});
	  	it("null", function() {
	    	result = this.validate.methods.notEqual.call(this.validate, undefined, undefined, null);
	    	expect(result).toBe(false);
	  	});
	  	console.log(undefined == null);//true
	  	console.log(undefined == false);//false
	  	console.log(undefined == '');//false
	  	console.log(undefined == 0);//false
	  	
	  	console.log(null == false);//false
	  	console.log(null == '');//false
	  	console.log(null == 0);//false
	  	
	  	console.log(false == '');//true
	  	console.log(false == 0);//true
	  	
	  	console.log('' == 0);//true
	  	
	  	console.log(undefined || 1);//true
	  	console.log(null || 1);//true
	  	console.log(false || 1);//true
	  	console.log('' || 1);//true
	  	console.log(0 || 1);//true
	});
});