"ui";

// 生成随机十六进制字符串
function genRandomHex(len) {
    var chars = '0123456789abcdef';
    var str = '';
    for (var i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}

// 全局变量
var Authorization = "";
var deviceInfo = {
    deviceBrand: "Xiaomi",
    networkType: "unknown",
    osversion: "Android13",
    models: "Mi 10",
    mac: "", 
    imei: "",
    tongdunblackbox: "",
    androidid: genRandomHex(16),
    oaid: genRandomHex(16)
};

// 构建通用请求头 (我在桃源当村长)
function buildHeaders(timestamp, auth) {
    var headers = {
        'Accept-Encoding': 'identity',
        'osinfo': `deviceBrand=${deviceInfo.deviceBrand}&networkType=${deviceInfo.networkType}`,
        'osversion': deviceInfo.osversion,
        'Content-Type': 'application/json',
        'channel': 'vivo', // 抓包显示为 vivo
        'sign': '',
        'oaid': deviceInfo.oaid,
        'androidid': deviceInfo.androidid,
        'mac': deviceInfo.mac,
        'imei': deviceInfo.imei,
        'tongdunblackbox': deviceInfo.tongdunblackbox,
        'models': deviceInfo.models,
        'v': '1.1.5', // 版本号 1.1.5
        'timestamp': timestamp,
        'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 13; ' + deviceInfo.models + ' Build/TKQ1.221114.001)',
        'Host': 'wozaitaoyuandangcunzhang.wetimetech.com',
        'Connection': 'Keep-Alive'
    };
    if (auth) {
        headers.Authorization = auth;
    }
    return headers;
}

// 计算 MD5 签名
function getSign(headers, json) {
    var key = "eS2IAMtuAkY7"; // 我在桃源当村长专属 KEY
    
    var r = {
        'Authorization': headers.Authorization || '',
        'v': headers.v,
        'channel': headers.channel,
        'models': headers.models,
        'imei': headers.imei,
        'oaid': headers.oaid,
        'mac': headers.mac,
        'timestamp': headers.timestamp
    };
    var ks = Object.keys(r).sort();
    var arr = ks.map(k => `${k}=${r[k]}`);
    var raw = arr.join("&") + "&" + JSON.stringify(json) + "&key=" + key;
    return $crypto.digest(raw, "MD5");
}

// === UI 布局 ===
ui.layout(
    <vertical>
        <appbar>
            <toolbar id="toolbar" title="by陈长欢--我在桃源当村长" bg="#007ACC" />
            <tabs id="tabs" bg="#007ACC" tabIndicatorColor="#ffffff" tabTextColor="#e0e0e0" tabSelectedTextColor="#ffffff" />
        </appbar>
        <viewpager id="vp">
            
            {/* 第 1 页：账户 */}
            <frame>
                <vertical padding="16">
                    <text text="Token 管理" textSize="16sp" textColor="black" textStyle="bold" />
                    <img id="qrImg" h="250" w="250" margin="12" layout_gravity="center" />
                    <horizontal marginTop="8">
                        <input id="tokenInput" w="0" layout_weight="1" h="45" hint="输入或获取 Token" textSize="12sp" />
                        <button id="btnCopy" text="复制" w="wrap_content" h="45" margin="4" />
                        <button id="btnSetToken" text="设置" w="wrap_content" h="45" margin="4" />
                    </horizontal>
                    <scroll h="0" layout_weight="1" marginTop="8">
                        <text id="tokenRecords" textSize="14sp" />
                    </scroll>
                    <button id="btnScan" text="扫码获取新Token" w="match_parent" h="45" marginTop="12" bg="#4CAF50" textColor="white" />
                </vertical>
            </frame>

            {/* 第 2 页：操作面板 */}
            <frame>
                <vertical padding="16">
                    <text text="操作面板" textSize="16sp" textColor="black" textStyle="bold" marginBottom="8"/>
                    
                    <vertical w="*" h="auto" padding="8" margin="0 0 0 12" background="#eeeeee">
                        <text text="参数设置" textSize="14sp" textColor="#007ACC" textStyle="bold" marginBottom="4"/>
                        <horizontal>
                            <input id="inputPrice" w="0" layout_weight="1" h="45" hint="🤡ad_price🤡" inputType="numberDecimal" textSize="13sp" margin="2" />
                            <input id="inputDelay" w="0" layout_weight="1" h="45" hint="🤡延迟(ms)🤡" inputType="number" margin="2" textSize="13sp" />
                            <input id="inputLoopCount" w="0" layout_weight="1" h="45" hint="🤡循环次数🤡" inputType="number" margin="2" textSize="13sp" />
                        </horizontal>
                        <horizontal marginTop="4">
                            <input id="inputOrderLevel" w="0" layout_weight="1" h="45" hint="🤡订单等级🤡" inputType="number" textSize="13sp" margin="2" />
                            <input id="inputRate" w="0" layout_weight="1" h="45" hint="🤡提现倍率(默认1)🤡" inputType="numberDecimal" textSize="13sp" margin="2" />
                        </horizontal>
                    </vertical>

                    <vertical w="*" h="auto" padding="12" margin="0" background="#eeeeee">
                        <text text="任务控制 (自动适配防挤)" textSize="14sp" textColor="#007ACC" textStyle="bold" marginBottom="8"/>
                        {/* 第一排 */}
                        <horizontal w="match_parent" h="wrap_content">
                            <button id="btnCheckBalance" text="🤡查询余额🤡" w="0" layout_weight="1" h="45" margin="4" bg="#E3F2FD" textColor="#1976D2" style="Widget.AppCompat.Button.Borderless"/>
                            <button id="btnReward" text="🤡刷余额🤡" w="0" layout_weight="1" h="45" margin="4" bg="#FFF3E0" textColor="#F57C00" style="Widget.AppCompat.Button.Borderless"/>
                        </horizontal>
                        {/* 第二排 */}
                        <horizontal w="match_parent" h="wrap_content">
                            <button id="btnOrder" text="🤡执行订单🤡" w="0" layout_weight="1" h="45" margin="4" bg="#E8F5E9" textColor="#388E3C" style="Widget.AppCompat.Button.Borderless"/>
                            <button id="btnWithdraw" text="🤡禁止软提现🤡" w="0" layout_weight="1" h="45" margin="4" bg="#FCE4EC" textColor="#C2185B" style="Widget.AppCompat.Button.Borderless"/>
                        </horizontal>
                        {/* 第三排 */}
                        <horizontal w="match_parent" h="wrap_content">
                            <button id="btnWithdrawList" text="🤡提现记录🤡" w="match_parent" layout_weight="1" h="45" margin="4" bg="#F3E5F5" textColor="#7B1FA2" style="Widget.AppCompat.Button.Borderless"/>
                        </horizontal>
                    </vertical>
                </vertical>
            </frame>

            {/* 第 3 页：单独的日志页 */}
            <frame>
                <vertical padding="16" background="#eeeeee">
                    <text text="运行日志" textSize="16sp" textColor="#007ACC" textStyle="bold" marginBottom="8"/>
                    <scroll h="match_parent" w="match_parent">
                        <text id="logView" textSize="12sp" textColor="#333333" />
                    </scroll>
                </vertical>
            </frame>

            {/* 第 4 页：设置说明 */}
            <frame>
                <scroll>
                    <vertical padding="16">
                        <text text="设置与说明" textSize="16sp" textColor="black" textStyle="bold" />
                        <text text="ad-price----我在桃源当村长建议填 580 左右，延迟填 30000 或者 35000" marginTop="12" textColor="#D32F2F" textStyle="bold" />
                        <text text="🤡第一步：先去游戏看一个广告，然后随便点点提现0.3
🤡第二步，打开协议用登陆了游戏的那个微信扫协议的那个二维码，点刷余额增加到2毛-3毛左右，别加多，点一次增加0.2余额，延迟10-20秒左右，自动响应
🤡第三步：刷完后回去游戏提现0.7，提现之前先看一个广告
🤡第四步：提完0.7之后就可以开始提1.5了，多种菜，多看广告
🤡第五步：提2.3，看广告种草菜刷完2.3之后停两个小时再去刷千万别用软件提现，提现的时候自己上游戏看1-2广告提
🤡备注：每次刷完回去提现前一定要看一个广告，防封，以此类推刷完2.3之后就可以每间隔一个小时或两个左右去提一次2-3块钱。" marginTop="12" lineSpacingExtra="4dp" />
                    </vertical>
                </scroll>
            </frame>
        </viewpager>
    </vertical>
);

// 绑定标签和页面
ui.vp.setTitles(["账户", "操作", "日志", "设置"]);
ui.tabs.setupWithViewPager(ui.vp);

// 日志 & Token 管理
function appendLog(msg) {
    ui.run(() => {
        var timeStr = new Date().toLocaleTimeString();
        ui.logView.append("[" + timeStr + "] " + msg + "\n");
        ui.logView.parent.scrollTo(0, ui.logView.height); 
    });
    console.log(msg); 
}

function addToken(tk) {
    ui.run(() => ui.tokenRecords.append(tk + "\n"));
}

// 按钮事件处理 (防止复制带入空格或换行)
ui.btnSetToken.on("click", () => {
    var t = ui.tokenInput.text();
    if (t) {
        Authorization = t.trim().replace(/[\r\n]/g, "");
        toast("Token已设置");
        appendLog("手动设置 Token: " + Authorization.substring(0, 10) + "...");
    } else {
        toast("请输入Token");
    }
});

ui.btnCopy.on("click", () => {
    var t = ui.tokenInput.text();
    if (t) setClip(t), toast("已复制到剪贴板");
    else toast("无可复制的 Token");
});

ui.btnScan.on("click", () => threads.start(startScan));

// 扫码逻辑
function startScan() {
    appendLog("正在生成二维码...");
    var appid = "wx0ef2f91916ef1fc0"; // 我在桃源当村长专用 AppID
    var ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12A365 MicroMessenger/5.4.1 NetType/WIFI WebView/doc";
    var qrUrl = `https://open.weixin.qq.com/connect/app/qrconnect?appid=${appid}&bundleid=(null)&scope=snsapi_userinfo&state=w&from=message&isappinstalled=0`;
    try {
        var res = http.get(qrUrl, {
            headers: { 'User-Agent': ua }
        }).body.string();
        var uuid = res.split('uuid: "')[1].split('"')[0];
        var imgUrl = res.split('auth_qrcode" src="')[1].split('"')[0];
        ui.run(() => ui.qrImg.attr("src", imgUrl));
        appendLog("二维码生成成功，请在手机上打开并扫描");
        pollScan(uuid, ua);
    } catch (e) {
        appendLog("扫码获取二维码异常：" + e);
    }
}

function pollScan(uuid, ua) {
    while (true) {
        sleep(1000);
        var checkUrl = `https://long.open.weixin.qq.com/connect/l/qrconnect?uuid=${uuid}&f=url&_=${Date.now()}`;
        try {
            var poll = http.get(checkUrl, {
                headers: { 'User-Agent': ua }
            }).body.string();
            if (poll.indexOf("oauth") !== -1) {
                appendLog("扫码成功！");
                var redirect = poll.split("window.wx_redirecturl=")[1].replace(/[';"]+/g, "");
                var code = android.net.Uri.parse(redirect).getQueryParameter("code");
                appendLog("提取到 code：" + code);
                fetchTokenWithCode(code);
                break;
            }
        } catch (e) {}
    }
}

function fetchTokenWithCode(code) {
    var body = {
        code: code,
        appid: "wx0ef2f91916ef1fc0", 
        province: "",
        city: "",
        district: "",
        invite_user_number: "", // 已将混入的脏数据清空
        key_time: 0
    };
    var ts = Date.now();
    var h = buildHeaders(ts, "");
    h.sign = getSign(h, body);
    try {
        var resp = http.postJson("https://wozaitaoyuandangcunzhang.wetimetech.com/v2/user/wechatLogin", body, {
            headers: h
        }).body.json();
        if (resp.data && resp.data.user_info && resp.data.user_info.token) {
            Authorization = resp.data.user_info.token;
            ui.run(() => ui.tokenInput.setText(Authorization));
            addToken(Authorization);
            appendLog("Token 获取成功：" + Authorization);
        } else {
            appendLog("Token 获取失败：" + JSON.stringify(resp));
        }
    } catch (e) {
        appendLog("🤡登录请求异常：" + e);
    }
}

// 任务功能函数（多线程）
function checkBalanceTask() {
    if (!Authorization) return toast("请先设置 Token");
    var ts = Date.now();
    var h = buildHeaders(ts, Authorization);
    // 依据抓包，这里的查询余额是 antique_num 参数
    var body = { "antique_num": 0 }; 
    h.sign = getSign(h, body);
    try {
        var resp = http.postJson("https://wozaitaoyuandangcunzhang.wetimetech.com/v2/wallet/withdrawInfo", body, {
            headers: h
        }).body.json();
        if (resp.data && resp.data.money != null) {
            appendLog("当前余额: " + resp.data.money);
        } else {
            appendLog("查询余额异常，接口返回: " + JSON.stringify(resp));
        }
    } catch (e) {
        appendLog("🤡查询余额异常：" + e);
    }
}

function withdrawTask() {
    if (!Authorization) return toast("请先设置 Token");
    var body = {}; // 空体提现
    var ts = Date.now();
    var h = buildHeaders(ts, Authorization);
    h.sign = getSign(h, body);
    try {
        var res = http.postJson("https://wozaitaoyuandangcunzhang.wetimetech.com/v2/wallet/withdraw", body, {
            headers: h
        }).body.json();
        appendLog("提现返回：" + JSON.stringify(res));
    } catch (e) {
        appendLog("🤡提现异常🤡：" + e);
    }
}

function rewardTask() {
    if (!Authorization) return toast("请先设置 Token");
    var price = parseFloat(ui.inputPrice.text()) || 580.73; 
    var delay = parseInt(ui.inputDelay.text()) || 1;
    var count = parseInt(ui.inputLoopCount.text()) || 1;
    appendLog(`开始刷余额，执行 ${count} 次...`);
    for (var i = 1; i <= count; i++) {
        sleep(delay);
        var body = {
            "ad_type": 2,
            "network_firm_id": 101101,
            "ad_price": price,
            "e_c": "LPQUF4d58s6OgZDCu69mg/ZkCXhpP0exNUV2bZL/xAtB1dh0nMw19mLBiQoVgYEiWXThN0yXctKCk5+YG/0k7ctWJQa9PGxMMlFIsWWzVeMRw6E/kCKgl8UE2JCvAgTFugGDDlZwvzJwIRAhJey4oGs28IzvZYEAfRYt4bLtmIs=",
            "s_id": "100199",
            "placement_id": "b1g62g8pv9aqa6",
            "show_id": "b92af0a837979a9c5bc92d9dcefdebd4_7534042_" + Date.now(),
            "video_scene": 24,
            "list": [0, 1, 4, 100]
        };
        var ts = Date.now();
        var h = buildHeaders(ts, Authorization);
        h.sign = getSign(h, body);
        try {
            var res = http.postJson("https://wozaitaoyuandangcunzhang.wetimetech.com/v2/api/ad", body, {
                headers: h
            }).body.json();
            appendLog("第 " + i + " 次刷奖励返回：" + JSON.stringify(res));
        } catch (e) {
            appendLog("第 " + i + " 次刷奖励异常：" + e);
        }
    }
    appendLog("🤡刷奖励任务完成🤡。");
}

function orderTask() {
    if (!Authorization) return toast("请先设置 Token");
    var level = parseInt(ui.inputOrderLevel.text()) || 1;
    appendLog(`开始执行订单，等级： ${level}...`);
    
    var payload = {
        "ground_list": [{ "ground_id": 1, "crop_id": 1 }],
        "order_level": level,
        "finish": 1
    };
    var h = buildHeaders(Date.now(), Authorization);
    h.sign = getSign(h, payload);
    try {
        var res = http.postJson("https://wozaitaoyuandangcunzhang.wetimetech.com/v2/game/harvestGround", payload, {
            headers: h
        }).body.json();
        appendLog(`订单执行返回：` + JSON.stringify(res));
    } catch (e) {
        appendLog(`订单执行异常：` + e);
    }
}

function withdrawListTask() {
    if (!Authorization) return toast("请先设置 Token");
    var ts = Date.now();
    var h = buildHeaders(ts, Authorization);
    h.sign = getSign(h, {});
    try {
        var res = http.postJson("https://wozaitaoyuandangcunzhang.wetimetech.com/v2/wallet/withdrawList", {}, {
            headers: h
        }).body.json();
        appendLog("提现记录返回：" + JSON.stringify(res));
    } catch (e) {
        appendLog("查询提现记录异常：" + e);
    }
}

// 按钮点击事件
ui.btnCheckBalance.on("click", () => threads.start(checkBalanceTask));
ui.btnWithdraw.on("click", () => threads.start(withdrawTask));
ui.btnReward.on("click", () => threads.start(rewardTask));
ui.btnOrder.on("click", () => threads.start(orderTask));
ui.btnWithdrawList.on("click", () => threads.start(withdrawListTask));
