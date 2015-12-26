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

    var vm = avalon.define({
        $id:"timeline",
        detailList:[],
        footNum:0,
        currentYear:"",
        currentDay:"",
        $computed:{
            num1:{
                get: function () {
                    if(this.footNum < 10){
                        return "num"+this.footNum;
                    }else{
                        return "num"+ this.footNum%10
                    }
                }
            },
            num2:{
                get: function () {
                    if(this.footNum < 10){
                        return "num0";
                    }else{
                        return "num"+ parseInt(this.footNum/10)
                    }
                }
            }
        }
    });

    avalon.scan();


    var app = {
        options:{
            itemHeight:110,
            viewItem:3
        },
        ele:{
            $target:$(".timeline-group"),
            $items:$(".timeline-group").find("li")
        },
        init: function (data) {
            this.eventBind();
            this.top = this.ele.$target.scrollTop();
            this.maxScroll = this.options.itemHeight*data.length;
            this.minScroll = 0;

            this.changeStyle();


            this.getLink();
        },
        render: function () {
            this.renderFooter();
            this.getData();
        },
        getData: function () {
            var self = this;
            $.getJSONP(prefix+"getRecordById/10025", function (rep) {
                vm.detailList = rep.recordResultContentList;
                avalon.nextTick(function () {
                    self.init(rep.recordResultContentList);
                })
            })
        },
        eventBind: function () {
            var self = this;
            this.ele.$target.mousewheel($.proxy(this._scroll,this));
        },
        _scroll:function(event, delta) {
            var d = Date.parse(new Date()),self = this;
            var move = function () {

                this.top += event.deltaY*this.options.itemHeight;
                this.ele.$target.find("li:first").animate({
                    "margin-top":this.top
                },"fast","linear", function () {
                    self.changeStyle();
                });
            };
            console.log(this.maxScroll)
            if(event.deltaY <0&&(Math.abs(this.top)+(this.options.itemHeight*this.options.viewItem))<this.maxScroll){
                move.call(this);
            }else if(event.deltaY > 0 && Math.abs(this.top )> this.minScroll){
                move.call(this);
            }
        },
        getViewItem: function () {
            var lst = [],self = this;
            var top = this.top,bottom = this.top - this.options.itemHeight * this.options.viewItem;
            var marginTop = this.ele.$target.find("li:first")[0].style.marginTop;
            this.ele.$target.find("li").each(function (index,ele) {
                if(index*self.options.itemHeight < Math.abs(bottom) && index*self.options.itemHeight >= Math.abs(top)){
                    lst.push(ele);
                }
            });
            return lst;
        },
        changeStyle: function () {
            var lis = this.getViewItem();
            $(lis[0]).removeClass("active");
            $(lis[1]).addClass("active");
            $(lis[2]).removeClass("active");
            this.ele.$target.trigger("changeView");
        },
        renderFooter: function () {
            var self = this;
            this.ele.$target.on("changeView", function () {
                var lis = self.getViewItem();
                vm.footNum = $(lis[lis.length-2]).nextAll().length-1;

                var str = $(lis[1]).data("time");
                vm.currentYear = self.tranData(str,"year");
                vm.currentDay = self.tranData(str,"day");
            });
        },
        getLink: function () {
            var head = document.getElementsByTagName('head')[0],
                cssURL = 'css/style.css',
                linkTag = document.createElement('link');

            linkTag.id = 'dynamic-style';
            linkTag.href = cssURL;
            linkTag.setAttribute('rel','stylesheet');
            linkTag.setAttribute('media','all');
            linkTag.setAttribute('type','text/css');
            head.appendChild(linkTag);
        },
        tranData: function (str,type) {
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
                return month +"ÔÂ" + day +"ÈÕ";
            }
        }

    }

    return app.render();

});