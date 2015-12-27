/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");
var datagrid = require("datagrid/datagrid.js");


module.exports = Vue.extend({
   inherit:true,
   data: function () {
      return {
         Recent:[],
         Task:[],
         Files:[],
         "datagrid_record":{
            columns:[
               {"title":"检查日期",field:"FStartTime",filter:filter.tranDate},
               {"title":"持续时间",field:"FFinishiTime",filter:filter.tranDate},
               {"title":"路线",field:"checkPersonName"},
               {"title":"巡检人",field:"FCheckPerson"},
               {"title":"评价",field:"FCheckStatus",filter:filter.getStatus}
            ],
            data:[],
            height:"200px"
         }
      }
   },
   template:__inline("home.html"),
   methods:{
      renderRecent: function () {
         var self = this;
         Service.getRecentRecordList(10,function (rep) {
            self.datagrid_record.data = rep;
         })
      },
      renderTask: function () {
         var self = this;
         Service.getRecentTaskList(10,function (rep) {
            self.Task = rep;
         })
      },
      renderPic: function () {
         var self = this;
         Service.GetRecentFileInfo(4, function (rep) {
            if(rep){
               for(var i=0;i<rep.length;i++){
                  rep[i].FFileRelativeAddress = "http://221.12.173.124:8080/inspectservice/"+rep[i].FFileRelativeAddress;
               }
               self.Files = rep;
            }
         })
      }
   },
   ready: function () {
      var self = this;
      self.renderRecent();
      self.renderTask();
      self.renderPic();
      this.$on("ready",function(){
         self.renderRecent();
         self.renderTask();
         self.renderPic();
      })

   }
});