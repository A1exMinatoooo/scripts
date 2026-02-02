// ==UserScript==
// @name         DMHY Magnet Helper (Countdown)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在动漫花园详情页左下角添加按钮，点击复制；3秒内再次点击打开链接，附带倒计时动画(Vibe with Gemini 3 Pro)
// @author       A1exMinatoooo
// @match        https://share.dmhy.org/topics/view/*
// @icon         https://share.dmhy.org/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 1. 获取磁力链元素
    const magnetElement = document.querySelector('#a_magnet');
    if (!magnetElement) return;

    const magnetLink = magnetElement.href;

    // 状态变量
    let isCopied = false;
    let countdownTimer = null; // 用于存储循环计时器
    const TIMEOUT_SECONDS = 3; // 设置倒计时时长

    // 2. 创建悬浮按钮
    const floatBtn = document.createElement('button');
    floatBtn.id = 'dmhy-float-btn';
    floatBtn.innerText = '📋 复制磁力链';

    // 3. 添加样式
    GM_addStyle(`
        #dmhy-float-btn {
            position: fixed;
            bottom: 30px;
            left: 30px;
            z-index: 9999;
            padding: 12px 20px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 50px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s ease; /* 加快过渡让倒计时更跟手 */
            font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            min-width: 150px; /* 固定最小宽度，防止数字跳动时按钮忽大忽小 */
            text-align: center;
        }
        #dmhy-float-btn:hover {
            box-shadow: 0 6px 8px rgba(0,0,0,0.4);
            transform: translateY(-2px);
        }
        #dmhy-float-btn:active {
            transform: translateY(0);
        }
        #dmhy-float-btn.ready-to-open {
            background-color: #4CAF50;
        }
    `);

    // 辅助函数：重置按钮到初始状态
    const resetToInitial = () => {
        isCopied = false;
        floatBtn.innerText = '📋 复制磁力链';
        floatBtn.classList.remove('ready-to-open');

        // 清除计时器
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
    };

    // 4. 点击事件处理
    floatBtn.addEventListener('click', function() {
        if (!isCopied) {
            // --- 第一次点击：复制并启动倒计时 ---
            GM_setClipboard(magnetLink);
            isCopied = true;
            floatBtn.classList.add('ready-to-open');

            let remainingTime = TIMEOUT_SECONDS;

            // 立即显示初始倒计时
            floatBtn.innerText = `🚀 已复制！点击打开 (${remainingTime}s)`;

            // 启动循环计时器，每秒更新一次
            countdownTimer = setInterval(() => {
                remainingTime--;

                if (remainingTime > 0) {
                    // 更新数字
                    floatBtn.innerText = `🚀 已复制！点击打开 (${remainingTime}s)`;
                } else {
                    // 倒计时结束，重置
                    resetToInitial();
                }
            }, 1000);

        } else {
            // --- 第二次点击（且在倒计时内）：打开链接 ---

            // 先清除计时器，防止后续代码执行
            if (countdownTimer) clearInterval(countdownTimer);

            // 打开链接
            window.location.href = magnetLink;

            // 立即重置
            resetToInitial();
        }
    });

    // 5. 将按钮添加到页面
    document.body.appendChild(floatBtn);

})();
