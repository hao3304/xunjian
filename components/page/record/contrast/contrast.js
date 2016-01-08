/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");

module.exports = Vue.extend({
   inherit:true,
   template:__inline("contrast.html"),
   data: function () {
      return {
         record: [],
         routes: [],
         times: [],
         selectRoute: "",
         contents: [],
         selectTime:[],
         ths:[]
      }
   },
   methods:{
      render:function(){
         this.getRecordList();
      },
      getRecordList: function () {
         var self = this;
         self.loading = true;
         Service.getRecordList({}, function (rep) {
            self.loading = false;

            var r = {};
            for (var i = 0; i < rep.length; i++) {
               var obj = rep[i];
               r[rep[i].FRoutId] = {value:rep[i].FRoutId,text:rep[i].routName};
            }

            var lst = [];
            for(var i in r){
               lst.push(r[i]);
            }

            self.routes = lst;
            self.records  = rep;
         })
      },
      transData: function (data) {

         var lst = [],th = {};

         for(var i in this.ths){
            th[this.ths[i].id] = "";
         }

         if(data.length > 1){
            for(var i=0;i<data.length;i++){
               var sections = data[i].sectionObjectList;
               for(var s=0;s<sections.length;s++){
                  var contents = sections[s].contentList;
                  for(var c = 0;c<contents.length;c++){
                     lst.push($.extend({
                        SectionId:data[i].FSectionId,
                        SectionName:data[i].sectionName,
                        ObjectName:sections[s].objectame,
                        ObjectId:sections[s].FObjectId,
                        ContentName:contents[c].FContentName,
                        ContentStatus:0,
                        ContentId:contents[c].FId,
                        Remark:"",
                        InputType:0,
                        ContentValue:contents[c].FContentDefault,
                        FileList:[]
                     },th))
                  }
               }
            }
         }
         data = lst;
         var target = data[0];
         data[0].rows = 1;
         for(var i = 1;i<data.length;i++){
            if(target.SectionId == data[i].SectionId){
               target.rows +=1;
            }else{
               target = data[i];
               target.rows = 1;
            }
         }

         /*合并对象*/
         var t = data[0];
         data[0].objrows = 1;
         for(var i = 1;i<data.length;i++){
            if(t.ObjectId == data[i].ObjectId){
               t.objrows += 1;
            }else{
               t = data[i];
               t.objrows = 1;
            }
         }

         return data;

      },
      getDetail: function (id) {
         var self = this;
         this.loading = true;
         Service.getRoutStruct(id, function (rep) {
            self.contents =self.transData(rep);
            self.loading = false;
         })
      },
      getDetailInfo: function (id) {
         var self = this;
         this.loading = true;
         Service.getRecordById(id, function (rep) {
            self.loading = false;
            self.contrastData(rep.recordResultContentList,id);
         });
      },
      contrastData: function (data,record) {

         for (var i = 0; i < this.contents.length; i++) {
            var obj = this.contents[i];
            for (var j = 0; j < data.length; j++) {
               var obj1 = data[j];
               if(obj1.FContentId == obj.ContentId){
                  obj[record] ={status:obj.FContentStatus,value:obj1.FContentValue};
               }
            }

         }

      },
      onCheck: function (t) {
         if(window.event.target.checked){
            this.getDetailInfo(t.id);
         }
      }
   },
   watch:{
      selectRoute: function (v) {
         var lst = [];
         if(v > 0){
            this.ths = [];
            for (var i = 0; i < this.records.length; i++) {
               var obj = JSON.parse(JSON.stringify(this.records[i]));
               if(obj.FRoutId == v){
                  obj.isChecked = false;
                  lst.push(obj);
                  this.ths.push({name:filter.tranDate(obj.FCheckTime),id:obj.FId,show:false})
               }
            }
            this.getDetail(v);
         }
         this.times = lst;
      }
   },
   ready: function () {
      this.render();
   }
});