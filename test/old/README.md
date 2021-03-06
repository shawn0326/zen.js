一个简单的WebGL渲染器
================================================
Current Version: NULL

 ![image](./test/resources/hi.png)

简介
--
        一个轻量WebGL渲染器，并且不提供canvas回滚功能！
        渲染部分目前已经包含了RenderTexture，滤镜，混色，遮罩，简单text绘制等高级功能，graphics绘制正在开发中。
        插件部分已包含了屏幕适配器与touch事件触发器。

前言
--
        经过近几年的发展，移动平台设备已经普遍支持了WebGL。但目前国内有关WebGL的资料仍然不多，大部分教程都是讲three.js的。很多WebGL教程作者认为WebGL底层接口太过繁复，不宜新手入门。的确，如果从底层接口入手的话，可能学了好几课才刚刚学会画一个三角形。如果不是专业从业人员恐怕很难对OpenGL那一套复杂的概念感兴趣。但是如果是专业人员，或者准备从2D转型到3D的工程师来说，从WebGL的底层API入手更有助于理解3D绘图概念以及计算机图形学。
        WebGL是从`OpenGL ES 2.0`标准发展而来的（OpenGL ES是OpenGL标准的子集，适用于移动平台）。大部分概念是相似的，WebGL在某些接口和操作上进一步做了简化。
        3D相比于2D渲染来说，多了很多概念。如果你之前接触过canvas 2d绘图接口，你会发现2d绘图的接口其实并不多。一个drawImage语句可以胜任大部分场景了。至于矢量绘图，一句drawRect便可以画出一个矩形了。这依赖于2d绘图接口隐藏了大部分底层细节，直接把画图命令交给了开发者。也就是说，底层的渲染管线是已经内置好的，你只要告诉它去画就好了。我们管这种内置好了的渲染管线叫做不可编程渲染管线，因为这些对我们来说是黑盒，浏览器自己实现的。而WebGL提供的是可编程渲染管线，说句不好听的，其实就是没有渲染管线，需要我们自己编程实现。换来的好处就是，计算机画图的方式完全是你自己定义的，有极大的灵活性。
        另外，自己实现渲染管线，对于专业人员来说，有助于理解计算机到底是怎么绘图的，也就是计算机图形学。计算机本身并不知道如何去绘制一个图形，从更底层的角度来说，它只能执行类似于在显示器的第n排第m个像素的位置显示白色这样的命令。但并不是说这些都需要我们自己实现。OpenGL本身就是一套开源标准，实现了一定程度的封装，隐藏了关于填充，最优划线，去锯齿，适配不同分辨率屏幕等底层的绘图算法。基于OpenGL，我们能进行三维坐标描点，连线，填充，映射纹理，更高级的甚至于模版，深度剔除这样的功能。基于着色器（shader），能够进行像素级别的图像处理。
        很高深的样子，但是不要怕，在实际应用中，如果不是出于研究与更深层次优化的目的，的确没有必要从底层做起。渲染管线很大程度上都是可以通用的，只有shader的定制暴露给开发者就已经很强大了。目前市面上流行的关于WebGL渲染的图像引擎有three.js，PIXI.js，egret等等。它们都做了很好的封装，2d渲染引擎甚至都提供canvas绘图回滚功能。
        本文实现的一款小的WebGL渲染器，并不在实用上见长。而是以一个极简单的面貌，告诉想学习WebGL底层接口的同学们，一个渲染流程是怎么构成的。
        代码中会保留大部分说明性的注释，如果有必要，我会不断优化功能与测试相关的webGL接口，教程也会同步更新。当然主要的说明还是希望保留在代码中供大家去看。注释中的中式英语实在看不懂的话，我会加上中文的...

路线图
--
* ~~text绘制(已完成)~~
* graphics绘制
* ~~屏幕适配策略(已完成)~~
* ~~touch事件(已完成)~~
* ~~滤镜叠加功能(已完成)~~
* ~~遮罩功能(已完成)~~

联系我
--
* 邮箱：shawn0326@163.com
* 微博：[@谢帅shawn](http://weibo.com/shawn0326)

项目地址：
--
* https://coding.net/u/shawn0326/p/webgl-examples/git

测试地址：
--
* http://shawn0326.coding.me/webgl-examples/test
