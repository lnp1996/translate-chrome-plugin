/**
 * @description index.js content内容挂在到当前打开的页面中
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import getMD5 from "./md5";

var tooltipHeight;
let tooltip; // 用来存储全局 tooltip 的变量
const __tooltip__id = "__tooltip__id"; //标识
const OPENAI_API_KEY = "xxxxxxx";
const prompt = `Translate this into Chinese:
      hello world`;

// 翻译平台API映射
const apiFunMap = {
  //百度翻译，API appid申请地址： https://fanyi-api.baidu.com/api/trans/product/desktop?req=detail
  baidu: async (word) => {
    const appid = "20231124001890466"; //TODO 自己的翻译appid
    const key = "xxxxxxxx";            //TODO 自己的翻译API密钥
    const salt = new Date().getTime();
    // const word = word;
    var from = "en";
    var to = "zh";
    var str1 = appid + word + salt + key;
    var sign = getMD5(str1);
    
    // 构造查询字符串
    const query = `q=${encodeURIComponent(word)}&appid=${appid}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`;
    
    // 发起 fetch 请求
    const res = await fetch(`https://api.fanyi.baidu.com/api/trans/vip/translate?${query}`);
    const response = await res.json();
    return response?.trans_result[0]?.dst;
  },
  //   "google": "google",
  //   "youdao": "youdao",
  openai: async (prompt) => {
    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt,
        max_tokens: 1000,
        temperature: 0,
      }),
    });
    const response = await res.json();
    const result = response.choices[0].text;
  },
};

async function translateWord(word) {
  // 这里应该调用翻译 API，返回 Promise
  try {
    const res = await apiFunMap["baidu"](word);
    console.log(res);
    return res;
  } catch (error) {
    return Promise.resolve("翻译报错啦");
  }
}

function clearTooltip() {
  // 如果 tooltip 存在，则移除它
  if (tooltip) {
    tooltip.style.opacity = "0";
    tooltip.remove();
    tooltip = null; // 清除引用
    tooltipHeight = null;
  }
}

function showTooltip() {
  const selection = window.getSelection();
  const selectionContent = selection.toString().trim();

  // 确保选区存在且不为空
  if (selectionContent) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    //   alert(`${rect.top + window.scrollY}px,${rect.left + window.scrollX}px`);

    // 获取单词并翻译
    translateWord(selection)
      .then((translation) => {
        clearTooltip();

        // 创建 tooltip 元素
        const tooltipShadow = document.createElement("div");
        tooltipShadow.innerText = translation;
        tooltipShadow.className = __tooltip__id; // 应用样式类名
        tooltipShadow.style.position = "absolute"; // 使其脱离文档流
        tooltipShadow.style.visibility = "hidden"; // 防止在计算之前显示出来
        // 将 tooltip 添加到 body 中以便计算高度
        document.body.appendChild(tooltipShadow);
        // 计算 tooltip 的高度
        tooltipHeight = tooltipShadow.offsetHeight + 10;
        // 在计算完高度之后，如果不需要立即显示 tooltip，可以将其移除
        document.body.removeChild(tooltipShadow);

        // 创建 tooltip 元素
        tooltip = document.createElement("div");
        tooltip.id = __tooltip__id;
        tooltip.innerText = translation;
        tooltip.className = __tooltip__id; // 应用样式类名
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.top - tooltipHeight}px`; // 调整位置，确保不会遮挡鼠标下的内容
        document.body.appendChild(tooltip);
      })
      .catch((error) => {
        console.error("Translation error:", error);
      });
  }
}

let lastMouseUpTimestamp = 0;
let mouseUpCount = 0;
const doubleClickThreshold = 100; // 双击的时间阈值设置为300毫秒

document.addEventListener("mousedown", () => {
  clearTooltip();
});

document.addEventListener("mouseup", function (e) {
  const timestamp = new Date().getTime();
  const timeSinceLastMouseUp = timestamp - lastMouseUpTimestamp;

  if (timeSinceLastMouseUp < doubleClickThreshold) {
    // 如果两次点击的时间间隔小于阈值，增加点击计数
    mouseUpCount++;
  } else {
    // 如果时间间隔超过阈值，重置点击计数
    mouseUpCount = 1;
  }

  lastMouseUpTimestamp = timestamp;

  if (mouseUpCount === 1) {
    // 如果是第一次mouseup，启动计时器
    setTimeout(function () {
      if (mouseUpCount === 1) {
        // 如果在设定时间后，没有第二次mouseup，显示tooltip
        showTooltip();
      }
    }, doubleClickThreshold);
  } else if (mouseUpCount === 2) {
    // 如果是第二次mouseup，显示tooltip
    showTooltip();
    // 重置点击计数
    mouseUpCount = 0;
  }
});

function updateTooltipPosition(tooltip) {
  const selection = window.getSelection();
  const selectionContent = selection.toString().trim();

  if (selectionContent) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // 设置 tooltip 的位置
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.top - tooltipHeight + window.scrollY}px`;
    tooltip.style.position = "absolute";
    tooltip.style.display = "block";
  } else {
    // 如果没有选中的文本，清除 tooltip
    clearTooltip();
  }
}

// 监听滚动事件并更新 tooltip 位置
window.addEventListener("scroll", function () {
  // tooltip 元素
  if (tooltip && tooltip.style.display !== "none") {
    updateTooltipPosition(tooltip);
  }
  // setTimeout(() => {
  //     clearTooltip()
  // }, 400)
});

// const div = document.createElement("div");
// const meta = document.createElement("meta");
// // 解决访问第三方图片403问题
// meta.name = "referrer";
// meta.content = "no-referrer";
// div.id = "plugin-root";
// const dom = document.getElementsByTagName("body")[0];
// const header = document.getElementsByTagName("head")[0];
// header.appendChild(meta);
// dom.appendChild(div);
// const firstChild = dom.firstChild;
// dom.insertBefore(div, firstChild);

// const root = ReactDOM.createRoot(document.getElementById("plugin-root"));

// root.render(<App />);
