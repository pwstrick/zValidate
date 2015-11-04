# zValidate
移动端表单验证插件

- 基于zepto.js;
- resource中的图片文件就一张二维码图片，仅仅用于扫描
- css/demo.css文件仅仅是页面布局CSS
- css/zValidate.css写的是控件和表单的简单样式，可自定义
- 就200多行代码，对于不符合使用项目的部分，可随意修改

## 移动端展示
![二维码](http://pwstrick.github.io/zValidate/resource/qrcode.png) 

Demo [http://pwstrick.github.io/zDialog](http://pwstrick.github.io/zValidate)

## 开始使用 zValidate

使用zValidate最简单的办法是查阅我提供的简易例子，请浏览index.html的内容

#### 载入zValidate

引入CSS文件和zepto库文件，还有zValidate类文件，这里说明一下
*zValidate.css仅仅是表单和控件的样式，完全可以自定义*
``` html
<!--zValidate.css可自定义-->
<link rel="stylesheet" href="styles/zValidate.css" />
<script src="scripts/zepto/zepto.js"></script>
<script src="scripts/zValidate.js"></script>
```

#### 初始化一个zValidate
``` javascript
$('.validate').zValidate();
```

#### zValidate演示中的表单结构
控件是由fieldset包裹的，input输入框使用了form-control样式类，一个form表单在最外面，里面有个submit按钮
``` html
<form id="validate3" method="post">
  <div class="form-horizontal">
    <fieldset class="form-group">
      <div class="controls">
        <input class="form-control" type="text" name="xxx"/>
      </div>
    </fieldset>
    <fieldset>
        <button type="submit">提交</button>
    </fieldset>
  </div>
</form>
```

### 下面是zValidate详细的选项配置列表
<table>
<thead>
    <tr>
        <td>选项</td>
        <td>类型</td>
        <td>默认值</td>
        <td>说明</td>
    </tr>
</thead>
<tbody>
    <tr>
        <td>errorClass</td>
        <td>{string}</td>
        <td>"error"</td>
        <td>错误样式</td>
    </tr>
    <tr>
        <td>errorElement</td>
        <td>{string}</td>
        <td>"label"</td>
        <td>展示错误信息的标签</td>
    </tr>
    <tr>
        <td>errorContainer</td>
        <td>{string}<br/>
        {object}</td>
        <td>""</td>
        <td>展示错误信息的容器对象</td>
    </tr>
    <tr>
        <td>debug</td>
        <td>{boolean}</td>
        <td>false</td>
        <td>开启或关闭调试</td>
    </tr>
    <tr>
        <td>errorPlacement</td>
        <td>{function}</td>
        <td>null</td>
        <td>自定义处理出错方法，有两个参数<br/>
        $error:错误对象<br/>
        $element:当前控件对象
        </td>
    </tr>
    <tr>
        <td>highlight</td>
        <td>{function}</td>
        <td></td>
        <td>设置错误高亮方法<br>
        如果在这里引用this的话，引用的是当前初始化的zValidate对象</td>
    </tr>
    <tr>
        <td>unhighlight</td>
        <td>{function}</td>
        <td></td>
        <td>取消错误高亮方法<br>
        如果在这里引用this的话，引用的是当前初始化的zValidate对象</td>
    </tr>
    <tr>
        <td>submit</td>
        <td>{function}</td>
        <td></td>
        <td>自定义提交逻辑方法<br/>
        可在里面写ajax等方法<br/>
        如果在这里引用this的话，引用的是当前初始化的zValidate对象</td>
    </tr>
</tbody>
</table>

## 联系我
对zValidate的使用有任何问题,或者发现bug,欢迎给我反馈：
[提交反馈](https://github.com/pwstrick/zValidate/issues/new)

## License (MIT)

Copyright (c) 2015 pwstrick

[MIT](https://github.com/pwstrick/zValidate/blob/master/LICENSE)
