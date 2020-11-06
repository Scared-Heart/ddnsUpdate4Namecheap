const xml2js = require('xml2js')
const str = `<?xml version="1.0"?><interface-response><Command>SETDNSHOST</Command><Language>eng</Language><IP>47.89.83.13</IP><ErrCount>0</ErrCount><ResponseCount>0</ResponseCount><Done>true</Done><debug><![CDATA[]]></debug></interface-response>`
const err = `<?xml version="1.0"?><interface-response><Command>SETDNSHOST</Command><Language>eng</Language><ErrCount>1</ErrCount><errors><Err1>Domain name not found</Err1></errors><ResponseCount>1</ResponseCount><responses><response><ResponseNumber>316153</ResponseNumber><ResponseString>Validation error; not found; domain name(s)</ResponseString></response></responses><Done>true</Done><debug><![CDATA[]]></debug></interface-response>`
xml2js.parseStringPromise(str).then(data=>{
    console.log(data)
}).catch(err=>{
    console.log(err)
})