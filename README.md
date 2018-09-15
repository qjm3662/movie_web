> ## 部署说明

- 首先获取代码到本地
    ``` bash
    git clone https://github.com/SunnyQjm/movie_web.git
    ```

- 在项目根目录下执行下面代码依赖库
    ``` bash
    npm install
    ```

- 运行
    ``` bash
    npm start
    ```



> ## 关于build失败的问题
> build过程中由于代码对es6支持的问题，有些库如果是用es6写的，就会导致无法识别。（当然在项目里面是可以使用es6语法的）

- 下面是一个可以在线将es6代码转es5的网站

    [http://google.github.io/traceur-compiler/demo/repl.html#](http://google.github.io/traceur-compiler/demo/repl.html#)

- 本项目目前存在问题的库有三个，分别是: *simple-get*, *junk* 和 *pretty-bytes*
    => 在项目的 `node_moudules` 文件夹下找到这三个的 `index.js` 文件，利用上面的在线转换库转换，将转换后的代码贴回去即可