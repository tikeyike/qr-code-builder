'use strict'

const OneBlink = require('@oneblink/sdk')
const QRCode = require('qrcode')

const opts = {
  width: 256,
  margin: 2,
}

module.exports.post = async function (req, res) {
  const formUrl = req.body.submission.formUrl
  const repeatableSet = req.body.submission.elements

  let url = formUrl + '?preFillData={'
  repeatableSet.map((elem) => (url += `"${elem.elementName}":"${elem.value}",`))
  url = url.slice(0, -1)
  url += '}'

  const generatedURI = await QRCode.toDataURL(url, opts)

  let elements = []
  const qrcode = OneBlink.Forms.generateFormElement({
    type: 'image',
    name: 'qrcode',
    label: 'qrcode',
    defaultValue: generatedURI,
  })
  elements.push(qrcode)

  const generatedUrl = OneBlink.Forms.generateFormElement({
    type: 'html',
    name: 'generatedUrl',
    label: 'generatedUrl',
    defaultValue: url,
  })
  elements.push(generatedUrl)

  return res.setStatusCode(200).setPayload(elements)
}
