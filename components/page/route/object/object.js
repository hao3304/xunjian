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
   template:__inline("object.html"),
   data: function () {
      return {
         list:[],
         objs:[],
         sectionObj:[],
         tab:"section"
      }
   },
   methods:{
      render: function () {
         var id = this.routeObject.id;
         this.getList(id);
         this.getSectionObj(id);
      },
      getList: function (id) {
         var self = this;
         Service.GetRoutSectionObjectRelateList(id, function (rep) {
            self.list = rep;
         });
      },
      getObj: function () {
         var self = this;
         this.loading = true;
         Service.getInspectObjectList({}, function (rep) {
            self.objs = rep;
            self.loading = false;
         })
      },
      getSectionObj: function () {
         var self = this;
         Service.GetInspectSectionObjectList(this.routeObject.sid, function (rep) {
            self.sectionObj = rep;
         })
      },
      _hasChecked: function (id) {
         var checked = false;
         var lst = this.list;
         for(var i=0;i<lst.length;i++){
            if(lst[i].FObjectId == id){
               checked = true;
            }
         }
         return checked;
      },
      onAddObject: function () {
         this._showObjModal();
         this.getObj();
      },
      onDelObject: function (id) {
         var r = confirm("是否删除该对象？");
         if(r){
            var self = this;
            this.loading = true;
            Service.deleteRoutSectionObject(id, function (rep) {
               self.loading = false;
               self.getList(self.routeObject.id);
            })
         }
      },
      _getRelationId: function (id) {
         var rid = "";
         var lst = this.list;
         for(var i=0;i<lst.length;i++){
            if(lst[i].FObjectId == id){
               rid = lst[i].FId;
            }
         }
         return rid;
      },
      onCheckObj: function (id) {

         this.loading = true;
         var self = this;
         if(window.event.target.checked){
            Service.AddRoutSectionObject({
               routSectionId:this.routeObject.id,
               sectionId:this.routeObject.sid,
               objectId:id,
               orderIndex:this.list.length>0?this.list[this.list.length-1].FOrderIndex:1
            }, function (rep) {
               self.loading = false;
               self.render();
            })
         }else{
            this.loading = false;
            this.onDelObject($(window.event.target).data("relationid"));
         }

      },
      _showObjModal: function () {
         $("#objectModal").modal("show");
      },
      _hideObjModal: function () {
         $("#objectModal").modal("hide");
      },
      changeTab: function (tab) {
         this.tab = tab;
      },
      changeUp: function (id,index) {
         if(index>0&&this.list.length>1){
            this.loading = true;
            var self = this;
            Service.changeRoutSectionObjectIndex({
               sectionId:this.routeObject.id,
               objectId1:id,
               objectId2:this.list[index-1].FObjectId
            },function(rep){
               self.loading = false;
               self.getList(self.routeObject.id);
            })

         }
         event=event?event:window.event;
         event.stopPropagation();
         event=event?event:window.event;
         event.stopPropagation();
      },
      changeDown: function (id,index) {
         if(index < this.list.length){
            this.loading = true;
            var self = this;
            Service.changeRoutSectionObjectIndex({
               sectionId:this.routeObject.id,
               objectId1:id,
               objectId2:this.list[index+1].FObjectId
            },function(rep){
               self.loading = false;
               self.getList(self.routeObject.id);
            })

         }
         event=event?event:window.event;
         event.stopPropagation();
      },
      getName: function (n) {
         var n = decodeURI(n);
         return n.replace(/-%%-/g,"#");
      }
   },
   ready: function () {
      this.render();
      var self = this;
      this.$on("reload-object", function (p) {
         self.routeObject.id = p.id;
         self.routeObject.sid = p.sid;
         self.routeObject.name = p.name;
         self.getSectionObj(p.id);
         self.getList(p.id);
      })
   }
});
