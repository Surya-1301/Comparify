
const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
chromium.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

// Blinkit cookies for authenticated session (location: lat 28.465204, lon 77.06159, Gurugram Sector 30)
const BLINKIT_COOKIES = [
  { name: 'gr_1_lon', value: '77.06159', domain: 'blinkit.com', path: '/' },
  { name: 'gr_1_lat', value: '28.465204', domain: 'blinkit.com', path: '/' },
  { name: 'gr_1_landmark', value: 'B62%2C%20Pocket%20B%2C%20South%20City%20I%2C%20Sector%2030%2C%20Gurugram%2C%20Haryana%20122001%2C%20India', domain: 'blinkit.com', path: '/' },
  { name: '__cf_bm', value: 'xLez30.okQwaSjBAFAPG4l.MsbCPqaXI9Wd6l.dYwJE-1782319977.2870398-1.0.1.1-xoMb4OXKLbx5mDWWP9s0ULMdbf5XzIahN3bhxfPuRPiaGhlYaeD7YqITxERdszEMHQiyHx2Rv0.HhmG1QvNA3DYPfKtq88OjI3yxVsdokzQfUyuKDfVjoX7eJn0MceSU', domain: '.blinkit.com', path: '/', secure: true, httpOnly: true },
  { name: '_cfuvid', value: '6TxGhjar_r3i9vtHJlZS._7IZRXeBh1cQumpJJZrO5Y-1782319977.2870398-1.0.1.1-8Rvr0s_pgBmdFLycBhwFisn4pHB1JCQSR4Qj9C7c9Fs', domain: '.blinkit.com', path: '/', secure: true, httpOnly: true },
  { name: 'city', value: '', domain: '.blinkit.com', path: '/' },
  { name: 'gr_1_accessToken', value: 'v2%3A%3Ad951c274-3404-4333-a140-864425f803bd', domain: 'blinkit.com', path: '/' },
  { name: 'gr_1_deviceId', value: 'acff418c-683e-4533-9ae0-9d94f34cdb0d', domain: 'blinkit.com', path: '/' },
  { name: 'gr_1_locality', value: '1849', domain: 'blinkit.com', path: '/' },
];

// Zepto cookies for authenticated session
const ZEPTO_COOKIES = [
  { name: 'pwa', value: 'false', domain: 'www.zepto.com', path: '/' },
  { name: 'session_count', value: '1', domain: 'www.zepto.com', path: '/' },
  { name: 'serviceability', value: '%7B%22timeSaved%22%3A1782320096011%7D', domain: 'www.zepto.com', path: '/' },
  { name: 'zeptoPassDetails', value: 'false', domain: 'www.zepto.com', path: '/' },
  { name: 'session_id', value: 'bcde4ac1-34d7-49e4-814b-b55b0e74cbd1', domain: 'www.zepto.com', path: '/' },
  { name: 'XSRF-TOKEN', value: 'Lq9CtSX9iBfhT5WZxBuyG%3A_em_Y0216H2l2pMpcMoakL14klo.TSt6p9dSJCwzZsklVphAJM%2BH3%2FP9WVRitzXc7l2VNvY', domain: 'www.zepto.com', path: '/' },
  { name: 'device_id', value: '713d77c2-f98a-43c1-b222-7ad439e7f7f4', domain: 'www.zepto.com', path: '/' },
  { name: 'accessToken', value: 'eyJhbGciOiJIUzUxMiJ9.eyJ2ZXJzaW9uIjoxLCJzdWIiOiI1NzIzODQxNC1mOTZmLTRkMjAtOTJkYy0wN2EzYTkyYTg5ODIiLCJpYXQiOjE3ODIzMjAwOTMsImV4cCI6MTc4MjMyMzY5M30.ngxVae6eqISZJBYewbxFqe4PDAM9Y7N5Nybj49pLw9RxvVYbYsQYS_GfmR6wBKGZWzOZVyu1YGGXH_y7OzzRXQ', domain: '.zepto.com', path: '/', secure: true, httpOnly: true },
  { name: 'csrfSecret', value: 'GXNma9f6Yeo', domain: 'www.zepto.com', path: '/' },
  { name: 'isAuth', value: 'true', domain: '.zepto.com', path: '/' },
  { name: 'marketplace', value: 'SUPER_SAVER', domain: 'www.zepto.com', path: '/', secure: true },
  { name: 'refreshToken', value: '45f5a829-cc57-43a2-888c-e04a761fb234', domain: '.zepto.com', path: '/', secure: true, httpOnly: true },
  { name: 'unique_browser_id', value: '8989500479158401', domain: 'www.zepto.com', path: '/' },
  { name: 'user_id', value: '57238414-f96f-4d20-92dc-07a3a92a8982', domain: '.zepto.com', path: '/' },
];

// BigBasket cookies for authenticated session
const BIGBASKET_COOKIES = [
  { name: 'csurftoken', value: 'PjYtTw.MTE5OTcwMzQ1NjkzODUxNjIwNg==.1782313990084.uLBY72u5wwSzEa9zwhLUJfEicDFf9sljSp0NCpCdsiw=', domain: '.bigbasket.com', path: '/', secure: true },
  { name: '_bb_bb2.0', value: '1', domain: '.bigbasket.com', path: '/' },
  { name: 'sessionid', value: 'fgi8fgaz73ofv6ilma2elz6008nfd1vm', domain: '.bigbasket.com', path: '/', secure: true, httpOnly: true },
  { name: 'is_global', value: '0', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_mid', value: '"MzA5MjQwODUxNg=="', domain: '.bigbasket.com', path: '/', secure: true },
  { name: 'jarvis-id', value: 'd1ac4f68-9b4d-4a5a-a51e-9aa108551005', domain: 'www.bigbasket.com', path: '/', secure: true },
  { name: '_bb_addressinfo', value: '', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_visaddr', value: '', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_aid', value: '"Mjg3NTk0Mzc1NA=="', domain: '.bigbasket.com', path: '/', secure: true },
  { name: 'xentrycontext', value: 'bbnow', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_loid', value: '', domain: '.bigbasket.com', path: '/' },
  { name: 'bb2_enabled', value: 'true', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_dsevid', value: '7427', domain: '.bigbasket.com', path: '/' },
  { name: 'bigbasket.com', value: '74be8c6a-b363-4874-90f6-f73c77f26489', domain: '.bigbasket.com', path: '/' },
  { name: 'x-channel', value: 'web', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_locSrc', value: 'default', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_bhid', value: '', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_dsid', value: '7427', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_cda_sa_info', value: 'djIuY2RhX3NhLjEwLjE3NTc2LDMwNzUy', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_cid', value: '31', domain: '.bigbasket.com', path: '/', secure: true },
  { name: '_bb_nhid', value: '7427', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_pin_code', value: '', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_sa_ids', value: '17576,30752', domain: '.bigbasket.com', path: '/' },
  { name: '_bb_vid', value: 'MTE5OTcwMzQ1NjkzODUxNjIwNg==', domain: '.bigbasket.com', path: '/' },
  { name: '_is_bb1.0_supported', value: '0', domain: '.bigbasket.com', path: '/' },
  { name: '_is_tobacco_enabled', value: '1', domain: '.bigbasket.com', path: '/' },
  { name: 'access_token', value: '054a7783-9e9d-427e-ae96-8b93480822d1', domain: 'www.bigbasket.com', path: '/' },
  { name: 'BBAUTHTOKEN', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFmZiI6IjdEd3FRZWJGelRSb1lnIiwidGltZSI6MTc4MjMxNDAzMS45ODA2MTM3LCJtaWQiOjU5OTI1NTQ2LCJ2aWQiOjExOTk3MDM0NTk0Njc2NzgyMDgsImRldmljZV9pZCI6IldFQiIsInNvdXJjZV9pZCI6MSwiZWNfbGlzdCI6WzMsNCwxMCwxMiwxMywxNCwxNSwxNiwxNywyMCwyNywyOCwzMCwxMDBdLCJURExUT0tFTiI6IjA1NGE3NzgzLTllOWQtNDI3ZS1hZTk2LThiOTM0ODA4MjJkMSIsInJlZnJlc2hfdG9rZW4iOiI5M2NmZWZmMS00YzNhLTRkMDEtYjZlMS1hM2U0MDcyOGVjZjgiLCJ0ZGxfZXhwaXJ5IjoxNzgyOTE4ODMwLCJleHAiOjE3OTgwOTQwMzEsImlzX3NhZSI6bnVsbCwiZGV2aWNlX21vZGVsIjoiV0VCIiwiZGV2aWNlX2lzX2RlYnVnIjoiZmFsc2UiLCJpc19pbnRlcm5hbF91c2VyIjpmYWxzZX0.gpFlE7qLEDoDpNyj2fI_eNnZF0fJWi5PhsVJIRvfOoE', domain: '.bigbasket.com', path: '/', secure: true, httpOnly: true },
  { name: 'csrftoken', value: 'rOhKBIeEpaviopRKfA18p40kqcurYmPtZVaGUjnK5JQbvojJKGCRV1wEFU4Bm1XM', domain: 'www.bigbasket.com', path: '/' },
  { name: 'customer_hash', value: '917ec32034abb582279370e9348a8c8b', domain: '.bigbasket.com', path: '/', secure: true },
  { name: 'is_integrated_sa', value: '1', domain: '.bigbasket.com', path: '/' },
  { name: 'is_subscribe_sa', value: '0', domain: '.bigbasket.com', path: '/' },
  { name: 'isintegratedsa', value: 'true', domain: '.bigbasket.com', path: '/' },
  { name: 'jentrycontextid', value: '10', domain: '.bigbasket.com', path: '/' },
  { name: 'ts', value: '2026-06-24%2020:45:00.208', domain: '.bigbasket.com', path: '/', secure: true },
  { name: 'xentrycontextid', value: '10', domain: '.bigbasket.com', path: '/' }
];

// Swiggy Instamart cookies for authenticated session
const SWIGGY_COOKIES = [
  { name: '__SW', value: 'xQu052Wfe_wapycfLvFd9j4O-0sPM6PV', domain: 'www.swiggy.com', path: '/', secure: true, httpOnly: true },
  { name: '_session_tid', value: 'f3e95fbf7453de1e5059a3146c16f1e57f9ef584e86927d88d068c89e6a34e84b7816ee8746053383d7efa39b7344a0ff7e089ddd0f7f4225a6fc4c2d80406669a64bea07c4287fba0a03486184314d75698395d2f996731bd050b462f00fe65fa6993e3fd142a9736d606554ee4ef284e784d0a5f45b244aba035e31bcea60d5d8d4dd1c6ec069c545d68c34d30c1b6e96f9a68c1c5447c5edbe96781990e2129721af3d0820ed9a439e20088c3fe19d781e84b10476e2f034330b5763ae7360ebc04091961cc364961a5662e1c01b930d834a69f4fa89f285950d984fc1f3a0050592fc7fe7ec60355484c0ae1dddf352ec612a8b59ab0de0441e4a01d99f964a0bbafdd1c2b3b8373b498f5afdf27f6e9c3d42aac6b55b749bc2ff47220ec2f3679752c688f7593589d34520f394b3ed1641fb86fa3f05db66c801911651c225a6fa8cd8667ddb7875c292e3a9723d47cfde19af4ebf5ce7156434c073d23ce7ea4d22ca24defeeae70eddaede923bad83973a976c4676aea221252426011008188f4d39d8c9de765ea25f4645f8b07af1b2812ab73d4405f0be3757481ab76c64671f400f36d8f5ea65b7cd1eb770bab76fa3fffce12cbcff26c52dde24804e9a32112348c8cf1e16d2687548c24cfdc07dfd957c34c194af8c3df8b50cd51b267ca4bce106afbf6388a01717d28af91d32f53d09b3913535f736ecb3657a9b57bf2a2dcdc75817df3672c5291085af5ae6f5b3ef41a133f72c4313cc1153201e9f4eb58e2f3b66948e0d822ac7afae17b7ceac2a2a89598297625646342bb54f51540998bcde39839dac7bfe006b63467a8ee4736568001ed93d31b3051f0b145f74ba249b6078790ad4a7faf6502c066d29e0a0a68f57b54b01aee8170a1dcd89cacb8b7f71e3c583cbe1ba6a042787a557ece4d41ba8c97fbb89f6ce3661548b8fc9904f8989a5b9ce168772890b954ab2ccadb567cd323a535d087efbde73536259af57e3691f70d237f44de37ee843abcf24ce60216dc6133498a11cdd75a05229307266cc37aae8bbf3d8a', domain: '.www.swiggy.com', path: '/', secure: true, httpOnly: true },
  { name: 'ally-on', value: 'false', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'versionCode', value: '1200', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'strId', value: '', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'genieTrackOn', value: 'false', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'sid', value: 's%3As3w54e8c05e-c667-44b1-8cef-04552a90f.GDLDeLuOiuaHQUVSUZjySsioSVfwJHYadRa4a9pjjCQ', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'deviceId', value: 's%3Ad8c43fae-e71a-4eae-a63c-c14c0cd00f36.XlrA%2BsfKULFNCmFpQoSqynt48BL8Oq8m69WaIeSsxtE', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'isNative', value: 'false', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: '_device_id', value: 'a3ae3fbb-04b7-0333-3ed3-f0b07ac2aec3', domain: '.www.swiggy.com', path: '/', secure: true, httpOnly: true },
  { name: '_sid', value: 's3w77a978e8-d260-4ac9-8be5-63bf05d42', domain: '.www.swiggy.com', path: '/', secure: true, httpOnly: true },
  { name: '_is_logged_in', value: '1', domain: '.www.swiggy.com', path: '/', secure: true },
  { name: 'aws-waf-token', value: '3ca05146-ea0b-4ffe-b65d-9f2148b7cbea:BQoAczVqFakkAAAA:f0/tiTMAAe1fbWL+g0mDUVOv6t4xjjKGbx10ccH2pgPkfyIaBXc0K867B3NrKDzrdv6xIlaK4UBu0GdRZvRvw2yAfot8U7Z5dAABJwre0smiRTIHHY99xZY774cbZCDUrRUrX2GTgIPz8oBI6fjcg76hCh1xgaGYrh1JikenPAoRrMVnzWbyBMxM7Nkc8qypfA==', domain: '.www.swiggy.com', path: '/', secure: true },
  { name: 'bottomOffset', value: '0', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'fontsLoaded', value: '1', domain: 'www.swiggy.com', path: '/' },
  { name: 'openIMHP', value: 'false', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'platform', value: 'web', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'statusBarHeight', value: '0', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'subplatform', value: 'dweb', domain: 'www.swiggy.com', path: '/', httpOnly: true },
  { name: 'tid', value: 'eyJLSUQiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiJlMTJmYmE5Ny0xMzliLTQ1NDItOWY1MS1mZWQ1YTAxYjc1NDIiLCJ1c2VyX2lkIjoiMTk1MTgxMDk0Iiwic2Vzc2lvbl9kYXRhIjoiWWd6YXRNS3lTN2xNbmNHdnhMQWZ6OHM0bXVTajlYMjNVdmpsYUc4bWtsMFNmS0RGeTZxbURCdkwrNTRFanlvWHptaGlMMktqaHVFeFZjd2EyclFBNGdId09LUTlHR2tBd09walp4M3RDVUJ1NWFmNlBLQ0NnK1JxNUt5M2RLWXlJUmE4L1BLZFBDZ3dvaUllN3g4WlBVZG5nNGVrQm1kZ3QzYjdxZm1wTVU3UWFHRStDLzlCdUYrL3V1SWU4cHhJamNXNUZSVktJVU1RK3dxUTRadHFrSDc3QUdTeDB2d3ZXc2pJdmZlcEk1bG1BQzdWRVl4cWJvWjh0aFRDRVNaeDRVaUhNTnRkQk1jPSIsInNpZCI6InMzdzc3YTk3OGU4LWQyNjAtNGFjOS04YmU1LTYzYmYwNWQ0MiIsImlhdCI6MTc4MjMxNDMxOCwiZXhwIjoxNzgyMzE2NzE4fQ.iVIG-mssl-B3kLHb2t6Yw5a8qRJ5YLWPExsCFCUG7pM', domain: 'www.swiggy.com', path: '/', secure: true, httpOnly: true }
];

// Flipkart cookies for authenticated session (location: Hyderabad)
const FLIPKART_COOKIES = [
  { name: 'isH2EnabledBandwidth', value: 'true', domain: 'www.flipkart.com', path: '/' },
  { name: 'dpr', value: '2', domain: '.flipkart.com', path: '/' },
  { name: 'h2NetworkBandwidth', value: '9', domain: 'www.flipkart.com', path: '/' },
  { name: 'AMCV_17EB401053DAF4840A490D4C%40AdobeOrg', value: '-227196251%7CMCIDTS%7C20629%7CMCMID%7C47457063727271655738149401116919350969%7CMCAID%7CNONE%7CMCOPTOUT-1782327188s%7CNONE', domain: '.flipkart.com', path: '/' },
  { name: 'T', value: 'TI176486667651000186565394353083957489321025238435342071018947837409', domain: '.flipkart.com', path: '/', secure: true },
  { name: 'vh', value: '807', domain: '.flipkart.com', path: '/' },
  { name: 'S', value: 'd1t17WXw/P0x6Pxs/Yz91Hz90P26AwYXCcoXDuZyWBlYwLPKveVtsSPvD3ko4LdOHQb+jqkERHyTbcIOoUXaDu8SKnQ==', domain: '.flipkart.com', path: '/', secure: true, httpOnly: true },
  { name: 'ud', value: '8.6uH41AnRCPNLlFt7n-PoRh3IFJDejJL7sEsktCkbY6HnFyEwxOZ_tmmmoidgUMtZr9G3d3TJcFMy8bwekERBoR-l93Hy-AJBSb8eJtn73xCqvFKF9JHCvkYo4loxok0iduqpzoNr5NfTVAy81ndaiwFk4giuuAsOTlkFFEOjAYHIGCBhC_kg5EMcCxttlNZAd0wqJi__XS8XgDMtEMobu3W5Q8b4hcZeMmneFb7LlZHf4nfpQxDbZBDIRrsyb15de7ElSTehQgfZvcl2tRvAxAHKmsKOmmIiD5dyIip1Z0G7YUNbdjL7udgYGB5k9f6-1Lrxq_bXvZx16Qlq5tmkn_6SmIS9dgKf1yhLoDqazf0APRjSqYAX8DuEJJxS2uIY2S7PEXXZRauOsk-Tc5dKYArzqho2VbhA8riNBLZVo3TJasRmuStbr3XpB2TsIL_D5FlqPoxKDXjg8ENUt2xeD3Op882OUDJNp_cKl4kiOQ8hYNRULPiTgg6xxBJqxfm1nmGX6S24PGh4k8Sidn9UFqVTl6sR5QozHjDv4eDt106Y8n6QLxZXV1ikdnNe7MwK-K07OVupl70BTw1V2dP9NA', domain: '.flipkart.com', path: '/', secure: true, httpOnly: true },
  { name: 'rt', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNhNzdlZTgxLTRjNWYtNGU5Ni04ZmRlLWM3YWMyYjVlOTA1NSJ9.eyJleHAiOjE3OTgxMzM2ODQsImlhdCI6MTc4MjMyMjQ4NCwiaXNzIjoia2V2bGFyIiwianRpIjoiNjcwOWRhOTMtYjBlMy00Y2Q0LTlmZGItZDZkNjRkZmJhNmE1IiwidHlwZSI6IlJUIiwiZElkIjoiVEkxNzY0ODY2Njc2NTEwMDAxODY1NjUzOTQzNTMwODM5NTc0ODkzMjEwMjUyMzg0MzUzNDIwNzEwMTg5NDc4Mzc0MDkiLCJiSWQiOiJSRDRVRksiLCJrZXZJZCI6IlZJQzA3MDA0NjU3OTFGNEE0MThCMjExM0IzRTlDNzk3NDUiLCJ0SWQiOiJtYXBpIiwibSI6eyJ0eXBlIjoibiJ9LCJ2IjoiVlFORkw1In0.3wnxVv2fG2D7wcVuGCk_CmYXoqfpkI2Yvd5AJAXu45Y', domain: '.flipkart.com', path: '/', secure: true, httpOnly: true },
  { name: 'at', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNhNzdlZTgxLTRjNWYtNGU5Ni04ZmRlLWM3YWMyYjVlOTA1NSJ9.eyJleHAiOjE3ODIzMjQyODQsImlhdCI6MTc4MjMyMjQ4NCwiaXNzIjoia2V2bGFyIiwianRpIjoiNDQ4MzI5YTEtYzYzYy00ZGI1LTgyZjEtYmExOTMyYzNlNjkzIiwidHlwZSI6IkFUIiwiZElkIjoiVEkxNzY0ODY2Njc2NTEwMDAxODY1NjUzOTQzNTMwODM5NTc0ODkzMjEwMjUyMzg0MzUzNDIwNzEwMTg5NDc4Mzc0MDkiLCJiSWQiOiJSRDRVRksiLCJrZXZJZCI6IlZJQzA3MDA0NjU3OTFGNEE0MThCMjExM0IzRTlDNzk3NDUiLCJ0SWQiOiJtYXBpIiwiZWFJZCI6ImM2ZUVkQjVPZnduTWd6T2d5S2pJejNNWm5neTJsZ3p2VUxMUFZJX0RJaHhhZmhJaDlXZVhFZz09IiwidnMiOiJMSSIsInoiOiJIWUQiLCJtIjp0cnVlLCJnZW4iOjN9.4LXWa_g9dR62qioeePvg_YXmSNFlIunpdRLSlFs7S9k', domain: '.flipkart.com', path: '/', secure: true, httpOnly: true },
  { name: 'vw', value: '1470', domain: '.flipkart.com', path: '/' },
  { name: 'K-ACTION', value: 'null', domain: '.flipkart.com', path: '/', httpOnly: true },
  { name: 'ext_name', value: 'ojplmecpdpgccookcobabopnaifgidhf', domain: 'www.flipkart.com', path: '/' },
  { name: 'AMCVS_17EB401053DAF4840A490D4C%40AdobeOrg', value: '1', domain: '.flipkart.com', path: '/' },
  { name: 'SN', value: 'VIC0700465791F4A418B2113B3E9C79745.TOKBA83D82226B847118334FEEBEF701F8C.1782323949647.LI', domain: '.flipkart.com', path: '/', secure: true, httpOnly: true },
  { name: 'ULSN', value: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb29raWUiLCJhdWQiOiJmbGlwa2FydCIsImlzcyI6ImF1dGguZmxpcGthcnQuY29tIiwiY2xhaW1zIjp7ImdlbiI6IjEiLCJ1bmlxdWVJZCI6IlVVSTI2MDYyNDIyMjMzMjU1NkFWWDU3T1oiLCJma0RldiI6bnVsbH0sImV4cCI6MTc5ODEwMDAxMiwiaWF0IjoxNzgyMzIwMDEyLCJqdGkiOiI0YzYwYThmNi05YzI0LTRjNjAtOTRmYy03YzdjYjVlMjdlYzgifQ._FJvCVAFoMoT5gqoP-iTjZ3LALasxhUqSI2UkEaDUcQ', domain: '.flipkart.com', path: '/', secure: true, httpOnly: true },
  { name: 'vd', value: 'VIC0700465791F4A418B2113B3E9C79745-1764867205175-58.1782323949.1782322485.153859926', domain: '.flipkart.com', path: '/', secure: true, httpOnly: true },
];

// JioMart cookies for authenticated session (pincode 201310, city Greater Noida)
const JIOMART_COOKIES = [
  { name: 'anonymous_sig', value: 'eac761f4ee2ebd03b75a773de0cc80b911a23c4309d84b212cd7a880f03a49b7', domain: '.www.jiomart.com', path: '/', secure: true, httpOnly: true },
  { name: 'cra_access_token', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJycmlkIjoiOTE1MGZmM2QtNGVjYS00MzBjLThkYWMtODYzNjI2NmZmODg2IiwiZGV2aWNlX2luZm8iOnsiZGV2aWNlX2ZpbmdlcnByaW50IjoiM2U5NmQ0YTEtYjY2Yi00Zi1leUp3YkdGMFptOXliU0k2Iiwib3NfbmFtZSI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xNDYuMC4wLjAgU2FmYXJpLzUzNy4zNiIsInRpbWVzdGFtcCI6IjIwMjYtMDMtMzFUMTM6NTk6MzAuNDMzWiIsInNvdXJjZV9pZCI6IjU4YzQwNzEwLTRjYTYtNDAxMy04MWNiLWVlNjY5OTUzZTE5MSJ9LCJpYXQiOjE3ODIzMTQxOTgsImV4cCI6MTc4MjkxODk5OCwic2FsdCI6MH0.4-4QBRO_F5xKq6tXEWXpPDzLDqu8z6u9SqY1SM0MuGM', domain: '.jiomart.com', path: '/', secure: true, httpOnly: true },
  { name: 'f.session', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhjZDNiMThlZjkzNzc4ODA5YmNiZDEyIiwiZXh0ZXJuYWxfaWQiOiIxNzAzMTQxNjAiLCJlbWFpbHMiOlt7ImVtYWlsIjoiOTYxNjM5ODMxM0Bub21haWwuamlvbWFydC5jb20iLCJhY3RpdmUiOnRydWUsInByaW1hcnkiOnRydWUsInZlcmlmaWVkIjp0cnVlfV0sInBob25lX251bWJlcnMiOlt7InBob25lIjoiOTYxNjM5ODMxMyIsImNvdW50cnlDb2RlIjo5MSwiYWN0aXZlIjp0cnVlLCJwcmltYXJ5Ijp0cnVlLCJ2ZXJpZmllZCI6dHJ1ZSwicnJpZF9saW5rZWQiOmZhbHNlLCJjb3VudHJ5X2NvZGUiOjkxfV0sImZpcnN0X25hbWUiOiJTaHViaGFtIiwibGFzdF9uYW1lIjoiU2luZ2giLCJoYXNoZWRfcnJfaWQiOiI2NUZGNEEzQTVGQkE4RTUxMTMyM0RBQ0E5RUVGMTE3QUU5MkY2MjYxMzcyRjgzMzAyNzg3N0NDNDRBMTEyNTg3IiwicnJfaWQiOiI5MTUwZmYzZC00ZWNhLTQzMGMtOGRhYy04NjM2MjY2ZmY4ODYiLCJjcmVhdGVkX2F0IjoiMjAyNS0wOS0xOVQxMToxNDozMi4zOTZaIiwiaWF0IjoxNzgyMzE0MjA2LCJleHAiOjE3ODI0MDA2MDZ9.0exbD0A4RmUG763bFhfxLivvmHq_QyE8kx8gaASXOYs', domain: '.www.jiomart.com', path: '/', secure: true, httpOnly: true },
  { name: 'f.session', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhjZDNiMThlZjkzNzc4ODA5YmNiZDEyIiwiZXh0ZXJuYWxfaWQiOiIxNzAzMTQxNjAiLCJlbWFpbHMiOlt7ImVtYWlsIjoiOTYxNjM5ODMxM0Bub21haWwuamlvbWFydC5jb20iLCJhY3RpdmUiOnRydWUsInByaW1hcnkiOnRydWUsInZlcmlmaWVkIjp0cnVlfV0sInBob25lX251bWJlcnMiOlt7InBob25lIjoiOTYxNjM5ODMxMyIsImNvdW50cnlDb2RlIjo5MSwiYWN0aXZlIjp0cnVlLCJwcmltYXJ5Ijp0cnVlLCJ2ZXJpZmllZCI6dHJ1ZSwicnJpZF9saW5rZWQiOmZhbHNlLCJjb3VudHJ5X2NvZGUiOjkxfV0sImZpcnN0X25hbWUiOiJTaHViaGFtIiwibGFzdF9uYW1lIjoiU2luZ2giLCJoYXNoZWRfcnJfaWQiOiI2NUZGNEEzQTVGQkE4RTUxMTMyM0RBQ0E5RUVGMTE3QUU5MkY2MjYxMzcyRjgzMzAyNzg3N0NDNDRBMTEyNTg3IiwicnJfaWQiOiI5MTUwZmYzZC00ZWNhLTQzMGMtOGRhYy04NjM2MjY2ZmY4ODYiLCJjcmVhdGVkX2F0IjoiMjAyNS0wOS0xOVQxMToxNDozMi4zOTZaIiwiaWF0IjoxNzgyMzE0MjA2LCJleHAiOjE3ODI0MDA2MDZ9.0exbD0A4RmUG763bFhfxLivvmHq_QyE8kx8gaASXOYs', domain: '.jiomart.com', path: '/', secure: true, httpOnly: true },
  { name: 'app_location_details', value: '%7B%22country%22%3A%22INDIA%22%2C%22country_iso_code%22%3A%22IN%22%2C%22city%22%3A%22GREATER_NOIDA%22%2C%22pincode%22%3A%22201310%22%2C%22state%22%3A%22UTTAR_PRADESH%22%7D', domain: 'www.jiomart.com', path: '/' },
  { name: 'app_geolocation', value: '%7B%22latitude%22%3A%2228.4739215%22%2C%22longitude%22%3A%2277.50637280000001%22%2C%22polygon_ids%22%3A%5B%22TH86_QC_e455bf81%22%5D%7D', domain: 'www.jiomart.com', path: '/' },
  { name: 'ajs_anonymous_id', value: '196b431c-633a-4c4c-b85d-5d46f6efbbe2', domain: '.jiomart.com', path: '/' },
  { name: 'user_groups', value: 'l1%3A%7Cl2%3A', domain: '.jiomart.com', path: '/' },
  { name: 'new_customer', value: 'false', domain: 'www.jiomart.com', path: '/' },
  { name: '_ALGOLIA', value: 'anonymous-6a31693b-ba34-463e-8aff-008ee7df76f5', domain: 'www.jiomart.com', path: '/' },
  { name: 'AKA_A2', value: 'A', domain: '.jiomart.com', path: '/', secure: true, httpOnly: true },
  { name: 'anonymous_id', value: 'c771623fc25e41fa9ee7d2123dba3333', domain: '.www.jiomart.com', path: '/', secure: true, httpOnly: true },
  { name: 'cra_refresh_token', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJycmlkIjoiOTE1MGZmM2QtNGVjYS00MzBjLThkYWMtODYzNjI2NmZmODg2IiwiZGV2aWNlX2luZm8iOnsiZGV2aWNlX2ZpbmdlcnByaW50IjoiM2U5NmQ0YTEtYjY2Yi00Zi1leUp3YkdGMFptOXliU0k2Iiwib3NfbmFtZSI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xNDYuMC4wLjAgU2FmYXJpLzUzNy4zNiIsInRpbWVzdGFtcCI6IjIwMjYtMDMtMzFUMTM6NTk6MzAuNDMzWiIsInNvdXJjZV9pZCI6IjU4YzQwNzEwLTRjYTYtNDAxMy04MWNiLWVlNjY5OTUzZTE5MSJ9LCJpYXQiOjE3NzQ5NjU1NzAsImV4cCI6MTc5MDUxNzU3MCwic2FsdCI6MH0.yXTNnyI9muqjVwkbECCsn3KfQ-x_ODrXqUVZ2jsIY2w', domain: '.jiomart.com', path: '/', secure: true, httpOnly: true },
  { name: 'old_browser_anonymous_id', value: 'c771623fc25e41fa9ee7d2123dba3333', domain: '.www.jiomart.com', path: '/', secure: true, httpOnly: true }
];

// Utility: allow overriding cookies via JSON in environment (e.g., SCRAPER_COOKIES_BLINKIT='[{"name":"foo","value":"bar","domain":".blinkit.com","path":"/"}]')
function envCookies(envVar) {
  const raw = process.env[envVar];
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (_) {
    return null;
  }
}

function fileCookies(location, provider) {
  if (!location || !location.pincode) return null;
  const fp = path.join(__dirname, 'cookies', 'location', `${location.pincode}.json`);
  if (!fs.existsSync(fp)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray(data[provider])) return data[provider];
  } catch (_) {
    return null;
  }
  return null;
}

function cookiesForProvider(providerDefaults, envVar, location, provider) {
  return envCookies(envVar) || fileCookies(location, provider) || providerDefaults;
}

// Best-effort client-side location setters for providers that need in-page selection
async function setClientLocation(page, provider, location) {
  const pin = location && location.pincode;
  const city = location && location.city;
  const state = location && location.state;
  if (!pin) return;

  try {
    if (provider === 'bigbasket') {
      // BigBasket honors pincode via query and localStorage hints
      await page.goto(`https://www.bigbasket.com/?nc=locationselect&zip=${encodeURIComponent(pin)}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(1500);
      await page.evaluate((p) => {
        try {
          localStorage.setItem('_bb_pin_code', String(p));
          localStorage.setItem('_bb_addressinfo', String(p));
        } catch (e) {}
      }, pin);
    }

    if (provider === 'jiomart') {
      // Set delivery pin/locality hints
      await page.goto(`https://www.jiomart.com/?delivery_pin=${encodeURIComponent(pin)}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(1500);
      await page.evaluate(({ p, c, s }) => {
        try {
          localStorage.setItem('nms_mgo_pincode', String(p));
          if (c) localStorage.setItem('nms_mgo_city', String(c));
          if (s) localStorage.setItem('nms_mgo_state_code', String(s));
        } catch (e) {}
      }, { p: pin, c: city, s: state });
    }

    if (provider === 'flipkart') {
      // Flipkart grocery respects pincode query; also store a hint in localStorage
      await page.goto(`https://www.flipkart.com/grocery-supermart-store?marketplaceGrocery=true&pincode=${encodeURIComponent(pin)}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(1500);
      await page.evaluate((p) => {
        try {
          localStorage.setItem('pincode', String(p));
        } catch (e) {}
      }, pin);
    }
  } catch (err) {
    console.warn(`Location set failed for ${provider}:`, err.message);
  }
}

// Apply user location onto provider cookies when supported
function applyLocationToCookies(cookies, location, provider) {
  if (!location) return cookies;

  const clone = (cookies || []).map(c => ({ ...c }));
  const { pincode, city, state, lat, lon, localityId, landmark } = location;

  for (const c of clone) {
    if (provider === 'blinkit') {
      if (c.name === 'gr_1_lat' && lat) c.value = String(lat);
      if (c.name === 'gr_1_lon' && lon) c.value = String(lon);
      if (c.name === 'gr_1_locality' && localityId) c.value = String(localityId);
      if (c.name === 'gr_1_landmark' && landmark) c.value = String(landmark);
    }

    if (provider === 'zepto') {
      // Reset serviceability cache so Zepto re-fetches based on browser geolocation
      if (c.name === 'serviceability') {
        c.value = encodeURIComponent(JSON.stringify({ timeSaved: 0 }));
      }
    }
  }

  if (provider === 'flipkart' && pincode) {
    // Flipkart Quick uses delivery pincode cookie to determine serviceability zone
    const existing = clone.find(c => c.name === 'fr-delivery-pincode');
    if (existing) {
      existing.value = String(pincode);
    } else {
      clone.push({ name: 'fr-delivery-pincode', value: String(pincode), domain: '.flipkart.com', path: '/' });
    }
  }

  return clone;
}

function parseMinutes(text) {
  if (!text) return null;
  const patterns = [
    /(\d+)\s*(?:-\s*\d+\s*)?(?:min|mins|minutes)/i,  // "10 mins", "10-20 mins"
    /deliver[y\s]+in\s+(\d+)/i,                        // "Delivery in 10"
    /in\s+(\d+)\s+(?:min|mins|minutes)/i,              // "in 10 mins"
    /(\d+)\s*-\s*min/i,                                // "10-min"
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return Number(m[1]);
  }
  // Hours → minutes (e.g. JioMart "2 hrs", "1 hour")
  const hourPatterns = [
    /in\s+(\d+)\s*(?:hr|hrs|hour|hours)/i,
    /(\d+)\s*(?:hr|hrs|hour|hours)/i,
  ];
  for (const p of hourPatterns) {
    const m = text.match(p);
    if (m) return Number(m[1]) * 60;
  }
  return null;
}

function parsePrice(text) {
  if (!text) return null;
  const match = text.match(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/);
  return match ? `₹${match[1].replace(/,/g, '')}` : null;
}

async function withPage(fn, cookies = [], location = null) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    geolocation: location && location.lat && location.lon ? { latitude: Number(location.lat), longitude: Number(location.lon) } : undefined,
    permissions: ['geolocation'],
    extraHTTPHeaders: { 'Accept-Language': 'en-IN,en;q=0.9' }
  });

  const page = await context.newPage();

  if (cookies && cookies.length > 0) {
    await context.addCookies(cookies);
  }

  try {
    return await fn(page);
  } finally {
    await browser.close();
  }
}

async function extractFromPage(page) {
  const bodyText = await page.textContent('body');
  const minutes = parseMinutes(bodyText);
  const price = parsePrice(bodyText);
  return { minutes, price };
}

async function scrapeZepto(location, cookies = cookiesForProvider(ZEPTO_COOKIES, 'SCRAPER_COOKIES_ZEPTO', location, 'zepto')) {
  try {
    const effectiveCookies = applyLocationToCookies(cookies, location, 'zepto');
    return await withPage(async (page) => {
      await page.goto('https://www.zepto.com/', { waitUntil: 'load', timeout: 25000 });
      await page.waitForTimeout(3000);

      // Try to trigger browser geolocation detection when lat/lon is available
      if (location?.lat && location?.lon) {
        const detectBtns = [
          'button:has-text("Detect")',
          'button:has-text("Use my location")',
          'button:has-text("Locate me")',
          '[data-testid*="detect"]',
          '[class*="detect-location"]',
          'text=/detect.*location/i',
          'text=/use.*location/i',
        ];
        for (const btn of detectBtns) {
          try {
            const el = page.locator(btn).first();
            if (await el.isVisible({ timeout: 1500 })) {
              await el.click();
              await page.waitForTimeout(2500);
              break;
            }
          } catch (_) {}
        }
      }

      await page.waitForTimeout(2000);

      const selectors = [
        '[data-testid*="delivery-eta"]',
        '[data-testid*="eta"]',
        '[data-testid*="delivery-time"]',
        '[class*="delivery-time"]',
        '[class*="deliverytime"]',
        '[class*="DeliveryTime"]',
        '[class*="eta"]',
        '[class*="Eta"]',
        '[class*="ETA"]',
        'text=/\\d+\\s*-?\\s*\\d*\\s*min/i',
        'text=/deliver.*\\d+\\s*min/i',
      ];
      for (const sel of selectors) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 2000 })) {
            const text = await el.textContent();
            const mins = parseMinutes(text);
            if (mins) return { minutes: mins, price: null };
          }
        } catch (_) {}
      }
      return extractFromPage(page);
    }, effectiveCookies, location);
  } catch (err) {
    console.error('Zepto scrape error', err.message);
    return { minutes: null, price: null };
  }
}

async function scrapeBlinkit(location, cookies = cookiesForProvider(BLINKIT_COOKIES, 'SCRAPER_COOKIES_BLINKIT', location, 'blinkit')) {
  try {
    const effectiveCookies = applyLocationToCookies(cookies, location, 'blinkit');
    return await withPage(async (page) => {
      await page.goto('https://www.blinkit.com/', { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(3000);

      const deliverySelectors = [
        // Blinkit shows delivery time in a small badge in the top nav area
        '[class*="TimerContainer"] span',
        '[class*="timer"] span',
        '[class*="delivery-time"]',
        '[data-testid="delivery-time"]',
        '[data-testid*="delivery"]',
        'text=/\\d+\\s*min/i',
        '[class*="deliver"]',
      ];

      let minutes = null;
      for (const selector of deliverySelectors) {
        try {
          const el = page.locator(selector).first();
          if (await el.isVisible({ timeout: 2000 })) {
            const text = await el.textContent();
            minutes = parseMinutes(text);
            if (minutes) break;
          }
        } catch (e) {}
      }

      if (!minutes) {
        const result = await extractFromPage(page);
        minutes = result.minutes;
      }

      return { minutes, price: null };
    }, effectiveCookies, location);
  } catch (err) {
    console.error('Blinkit scrape error', err.message);
    return { minutes: null, price: null };
  }
}

async function scrapeBigBasket(location, cookies = cookiesForProvider(BIGBASKET_COOKIES, 'SCRAPER_COOKIES_BIGBASKET', location, 'bigbasket')) {
  try {
    const effectiveCookies = applyLocationToCookies(cookies, location, 'bigbasket');
    return await withPage(async (page) => {
      // /bb-now/ is a 404; delivery time ("Delivery in X mins") is on the homepage
      await page.goto('https://www.bigbasket.com/', { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(3000);

      // "Delivery in 5 mins" text appears prominently on the BB homepage
      const selectors = [
        'text=/Delivery in \\d+/i',
        '[class*="delivery-time"]',
        '[class*="deliverytime"]',
        'text=/\\d+\\s*-?\\s*\\d*\\s*min/i',
        'text=/deliver.*\\d+\\s*min/i'
      ];
      for (const sel of selectors) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 2000 })) {
            const text = await el.textContent();
            const mins = parseMinutes(text);
            if (mins) return { minutes: mins, price: null };
          }
        } catch (_) {}
      }
      return extractFromPage(page);
    }, effectiveCookies, null);
  } catch (err) {
    console.error('BigBasket scrape error', err.message);
    return { minutes: null, price: null };
  }
}

async function scrapeSwiggy(location, cookies = cookiesForProvider(SWIGGY_COOKIES, 'SCRAPER_COOKIES_SWIGGY', location, 'swiggy')) {
  try {
    // Pass null for browser geolocation — lat/lng in URL triggers a location-change
    // confirmation modal in Swiggy; session cookies determine delivery location instead
    return await withPage(async (page) => {
      await page.goto('https://www.swiggy.com/instamart', { waitUntil: 'load', timeout: 25000 });
      await page.waitForTimeout(4000);

      // Dismiss location picker if it appears
      const locationBtns = [
        'button:has-text("Detect my location")',
        'button:has-text("Detect Location")',
        'button:has-text("Use my location")',
        'button:has-text("Use current location")',
        'button:has-text("Locate me")',
        'button:has-text("Allow")',
        '[class*="locate"] button',
        '[class*="detect"] button',
      ];
      for (const btn of locationBtns) {
        try {
          const el = page.locator(btn).first();
          if (await el.isVisible({ timeout: 1500 })) {
            await el.click();
            await page.waitForTimeout(3000);
            break;
          }
        } catch (_) {}
      }

      const selectors = [
        '[class*="delivery-time"]',
        '[class*="deliverytime"]',
        '[class*="delivery_time"]',
        '[class*="DeliveryTime"]',
        'text=/\\d+\\s*-?\\s*\\d*\\s*min/i',
        'text=/deliver.*\\d+\\s*min/i',
      ];
      for (const sel of selectors) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 1500 })) {
            const text = await el.textContent();
            const mins = parseMinutes(text);
            if (mins) return { minutes: mins, price: null };
          }
        } catch (_) {}
      }
      return extractFromPage(page);
    }, cookies, location);
  } catch (err) {
    console.error('Swiggy scrape error', err.message);
    return { minutes: null, price: null };
  }
}

async function scrapeInstamart(location, cookies = cookiesForProvider(SWIGGY_COOKIES, 'SCRAPER_COOKIES_SWIGGY', location, 'swiggy')) {
  return scrapeSwiggy(location, cookies);
}

async function scrapeJioMart(location, cookies = cookiesForProvider(JIOMART_COOKIES, 'SCRAPER_COOKIES_JIOMART', location, 'jiomart')) {
  try {
    const effectiveCookies = applyLocationToCookies(cookies, location, 'jiomart');
    // Pass null for browser geolocation — JioMart uses app_location_details cookie for
    // Express delivery area; injecting GPS coordinates overrides it and breaks Express
    return await withPage(async (page) => {
      await page.goto('https://www.jiomart.com/', { waitUntil: 'load', timeout: 25000 });
      await page.waitForTimeout(4000);

      const selectors = [
        '[class*="delivery-time"]',
        '[class*="express-time"]',
        '[class*="deliverytime"]',
        'text=/express.*\\d+\\s*min/i',
        'text=/deliver.*\\d+\\s*min/i',
        'text=/\\d+\\s*min/i'
      ];
      for (const sel of selectors) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 2000 })) {
            const text = await el.textContent();
            const mins = parseMinutes(text);
            if (mins) return { minutes: mins, price: null };
          }
        } catch (_) {}
      }
      return extractFromPage(page);
    }, effectiveCookies, null);
  } catch (err) {
    console.error('JioMart scrape error', err.message);
    return { minutes: null, price: null };
  }
}

async function scrapeFlipkart(location, cookies = cookiesForProvider(FLIPKART_COOKIES, 'SCRAPER_COOKIES_FLIPKART', location, 'flipkart')) {
  try {
    const effectiveCookies = applyLocationToCookies(cookies, location, 'flipkart');
    const pincode = location && location.pincode;
    return await withPage(async (page) => {
      // Flipkart Quick Commerce grocery page (more reliable than q/flipkart-minutes search)
      const url = pincode
        ? `https://www.flipkart.com/grocery-supermart-store?marketplaceGrocery=true&pincode=${encodeURIComponent(pincode)}`
        : 'https://www.flipkart.com/grocery-supermart-store?marketplaceGrocery=true';
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      try { await page.waitForLoadState('networkidle', { timeout: 12000 }); } catch (_) {}
      await page.waitForTimeout(8000);

      // Try entering pincode via the UI if there's a pincode input
      if (pincode) {
        const pincodeInputs = [
          'input[placeholder*="pincode" i]',
          'input[placeholder*="PIN" i]',
          'input[name="pincode"]',
          '[data-testid*="pincode"] input',
        ];
        for (const inp of pincodeInputs) {
          try {
            const el = page.locator(inp).first();
            if (await el.isVisible({ timeout: 1500 })) {
              await el.fill(String(pincode));
              await el.press('Enter');
              await page.waitForTimeout(2000);
              break;
            }
          } catch (_) {}
        }
      }

      const selectors = [
        '[class*="delivery-time"]',
        '[class*="minutes-tag"]',
        '[class*="deliverytime"]',
        '[class*="MinutesTag"]',
        '[class*="quick-delivery"]',
        '[data-testid*="delivery"]',
        '[data-testid*="eta"]',
        'text=/Delivery in \\d+/i',
        'text=/deliver.*\\d+\\s*min/i',
        'text=/\\d+\\s*min/i',
      ];
      for (const sel of selectors) {
        try {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 2000 })) {
            const text = await el.textContent();
            const mins = parseMinutes(text);
            if (mins) return { minutes: mins, price: null };
          }
        } catch (_) {}
      }
      return extractFromPage(page);
    }, effectiveCookies, location);
  } catch (err) {
    console.error('Flipkart scrape error', err.message);
    return { minutes: null, price: null };
  }
}

async function scrapeAll(location) {
  // Run all scrapers in parallel and return an object keyed by provider
  const results = await Promise.all([
    scrapeZepto(location),
    scrapeBlinkit(location),
    scrapeBigBasket(location),
    scrapeSwiggy(location),
    scrapeInstamart(location),
    scrapeJioMart(location),
    scrapeFlipkart(location)
  ]);

  return {
    zepto: results[0],
    blinkit: results[1],
    bigbasket: results[2],
    swiggy: results[3],
    instamart: results[4],
    jiomart: results[5],
    flipkart: results[6]
  };
}

module.exports = {
  scrapeZepto,
  scrapeBlinkit,
  scrapeBigBasket,
  scrapeSwiggy,
  scrapeInstamart,
  scrapeJioMart,
  scrapeFlipkart,
  scrapeAll
};
