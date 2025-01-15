// src/encrypt/index.js

import CryptoJS from 'crypto-js'
import { publicEncrypt, createSign } from 'crypto'

function MD5(data, type = 0) {
  switch (type) {
    case 0:
      data = CryptoJS.MD5(data).toString().toLowerCase()
      break
    case 1:
      data = CryptoJS.MD5(data).toString().toUpperCase()
      break
    case 2:
      data = CryptoJS.MD5(data).toString().substring(8, 24).toLowerCase()
      break
    case 3:
      data = CryptoJS.MD5(data).toString().substring(8, 24).toUpperCase()
      break
  }
  return data
}

function SHA(method, data, type = 0) {
  const hash = CryptoJS[method](data)
  return type === 0 ? hash.toString() : hash.toString(CryptoJS.enc.Base64)
}

function HmacSHA(method, data, key, type = 0) {
  const hash = CryptoJS[method](data, key)
  return type === 0 ? hash.toString() : hash.toString(CryptoJS.enc.Base64)
}

// 0 表示编码，1 表示解码
function Base64(type, data) {
  return type === 0
    ? CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data))
    : CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data))
}

function CryptoTransform(type, method, mode, padding, data, key, iv) {
  const options = {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode[mode],
    padding: CryptoJS.pad[padding],
  }

  switch (type) {
    case 0:
      const encrypted = CryptoJS[method].encrypt(CryptoJS.enc.Utf8.parse(data), CryptoJS.enc.Utf8.parse(key), options)
      return encrypted.toString()
    case 1:
      const decrypted = CryptoJS[method].decrypt(data, CryptoJS.enc.Utf8.parse(key), options)
      return decrypted.toString(CryptoJS.enc.Utf8)
    case 'base64':
      const ciphertext = CryptoJS[method].encrypt(CryptoJS.enc.Utf8.parse(data), CryptoJS.enc.Utf8.parse(key), options).ciphertext
      return CryptoJS.enc.Base64.stringify(ciphertext)
  }
}

/**
 * 使用 RSA 公钥加密数据
 * @param {string} data - 需要加密的数据
 * @param {string} publicKey - RSA 公钥
 * @returns {string} 加密后的 Base64 字符串
 */
function RSA(data, publicKey) {
  const bufferData = Buffer.from(data, 'utf8')
  const encrypted = publicEncrypt(
    {
      key: `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    bufferData
  )

  return encrypted.toString('base64')
}

/**
 * 使用 SHA1withRSA 签名
 * @param {string} data - 需要签名的数据
 * @param {string} privateKey - RSA 私钥字符串
 * @returns {string} Base64 编码的签名结果
 */
function SHA1withRSA(data, privateKey) {
  const sign = createSign('SHA1') // 创建一个签名对象，使用 SHA1 哈希算法
  sign.update(data) // 将数据传入签名对象
  const signature = sign.sign(privateKey, 'base64') // 使用 RSA 私钥进行签名，并返回 Base64 编码的签名
  return signature // 返回签名结果
}

function HexToBase64(hex) {
  const bytes = new Uint8Array(
    hex.match(/.{2}/g).map((byte) => parseInt(byte, 16))
  )
  return btoa(String.fromCharCode(...bytes))
}

export {
  MD5,
  SHA,
  HmacSHA,
  Base64,
  CryptoTransform,
  RSA,
  SHA1withRSA,
  HexToBase64,
}