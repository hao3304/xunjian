/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");


module.exports = Vue.extend({
   inherit:true,
   data: function () {
      return {
         Recent:[],
         Task:[],
         Files:[]
      }
   },
   template:__inline("home.html"),
   methods:{
      renderRecent: function () {
         var self = this;
         Service.getRecentRecordList(10,function (rep) {
            self.Recent = rep;
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