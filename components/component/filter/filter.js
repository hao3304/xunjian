/**
 * Created by jack on 2015/11/12.
 */


var Vue = require("component_modules/vue.js");

function tranDate(str){
    if(str){
        var stamp = str.replace("/Date(","").replace("+0800)/","");
        var date = new Date(parseInt(stamp));
        var year = date.getFullYear(),
            month = (date.getMonth()+1),
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes();

        hour = hour<10?("0"+hour):hour;
        min = min<10?("0"+min):min;
        month = month<10?("0"+month):month;
        day = day<10?("0"+day):day;

        return year+"-"+month+"-"+day+" "+hour+":"+min;
    }else{
        return "";
    }
}


Vue.filter('datetime', function (str) {
    return tranDate(str);
});

Vue.filter("status", function (type) {
    switch (type){
        case 0:{
            return "正常";
        }break;
        case 1:{
            return "异常";
        }break;
        case 2:{
            return "良好"
        }break;
    }
});

function getStatus(type){
    switch (type){
        case 0:{
            return "正常";
        }break;
        case 1:{
            return "异常";
        }break;
        case 2:{
            return "良好"
        }break;
    }
}

Vue.filter("project_state", function (type) {
    switch (type){
        case 0:{
            return "未执行";
        }break;
        case 1:{
            return "已完成";
        }break;
        case 2:{
            return "已过期"
        }break;
    }
});

Vue.filter("state", function (type) {
    switch (type){
        case 0:{
            return "停用";
        }break;
        case 1:{
            return "启用";
        }break;
    }
});

Vue.filter("ctype", function (type) {
    switch (type){
        case 1:{
            return "手机上传";
        }break;
        case 0:{
            return "网页添加";
        }break;
    }
});

Vue.filter("check_state", function (type) {
    switch (type){
        case 0:{
            return "未审核";
        }break;
        case 1:{
            return "审核通过";
        }break;
    }
});

Vue.filter("cycle_type", function (type) {
    switch (type){
        case 0:{
            return "天";
        }break;
        case 1:{
            return "周";
        }break;
        case 2:{
            return "月";
        }break;
        case 3:{
            return "年";
        }break;
        case 4:{
            return "自定义（单位为天）";
        }break;
    }
});

Vue.filter("content_type", function (type) {
    switch (type){
        case 0:{
            return "文字";
        }break;
        case 1:{
            return "数字";
        }break;
    }
});

module.exports = {
    tranDate:tranDate,
    getStatus:getStatus
}