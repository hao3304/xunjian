/**
 * Created by jack on 2015/12/14.
 */

$(function () {

    var prefix = "http://221.12.173.124:8080/inspectservice/DataManagerService/";

    $.getJSONP = function(url,callback,async){
        if(typeof async == "undefined"){
            async = true;
        }
        return $.ajax({
            url:url,
            dataType:"jsonp",
            async:async,
            contentType:"text/javascript",
            jsonp:"callback",
            success:callback
        });
    };

    avalon.filters.getDay = function (str) {
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

        return hour+":"+min;
    };

    avalon.filters.getYear = function (str) {
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

        return month+"-"+day;
    }

    avalon.filters.getStatus = function (type) {
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
    };


    var timer;

    var vm = avalon.define({
        $id:"timeline",
        detailList:[],
        prefix:"http://221.12.173.124:8080/inspectservice/",
        showDetail:false,
        play:false,
        currentIndex:1,
        routName:"",
        picture:[],
        detail:{
            list:[]
        },
        onShowDetail: function (obj) {
            vm.play = false;

            if(timer){
                clearInterval(timer);
            }

            vm.detail = obj;
            vm.showDetail = true;
            if(vm.play){
                vm.onStopPlay();
            }
        },
        onCloseDetail: function () {
            vm.showDetail = false;
        },
        getPic: function (el) {
            $.getJSONP(prefix+"getInspectObjectContentResultFileList/"+el.FId, function (rep) {
                el.picture = rep;
            })
        },
        onPlay: function () {
            vm.play = !vm.play;
            if(vm.play){
                timer = setInterval(function () {
                    if(vm.currentIndex >= (vm.detailList.length-2) ){
                        vm.play = false;
                        return clearInterval(timer);
                    }
                    $(".arrowdown").trigger("click");

                },4000);
            }else{
                clearInterval(timer);
            }

        }
    });

    avalon.scan();

    var app = {
        init: function (data) {
            var s = document.createElement("script");
            s.src = "js/history.js";
            var header =document.getElementsByTagName("head")[0];
            header.appendChild(s);
            var self = this;
            $(".theme").bind("arrowup", function (e,index) {
                vm.currentIndex = index+1;
                self.showObj();
            }).bind("arrowdown", function (e,index) {
                vm.currentIndex = index+1;
                self.showObj();
            });

            setTimeout(function () {
                $(".arrowup").trigger("click");
            },500);

        },
        render: function () {
            this.getData();
        },
        getData: function () {
            var self = this;
            $.getJSONP(prefix+"getRecordById/"+this.GetQueryString("id"), function (rep) {
                vm.routName = rep.routName;
                vm.detailList = self.tranData(rep);
                avalon.nextTick(function () {
                    self.init();
                })
            })
        },
        showObj: function () {
            var target = $(".obj-detail").css({
                "opacity":0,
                "right":200
            });

            var right = $(".arrow-right").css({
                opacity:0,
                right: -100
            })

            $("#content").find("li").eq(vm.currentIndex).find(".detail .noInfo").parents("tr").remove();
            target.html($("#content").find("li").eq(vm.currentIndex).find(".detail").html());

            setTimeout(function () {
                right.animate({
                    opacity:1,
                    right: -120
                });
            },500);

            setTimeout(function () {
                target.animate({
                    opacity:1,
                    right:150
                })
            },800)

        },
        tranData: function (result) {
            var data  = result.recordResultContentList, sectionList = [];
            if(data.length > 1){
                /*合并区段*/
                var target = data[0];
                data[0].rows = 1;
                sectionList.push({id:data[0].sectionId,name:data[0].sectionName})
                for(var i = 1;i<data.length;i++){
                    data[i].picture = [];
                    if(target.sectionId == data[i].sectionId){
                        target.rows +=1;
                    }else{
                        target = data[i];
                        target.rows = 1;
                        sectionList.push({id:data[i].sectionId,name:data[i].sectionName})
                    }
                }
                /*合并对象*/
                var t = data[0];
                data[0].objrows = 1;
                for(var i = 1;i<data.length;i++){
                    if(t.FObjectId == data[i].FObjectId){
                        t.objrows += 1;
                    }else{
                        t = data[i];
                        t.objrows = 1;
                    }
                }

                var dl = result.recordSecDetailList;

                for(var i = 0;i<data.length;i++){
                    data[i].CheckResult = "未记录";
                    for(var d= 0;d < dl.length;d++){
                        if(dl[d].FSectionId == data[i].sectionId){
                            var beginstr = this.tranDate(dl[d].FBeginTime,"day");
                            if(dl[d].FBeginInputType == 0){
                                beginstr += "(手动)";
                            }
                            var endstr = this.tranDate(dl[d].FEndTime,"day");
                            if(dl[d].FEndInputType == 0){
                                endstr += "(手动)";
                            }
                            data[i].CheckResult = beginstr ;
                        }
                    }
                }
            }

            for (var i = 0; i < sectionList.length; i++) {
                var section = sectionList[i];
                section.list = [];
                for (var j = 0; j < data.length; j++) {
                    var obj = data[j];
                    if(section.id == obj.sectionId){
                        section.list.push(obj);
                    }
                }
            }


            return [{id:"",name:"",list:[{CheckResult:""}]}].concat(sectionList).concat([{id:"",name:"",list:[{CheckResult:""}]}]);
        },
        tranDate: function (str,type) {
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
            if(type == "year") {
                return year;
            }else if(type == "day"){
                return month +"月" + day +"日";
            }
        },
        onStopPlay: function () {
            vm.play = false;
            clearInterval(this.timer);
        },
        getIndex: function () { /*播放时计算在哪个位置*/
            var h = 0,items = this.items;
            for (var i = 0; i < items.length; i++) {
                if(h >= document.body.scrollTop ){
                    this.index = i;
                    document.body.scrollTop = h;
                    break;
                }else{
                    h += $(items[i]).height() + 20;
                }
            }
        },
        GetQueryString:function(name)
        {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        }

    }


    return app.render();

});