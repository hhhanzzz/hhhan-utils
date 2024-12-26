"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Base64 = Base64;
exports.CryptoTransform = CryptoTransform;
exports.HexToBase64 = HexToBase64;
exports.HmacSHA = HmacSHA;
exports.MD5 = MD5;
exports.RSA = RSA;
exports.SHA = SHA;
exports.SHA1withRSA = SHA1withRSA;
var _cryptoJs = _interopRequireDefault(require("crypto-js"));
var _crypto = require("crypto");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// src/encrypt/index.js

function MD5(data, type = 0) {
  switch (type) {
    case 0:
      data = _cryptoJs.default.MD5(data).toString().toLowerCase();
      break;
    case 1:
      data = _cryptoJs.default.MD5(data).toString().toUpperCase();
      break;
    case 2:
      data = _cryptoJs.default.MD5(data).toString().substring(8, 24).toLowerCase();
      break;
    case 3:
      data = _cryptoJs.default.MD5(data).toString().substring(8, 24).toUpperCase();
      break;
  }
  return data;
}
function SHA(method, data, type = 0) {
  const hash = _cryptoJs.default[method](data);
  return type === 0 ? hash.toString() : hash.toString(_cryptoJs.default.enc.Base64);
}
function HmacSHA(method, data, key, type = 0) {
  const hash = _cryptoJs.default[method](data, key);
  return type === 0 ? hash.toString() : hash.toString(_cryptoJs.default.enc.Base64);
}

// 0 表示编码，1 表示解码
function Base64(type, data) {
  return type === 0 ? _cryptoJs.default.enc.Base64.stringify(_cryptoJs.default.enc.Utf8.parse(data)) : _cryptoJs.default.enc.Utf8.stringify(_cryptoJs.default.enc.Base64.parse(data));
}
function CryptoTransform(type, method, mode, padding, data, key, iv) {
  const options = {
    iv: _cryptoJs.default.enc.Utf8.parse(iv),
    mode: _cryptoJs.default.mode[mode],
    padding: _cryptoJs.default.pad[padding]
  };
  return type === 0 ? _cryptoJs.default[method].encrypt(_cryptoJs.default.enc.Utf8.parse(data), _cryptoJs.default.enc.Utf8.parse(key), options).toString() : _cryptoJs.default[method].decrypt(data, _cryptoJs.default.enc.Utf8.parse(key), options).toString(_cryptoJs.default.enc.Utf8);
}

/**
 * 使用 RSA 公钥加密数据
 * @param {string} data - 需要加密的数据
 * @param {string} publicKey - RSA 公钥
 * @returns {string} 加密后的 Base64 字符串
 */
function RSA(data, publicKey) {
  const bufferData = Buffer.from(data, 'utf8');
  const encrypted = (0, _crypto.publicEncrypt)({
    key: `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, bufferData);
  return encrypted.toString('base64');
}

/**
 * 使用 SHA1withRSA 签名
 * @param {string} data - 需要签名的数据
 * @param {string} privateKey - RSA 私钥字符串
 * @returns {string} Base64 编码的签名结果
 */
function SHA1withRSA(data, privateKey) {
  const sign = (0, _crypto.createSign)('SHA1'); // 创建一个签名对象，使用 SHA1 哈希算法
  sign.update(data); // 将数据传入签名对象
  const signature = sign.sign(privateKey, 'base64'); // 使用 RSA 私钥进行签名，并返回 Base64 编码的签名
  return signature; // 返回签名结果
}
function HexToBase64(hex) {
  const bytes = new Uint8Array(hex.match(/.{2}/g).map(byte => parseInt(byte, 16)));
  return btoa(String.fromCharCode(...bytes));
}