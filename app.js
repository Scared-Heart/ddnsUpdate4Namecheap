const axios = require('axios')
const xml2js = require('xml2js')
const getIpService = require('./service/getIpService')
const fs = require('fs')
const path = require('path')

console.info('hello ddns4RaspberryPi start=================>')
let oldIp = ''

const config = require('./config/config')

async function main() {
    await getIpService()
    await myTask()
    setInterval(myTask, config.intervalTime)
}
main()



async function myTask() {
    let newIp
    try {
        newIp = await getIpService()
        console.log('getIpService')
        console.log(`new IP :${newIp}`)
        console.info(`旧的ip是${oldIp} 我目前的ip是${newIp}`)
        console.log(`旧的ip是${oldIp} 我目前的ip是${newIp}`)

        if (oldIp !== newIp) {
            console.info(`要去执行更新ip操作,oldIp:${oldIp},newIp:${newIp}`)
            updateMyIp(config)
            oldIp = newIp
        }
    } catch (e) {
        console.error(e.message)
    }


}

async function updateMyIp({
    host,
    domain_name,
    ddns_password
}) {
    const url = `https://dynamicdns.park-your-domain.com/update?host=${host}&domain=${domain_name}&password=${ddns_password}`
    console.info(`更新api的 url:${url}`)
    let response = await axios.get(url)
    console.debug(response.data)
    response = await xml2js.parseStringPromise(response.data)
    console.debug(JSON.stringify(response))
    if (response['interface-response'].ErrCount[0] === '0') {
        console.info('==============>更新成功update Success<===============')
        updateMonitor()
    } else {
        console.error('==============>更新失败update error<===============')
        console.error(response['interface-response'])
    }

}

function updateMonitor() {
    let data = fs.readFileSync(path.join(__dirname, 'monitor.json'))
    data = JSON.parse(data)
    data.successCount++
    fs.writeFileSync(path.join(__dirname, 'monitor.json'), JSON.stringify(data))
}