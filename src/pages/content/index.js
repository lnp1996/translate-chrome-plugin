/**
 * @description index.js content内容挂在到当前打开的页面中
 * @author maicFir
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

let tooltip; // 用来存储当前 tooltip 的变量

function translateWord(word) {
  // 这里应该调用翻译 API，返回 Promise
  // 作为示例，我们假装翻译总是返回 "示例翻译"
  return Promise.resolve("示例翻译");
}

function clearTooltip() {
    // 如果 tooltip 存在，则移除它
    if (tooltip) {
      tooltip.style.opacity = "0";
      tooltip.remove();
      tooltip = null; // 清除引用
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

        clearTooltip()

        // 创建 tooltip 元素并显示翻译
        tooltip = document.createElement("div");
        tooltip.id = "__tooltip__";
        tooltip.innerText = translation;
        tooltip.className = "tooltip"; // 应用样式类名
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.top - 40}px`; // 调整位置，确保不会遮挡鼠标下的内容
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
//   if (selection.rangeCount > 0 && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // 设置 tooltip 的位置
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY}px`;
    tooltip.style.position = "absolute";
    tooltip.style.display = "block";
  } else {
    // 如果没有选中的文本，清除 tooltip
    clearTooltip()
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

const div = document.createElement("div");
const meta = document.createElement("meta");
// 解决访问第三方图片403问题
meta.name = "referrer";
meta.content = "no-referrer";
div.id = "plugin-root";
const dom = document.getElementsByTagName("body")[0];
const header = document.getElementsByTagName("head")[0];
header.appendChild(meta);
dom.appendChild(div);
const firstChild = dom.firstChild;
dom.insertBefore(div, firstChild);

const root = ReactDOM.createRoot(document.getElementById("plugin-root"));

root.render(<App />);
