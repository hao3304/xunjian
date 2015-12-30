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




    var vm = avalon.define({
        $id:"timeline",
        detailList:[],
        prefix:"http://221.12.173.124:8080/inspectservice/",
        showDetail:false,
        play:false,
        picture:[],
        detail:{
            list:[]
        },
        onShowDetail: function (obj) {
            vm.detail = obj;
            vm.showDetail = true;
            if(vm.play){
                vm.onStopPlay();
            }
        },
        onCloseDetail: function () {
            vm.showDetail = false;
        },
        onScrollBottom: function () {
            app.onScrollBottom.call(app);
        },
        onScrollTop: function () {
            app.onScrollTop.call(app);
        },
        onPlay: function () {
            app.onPlay.call(app);
        },
        onStopPlay: function () {
            app.onStopPlay.call(app)
        },
        getPic: function (el) {
            $.getJSONP(prefix+"getInspectObjectContentResultFileList/"+el.FId, function (rep) {
                el.picture = rep;
            })
        }
    });

    avalon.scan();

    var app = {
        init: function (data) {
            this.$body = $("body"),
                this.clientHeight = document.documentElement.clientHeight,
                this.scrollHeight = $(document).height(),
                this.scrollTop = document.body.scrollTop,
                this.items = $(".timeline li"),
                this.index = 0; /*播放游标*/

            var self = this;
            this.$body.on("mousewheel", function () {
                if(vm.play){
                    self.onStopPlay();
                }
            });
        },
        render: function () {
            this.getData();
        },
        getData: function () {
            var self = this;
            $.getJSONP(prefix+"getRecordById/"+this.GetQueryString("id"), function (rep) {
                vm.detailList = self.tranData(rep);
                avalon.nextTick(function () {
                    self.init();
                })
            })
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
                    data[i].CheckResult = "未现场检查";
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
                            data[i].CheckResult = beginstr +"<br/>至<br/>" + endstr;
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
            return sectionList;
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
        onPlay: function () {
            if(this.scrollHeight > this.clientHeight){
                var self = this;
                this.getIndex();
                vm.play = true;
                this.timer = setInterval(function(){
                    var scroll =self.$body.scrollTop()+ self.items[self.index].scrollHeight+20;

                    if(scroll > (self.scrollHeight -self.clientHeight) ){
                        scroll = scroll- (self.scrollHeight -self.clientHeight);
                        self.onStopPlay();
                    }

                    self.$body.animate({
                        scrollTop:scroll
                    });
                    self.index +=1;

                },2000)

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
        onScrollBottom: function () {
            this.$body.animate({
                scrollTop:$(document).height() - document.documentElement.clientHeight
            });
        },
        onScrollTop: function () {
            this.$body.animate({
                scrollTop:0
            });
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