const axios = require('axios')
const xml2js = require('xml2js')
const log4js = require('log4js');
log4js.configure(require('./config/logConfig'));
const logger = log4js.getLogger()
const getIpService = require('./service/getIpService')


logger.info('hello ddns4RaspberryPi start=================>')
let oldIp = ''
const config = require('./config/config')

async function main() {
    await getIpService()
    setInterval(myTask, config.intervalTime)
}
main()



async function myTask() {
    const newIp = await getIpService()
    logger.info(`旧的ip是${oldIp} 我目前的ip是${newIp}`)

    if (oldIp !== newIp || oldIp === '') {
        logger.info(`要去执行更新ip操作,oldIp:${oldIp},newIp:${newIp}`)
        updateMyIp(config)
        oldIp = newIp
    }

}

async function updateMyIp({
    host,
    domain_name,
    ddns_password
}) {
    const url = `https://dynamicdns.park-your-domain.com/update?host=${host}&domain=${domain_name}&password=${ddns_password}`
    logger.info(`更新api的 url:${url}`)
    let response = await axios.get(url)
    logger.debug(response.data)
    response = await xml2js.parseStringPromise(response.data)
    logger.debug(JSON.stringify(response))
    if (response['interface-response'].ErrCount[0] === '0') {
        logger.info('==============>更新成功update Success<===============')
    } else {
        logger.error('==============>更新失败update error<===============')
        logger.error(response['interface-response'])
    }

}