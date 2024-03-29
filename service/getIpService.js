const validator = require('validator')
const axios = require('axios')


axios.defaults.headers.common['user-agent'] = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36`
axios.defaults.timeout = 5000

// axios.default.header['user-agent']=`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36`
// register your customized function here
// 在这注册自定义方法
const registeredServices = {
    getMyIpFromMyIp,
    getMyIpFromIpConfig,
    getMyIpFromIpInfo,
    getMyIpFromIpCipCC,
    getMyIpFromIpSb
}


let goodFun
async function test() {
    const tasks = []
    const fnList = Object.keys(registeredServices)
    for (let i = 0; i < fnList.length; i++) {
        tasks.push(registeredServices[fnList[i]]())
    }
    return Promise.all(tasks).then(results => {
        console.info(`
        获取ip测试结果为:
        ${fnList}
        ${results}`)

        for (let i = 0; i < results.length; i++) {
            if (results[i] && validator.isIP(results[i], 4)) {
                goodFun = fnList[i]
                console.info(`可用的服务为:${goodFun}`)
                return results[i]
            }
        }
        throw new Error('没有可用的ip查找服务 no available ip search service')

    })

}
module.exports = async () => {
    try {
        console.info(goodFun)
        let result
        if (goodFun && goodFun !== '') {
            result = await registeredServices[goodFun]()
        } else {
            result = await test()
        }
        if (!validator.isIP(result, 4)) {
            throw new Error('ip格式不正确 重试')
        }
        return result

    } catch (e) {
        console.error(`获取ip发生异常 ${e.message}`)
        goodFun = ''
        throw new Error(`获取ip发生异常 ${e.message}`)
    }

}


async function getMyIpFromIpConfig() {
    try {
        const {
            data
        } = await axios.get('http://ipconfig.me/ip')
        return data
    } catch (err) {
        console.error(`getMyIpFromIpConfig:  ${err.message}`)
        return false
    }
}

async function getMyIpFromIpInfo() {
    try {
        const {
            data
        } = await axios.get('http://ipinfo.io/json')
        return data.ip
    } catch (err) {
        console.error(`getMyIpFromIpInfo:  ${err.message}`)
        return false

    }
}

async function getMyIpFromIpCipCC() {
    try {
        const {
            data
        } = await axios.get('http://ip.cip.cc/')
        return data.replace(/\n/, '')
    } catch (err) {
        console.error(`getMyIpFromIpConfig:  ${err.message}`)
        return false
    }


}
async function getMyIpFromIpSb() {
    try {
        const {
            data
        } = await axios.get('https://api.ip.sb/ip')
        return data.replace(/\n/, '')
    } catch (err) {
        console.error(`getMyIpFromIpSb:  ${err.message}`)
        return false
    }


}
async function getMyIpFromMyIp() {
    try {
        const {
            data
        } = await axios.get('http://myip.ipip.net/ip')
        return data.ip
    } catch (err) {
        console.error(`getMyIpFromMyIp:  ${err.message}`)
        return false
    }
}