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
            return "����";
        }break;
        case 1:{
            return "�쳣";
        }break;
        case 2:{
            return "����"
        }break;
    }
});

function getStatus(type){
    switch (type){
        case 0:{
            return "����";
        }break;
        case 1:{
            return "�쳣";
        }break;
        case 2:{
            return "����"
        }break;
    }
}

Vue.filter("project_state", function (type) {
    switch (type){
        case 0:{
            return "δִ��";
        }break;
        case 1:{
            return "�����";
        }break;
        case 2:{
            return "�ѹ���"
        }break;
    }
});

Vue.filter("state", function (type) {
    switch (type){
        case 0:{
            return "ͣ��";
        }break;
        case 1:{
            return "����";
        }break;
    }
});

Vue.filter("ctype", function (type) {
    switch (type){
        case 1:{
            return "�ֻ��ϴ�";
        }break;
        case 0:{
            return "��ҳ���";
        }break;
    }
});

Vue.filter("check_state", function (type) {
    switch (type){
        case 0:{
            return "δ���";
        }break;
        case 1:{
            return "���ͨ��";
        }break;
    }
});

Vue.filter("cycle_type", function (type) {
    switch (type){
        case 0:{
            return "��";
        }break;
        case 1:{
            return "��";
        }break;
        case 2:{
            return "��";
        }break;
        case 3:{
            return "��";
        }break;
        case 4:{
            return "�Զ��壨��λΪ�죩";
        }break;
    }
});

Vue.filter("content_type", function (type) {
    switch (type){
        case 0:{
            return "����";
        }break;
        case 1:{
            return "����";
        }break;
    }
});

module.exports = {
    tranDate:tranDate,
    getStatus:getStatus
}