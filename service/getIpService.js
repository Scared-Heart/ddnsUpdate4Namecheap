const axios = require('axios')
const log4js = require('log4js');
log4js.configure(require('../config/logConfig'));
const logger = log4js.getLogger()


// register your customized function here
// 在这注册自定义方法
const registeredServices = {
    getMyIpFromIpConfig,
    getMyIpFromIpInfo,
    getMyIpFromIpCipCC
}


let goodFun
async function test() {
    const tasks = []
    const fnList = Object.keys(registeredServices)
    for (let i = 0; i < fnList.length; i++) {
        tasks.push(registeredServices[fnList[i]]())
    }
    return Promise.all(tasks).then(results => {
        for (let i = 0; i < results.length; i++) {
            console.log(results)
            if (results[i] && results[i].length > 0) {
                goodFun = fnList[i]
                console.log(goodFun)
                logger.info(`可用的服务为:${goodFun}`)
                return results[i]
            }
        }
        throw new Error('没有可用的ip查找服务 no available ip search service')

    })

}
module.exports = async () => {
    try {
        if (goodFun && goodFun !== '') {
            return await registeredServices[goodFun]()
        } else {
            let result = await test()
            return result
        }
    } catch (e) {
        logger.error(e.message)
        goodFun = ''

    }

}


async function getMyIpFromIpConfig() {
    try {
        const {
            data
        } = await axios.get('http://ipconfig.me/ip')
        return data
    } catch (err) {
        logger.error(`getMyIpFromIpConfig:  ${err.message}`)
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
        logger.error(`getMyIpFromIpInfo:  ${err.message}`)
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
        logger.error(`getMyIpFromIpConfig:  ${err.message}`)
        return false
    }


}