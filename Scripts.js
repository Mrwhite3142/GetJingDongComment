// ==UserScript==
// @name         京东评论爬取
// @namespace    http://tampermonkey.net/
// @version      2025-05-03
// @description  try to take over the world!
// @author       Mrwhite3142
// @match        https://item.jd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("Developed by Mrwhite3142 © CopyRight")
    var htmlString = `
    <style>

			.CheatBox{
				height: calc(100vh - 96px);
				width: calc(50vw - 475px - 40px);
				border-radius: 8px;
				background-color: #262822;
				position: fixed;
				top: 48px;
				color: #ffffff;
				left: 20px;
				border-radius: 9px;
				z-index: 9999999;
				overflow: hidden;
				transition: all 0.5s;
				background-image: url('https://plus.mrwhite3142.work/img/BG.png');background-size: 100% auto;
			}
			.SB{
				background-color: #3D5DF6;
				width: fit-content;
				user-select: none;
				color: #ffffff;
				border-radius: 8px;
				display: flex;
				align-items: center;
				padding: 0.5rem 1rem 0.5rem 0.5rem;
				font-weight: bold;
				margin-left: 1rem;
				letter-spacing: 2px;
				transition: all 0.2s;
			}
			.SB:hover{
				opacity: 0.9;
				transform: scale(1.05,1.05);
			}
			.SB:active{
				opacity: 0.8;
				transform: scale(0.9,0.9);
			}
		</style>
		<div class="CheatBox">
			<div style="display: flex;align-items: center;margin-left: auto;
			margin-right: auto;padding-top: 1rem;background-color: #12110F;
			border-radius: 9px;padding-left: 1rem;padding-bottom: 0.5rem;

			">

				<img src="https://plus.mrwhite3142.work/img/JDHIcon.png" style="width: 2rem;height: 2rem;"/>
				<div style="letter-spacing: 6px;font-size: 1rem;color: #3EB575;padding: 0.5rem;">京东评论爬取V1</div>
			</div>
			<div style="height: calc(100vh - 96px - 4rem); backdrop-filter: blur(20px);background-color: #16171C90;margin-top: 0;position: relative;">
				<div style="height: 1rem;"></div>
				<div style="display: flex;align-items: center;">
					<div class="SB" id="StartBtn">
						<img src="https://plus.mrwhite3142.work/img/%E5%BC%80%E5%A7%8B.png" style="width: 1.5rem;height: 1.5rem;"/>
						<div>开始爬取</div>
					</div>
					<div class="SB" id="EndBtn" style="background-color: #FA5A5A;">
						<img src="https://plus.mrwhite3142.work/img/%E5%81%9C%E6%AD%A2.png" style="width: 1.5rem;height: 1.5rem;"/>
						<div>停止爬取</div>
					</div>
				</div>
				<div style="padding: 1rem 0 0 1rem;opacity: 0.8;">正在爬取商品：</div>
				<div style="color: #ffffff;padding: 1rem 0 0 1rem;font-size: 1rem;font-weight: bold;" id="Name">开始以获取...</div>
				<div style="padding: 1rem 0 0 1rem;opacity: 0.8">已爬取评论：</div>
				<div style="display: flex;align-items: baseline;padding: 1rem 0 0 1rem;">
					<div>已抓取</div>
					<div style="color: #9CDCFE;font-size: 2rem;margin-left: 0.3rem;margin-right: 0.3rem;" id="Num">0</div>
					<div>条</div>
				</div>
				<div style="padding: 1rem 0 0 1rem;opacity: 0.8">未成功获取：</div>
				<div style="display: flex;align-items: baseline;padding: 1rem 0 0 1rem;">
					<div>错误</div>
					<div style="color: #fcb2bc;font-size: 2rem;margin-left: 0.3rem;margin-right: 0.3rem;" id="Num">0</div>
					<div>条</div>
				</div>
				<div style="display: flex;align-items: center;bottom: 1.8rem;position: absolute;">
					<div class="SB" style="background-color: #0499FD;">
						<img src="https://plus.mrwhite3142.work/img/%E9%9A%90%E8%97%8F%E3%80%81%E4%B8%8D%E5%8F%AF%E8%A7%81.png" style="width: 1.5rem;height: 1.5rem;"/>
						<div>按Q切换</div>
					</div>
					<div class="SB" id="DwBtn" style="background-color: #3EB575;">
						<img src="https://plus.mrwhite3142.work/img/%E4%B8%8B%E8%BD%BD%20(1).png" style="width: 1.5rem;height: 1.5rem;"/>
						<div>下载文件</div>
					</div>
				</div>
				<div style="padding: 1rem 0 0 1rem;opacity: 0.8;font-size: 0.6rem;bottom: 0.4rem;position: absolute;">Developed by Mrwhite3142 © Copyright</div>
			</div>
		</div>

    `
    document.body.insertAdjacentHTML('beforeend', htmlString);
    var ResultList = []
    var StartCheck = false
    var Timer = {}
    var ProductName = ""
    // 创建 button 元素
var btn = document.querySelector("#StartBtn");
var btn2 = document.querySelector("#EndBtn");



function addIfNotExists(newItem) {
    // 检查 ResultList 中是否已存在 Index 相同的对象
    const isDuplicate = ResultList.some(item => item.Index === newItem.Index);

    if (!isDuplicate) {
        // 如果没有找到相同的 Index，则添加 newItem 到 ResultList
        ResultList.push(newItem);
        console.log("对象已添加:", newItem);
    } else {
        console.log("Index 已存在，对象未添加:", newItem.Index);
    }
}

function Check(){
    if(!StartCheck) return;
    //Emmmm
    const element = document.querySelector("div[data-testid='virtuoso-item-list']");
    //获取父元素（评论的框架）
    var RemarkElementsList = element.children
    //获取评论元素的列表

    //强制删除碍事的标签（我觉得这个分析意义不大就删了，大家也可以自行获取
    var elementsD = document.querySelectorAll('.jdc-pc-rate-card-tags');
    // 遍历找到的每个元素，并从 DOM 中移除
    elementsD.forEach(function(elementI) {
        elementI.parentNode.removeChild(elementI);
    });


    for(var i=0;i<RemarkElementsList.length;i++){
        var CurrentRemark = RemarkElementsList[i]
        //获取当前评论元素
        var RealInfoCard = CurrentRemark.firstChild.firstChild
        //脱去框架，这个是真正承载信息的元素

        var UserInfoElement = {} //预留个用户信息元素
        var RemarkContentElement = {} //预留个用户信息元素
        var UsedThenRemark = false //是否有“使用过”水印
        if(RealInfoCard.children[0].getAttribute("class") == "jdc-pc-rate-card-watermark"){
            //有“用过”水印
            console.log("当前评论有“使用过”水印")
            UsedThenRemark = true
            UserInfoElement = RealInfoCard.children[1]
            RemarkContentElement = RealInfoCard.children[2]
        }else{
            //没有用过水印
            console.log("当前评论有“无使用过”水印")
            UserInfoElement = RealInfoCard.children[0]
            RemarkContentElement = RealInfoCard.children[1]
        }
        var RemarkInfo = {}
        try {
            RemarkInfo = {
                "Index": CurrentRemark.getAttribute("data-index"),
                "Avatar": UserInfoElement.children[0].firstChild.getAttribute("src"),
                "Nick": UserInfoElement.children[1].textContent,
                "Time": RemarkContentElement.children[0].children[0].children[3].textContent,
                "ProductDetial": RemarkContentElement.children[0].children[0].children[4].textContent,
                "RemarkDetial": RemarkContentElement.children[1].firstChild.textContent,
                "UsedThenRemark": UsedThenRemark
            }
        } catch (error) {
            //StartCheck = false
            console.error("捕获到错误:", error.message);
            console.error("错误类型:", error.constructor.name);
            console.error("出错的元素:",CurrentRemark);

            //alert("爬取出错！请手动检查控制台！")
        }

        addIfNotExists(RemarkInfo)

    }
    console.log(ResultList)
    var numbox = document.querySelector("#Num")
    numbox.innerHTML = ResultList.length

}
function convertToCSV(data) {
    if (!data || data.length === 0) return '';

    // 固定表头顺序
    const headers = [
        "Index", "Avatar", "Nick", "Time", "ProductDetial", "RemarkDetial", "UsedThenRemark"
    ];

    // 构建每一行数据
    const rows = data.map(obj => {
        return headers.map(header => {
            let value = obj[header];

            // 转换 null/undefined 为空字符串
            if (value === null || value === undefined) return '';

            // 统一处理字符串字段（无论是否包含特殊字符）
            if (typeof value === 'string') {
                value = value.replace(/"/g, '""'); // 转义双引号
                return `"${value}"`; // 始终使用双引号包裹
            }

            // 非字符串字段直接返回
            return value;
        }).join(',');
    });

    // 返回完整的 CSV 内容
    return [headers.join(','), ...rows].join('\n');
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function downloadCSV(data, filename = 'data.csv') {
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + data; // \uFEFF 添加 BOM 支持 Excel 正确识别 UTF-8
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function isElementExistsById(id) {
    return document.getElementById(id) !== null;
}
// 点击事件（可选）
btn.onclick = function() {
    ProductName = document.title
    document.getElementById("Name").innerHTML = ProductName
    if(!StartCheck){
        if(!isElementExistsById("rateList")){
            //如果未打开评论弹窗，则自动打开
            document.getElementsByClassName("all-btn")[0].click()
        }

        StartCheck = true
        setTimeout(()=>{
            var ScrollElement = document.getElementById("rateList").children[0].children[2]
            Timer = setInterval(async function(){
                ScrollElement.scrollBy({
                    top: 200,
                    left: 0,
                    behavior: 'smooth'
                });
                await sleep(300)
                Check()
            },850)
        },500)
    }
}

    btn2.onclick = function() {
        StartCheck = false
        clearInterval(Timer)
    }

var btnDw = document.getElementById("DwBtn")
btnDw.onclick = () => {
    var csvData = convertToCSV(ResultList);
    downloadCSV(csvData, ProductName+'.csv');
}

var showCheat = true
var cheatbox = document.getElementsByClassName("CheatBox")[0]
document.addEventListener('keydown', function(event) {
  // 检查按下的键是否是 "Q"（不区分大小写）
  if (event.key === 'q' || event.key === 'Q') {
	if(showCheat){
		  cheatbox.style.left = "-30vw";
	}else{
		  cheatbox.style.left = "20px";
	}
	showCheat = !showCheat
  }
});

// 获取你想要监听滚轮事件的元素，这里以整个文档为例
document.addEventListener('wheel', function(event) {
    console.log('鼠标滚轮事件触发');
    //Check()

}, { passive: false });



})();