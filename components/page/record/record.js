/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var Service = require("main/service.js");
var filter = require("filter/filter.js");

var _query = {
   beginDate:"",
   endDate:"",
   checkState:-1
};

module.exports = Vue.extend({
   inherit:true,
   template:__inline("record.html"),
   data: function () {
      return {
         records:[],
         query:_query
      }
   },
   methods:{
      render:function(){
         this.getList();
      },
      Continued: function (r) {
         var start = r.FStartTime.replace("/Date(","").replace("+0800)/","")/1000,
             end = r.FFinishiTime.replace("/Date(","").replace("+0800)/","")/1000;
         var diff = end - start;

         var hour = parseInt(diff/3600),
             min = parseInt((diff - hour*3600)/60),
             sec = parseInt(diff - hour*3600 - min*60);

         var str = "";
         if(hour){str+=hour +"小时"}
         if(min){str+=min +"分"}

         return str?str:"-";
      },
      renderDatePicker: function () {
         var self = this;
         laydate.skin('molv');
         var start = {istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#beginDate",choose: function (d) {
            self.query.beginDate = d;
            end.min = d;
            end.start = d
         }};
         var end = {istime: true, format: 'YYYY-MM-DD hh:mm:ss',elem:"#endDate",choose: function (d) {
            self.query.endDate = d;
            start.max = d;
         }};
         laydate(start);

         laydate(end)
      },
      getList: function () {
         var self = this;
         self.loading = true;
         Service.getRecordList({}, function (rep) {
            self.loading = false;
            self.records  = rep.reverse();
         })
      },
   
      onDelRecord: function (id) {
         var r = confirm("是否删除该记录？");
         if(r){
            var self = this;
            this.loading = true;
            Service.deleteRecord(id, function (rep) {
               self.loading = false;
               self.render();
            })
         }
      },
      onQuery: function () {
         var param = {
            checkState:this.query.checkState>=0?this.query.checkState:undefined,
            beginDate:this.query.beginDate?this.query.beginDate:undefined,
            endDate:this.query.endDate?this.query.endDate:undefined
         };
         var self = this;
         self.loading = true;
         Service.getRecordList(param, function (rep) {
            self.loading = false;
            self.records  = rep;
         })
      },
      onReset: function () {
         this.query.checkState = -1;
         this.query.beginDate = "";
         this.query.endDate = "";
         $("#beginDate").val("");
         $("#endDate").val("");
         this.getList();

      }
   },
   ready: function () {
      this.render();
      this.renderDatePicker();
      var self = this;
      this.$on("record-reload", function () {
         self.render();
      })
   }
});