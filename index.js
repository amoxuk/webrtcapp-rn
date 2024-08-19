/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
// var CRC32 = require('crc-32');               // uncomment this line if in node
// var CryptoJS = require("crypto-js");
// import JSEncrypt from 'jsencrypt'

//
// const enc_des = (url) => {
//   var key = Math.random().toString(36).substring(2, 10);
//
//   var keyHex = CryptoJS.enc.Utf8.parse(key);
//   var encryptedObj = CryptoJS.DES.encrypt(url, keyHex, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7
//   });
//   var encrypted = encryptedObj.ciphertext.toString()
//   console.log('des', encrypted)
//   return key, encrypted
// }
// const enc_crc = (url) => {
//   var encrypted = CRC32.str(url)
//   console.log('crc', encrypted)
//   return encrypted
// }
// const enc_rsa = (url) => {
//   const pubKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1QQRl0HlrVv6kGqhgonD6A9SU6ZJpnEN+Q0blT/ue6Ndt97WRfxtSAs0QoquTreaDtfC4RRX4o+CU6BTuHLUm+eSvxZS9TzbwoYZq7ObbQAZAY+SYDgAA5PHf1wNN20dGMFFgVS/y0ZWvv1UNa2laEz0I8Vmr5ZlzIn88GkmSiQIDAQAB-----END PUBLIC KEY-----'
//   var encryptor = new JSEncrypt()
//   encryptor.setPublicKey(pubKey)//设置公钥
//   var encrypted = encryptor.encrypt(url)
//   console.info(encrypted);
//   return encrypted
// }
// const encryptData = (data) => {
//   var key, desData = enc_des(data)
//   var crcData = enc_crc(desData)
//   var rsaData = enc_rsa(`${key}${crcData.length}|${crcData}|`)
//   console.log('rsa ', rsaData);
//   return rsaData
// }
// // return encrypted.ciphertext.toString();
//
//
// // 存储原始的open方法
// const originalOpen = XMLHttpRequest.prototype.open;
// // 存储原始的send方法
// const originalSend = XMLHttpRequest.prototype.send;
//
// // 覆盖open方法
// XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
//   // 在这里可以对请求进行监控，例如打印请求的URL和方法
//   console.log(`Intercepted request to url: ${url} with method: ${method}`);
//   var data = encryptData(url)
//   // 调用原始的open方法
//   return originalOpen.apply(this, arguments);
// };
//
// // 覆盖send方法
// XMLHttpRequest.prototype.send = function (body) {
//   // 在这里可以对请求体进行监控或修改
//   console.log(`Intercepted request body: ${body} this ${this}`);
//   var data = encryptData(body)
//   // 在发送请求之前，可以添加事件监听器来监控响应
//   this.addEventListener('load', function () {
//     // 在这里可以监控响应数据
//     // console.log(`Intercepted response: ${this.responseText}`);
//   });
//
//   // 调用原始的send方法
//   return originalSend.apply(this, arguments);
// };

AppRegistry.registerComponent(appName, () => App);


