# 适用于namecheap的ddns脚本
* forRaspberryPi
* require node environment
* 自动更新dns解析到你部署机器的ip地址


```
npm install
```
config your info in config/config.js
然后在config/config.js中配置好个人的域名 password等信息

start app
启动 应用
```

npm run start
```

* **支持自定义获取ip服务** support you to customize getIp service
    ```
        1. 在service/getIpService.js中新增方法 格式如下   
            async yourFunctionName(){
                try{
                    //如果成功直接返回ip地址
                    //if success ,return the ip
                    const ipAddress =  await axios.get(url)
                    return ipAddress
                }catch(e){
                    logger.error(e.message)
                    // 失败直接返回false
                    // if failed return false
                    return false
                }
            }
            
        2. 在对象registeredServices中注册你的方法名
    ```
* 推荐使用PM2作为守护进程启动/recommend user use pm2 as a daemon to start the project
    ```
    npm i pm2 -g
    pm2 start app.js
    ```