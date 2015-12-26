/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");
var Service = require("main/service.js");
var filter = require("component/filter/filter.js");
var Router = require('component_modules/director').Router;

var model = {
   id:"",
   objectname:"",
   majorId:0,
   inspectCycle:"",
   cycleType:"",
   categoryId:"",
   inspectStatus:"",
   remark:""
};

module.exports = Vue.extend({
   inherit:true,
   template:__inline("route.html"),
   data: function () {
      return {
         styles:{
            "max-height":document.documentElement.clientHeight-300 +"px",
            "overflow-y":"auto"
         },
         list:[],
         target:model,
         selectRoute:"",
         selectRouteName:"",
         sections:[],
         sectionList:[],
         route:{
            id:"",
            routName:"",
            cycle:"",
            cycleType:0,
            status:1,
            description:"",
            majorId:0,
            remark:""
         },
         section:{
            radioA:"",
            radioB:"",
            description:"",
            remark:""
         }
      }
   },
   methods:{
      render: function () {
         this.getList();
      },
      getList: function () {
         var self = this;
         this.loading = true;
         Service.GetRoutList({}, function (rep) {
            self.list = rep;
            self.loading = false;
         })
      },
      onAddRoute: function () {
         this.routeClear();
         this._showRouteModal();
      },
      onEditRoute: function (l) {
         this.route.id = l.FId;
         this.route.routName = l.FRoutName;
         this.route.cycle = l.FCycle;
         this.route.cycleType = l.FCycleType;
         this.route.status = l.FStatus;
         this.route.description = l.FDescription;
         this.route.majorId = 0;
         this.route.remark = l.FRemark;

         this._showRouteModal();
      },
      onDelRoute: function (id) {
         var r = confirm("是否删除该路线？");
         if(r){
            this.loading = true;
            var self = this;
            Service.DeleteRout(id, function (r) {
               self.loading = false;
               self.render();
            });

            window.event.stopPropagation();
         }
      },
      onSelect: function (v) {
         this.selectRoute = v.FId;
         this.selectRouteName = v.FDescription;
         this.renderSection(this.selectRoute);
      },
      routeClear: function () {
         this.route.id = "";
         this.route.routName = "";
         this.route.cycle = "";
         this.route.cycleType = 0;
         this.route.status = 1;
         this.route.description = "";
         this.route.majorId = 0;
         this.route.remark = "";
      },
      _hideRouteModal: function () {
         $('#routeModal').modal('hide')
      },
      _showRouteModal: function () {
         $('#routeModal').modal('show')
      },
      _hideSectionModal: function () {
         $('#sectionModal').modal('hide')
      },
      _showSectionModal: function () {
         $('#sectionModal').modal('show')
      },
      renderSection: function (id) {
         this.loading = true;
         var self = this;
         Service.GetRoutSectionList(id, function (rep) {
            var rep = rep.sort(function (a,b) {
               return parseInt(a.FOrderIndex) - parseInt(b.FOrderIndex)
            });
            self.loading = false;
            self.sections = rep;
         })
      },
      onSubmitRoute: function () {
         this.loading = true;
         var self = this;
         if(!this.route.id){
            Service.AddRout(this.route, function (rep) {
               self.render();
               self._hideRouteModal();
               self.loading = false;
            })
         }else{
            Service.UpdateRout(this.route, function (rep) {
               self.render();
               self._hideRouteModal();
               self.loading = false;
            });
         }

      },
      getSectionList: function () {
         this.sectionList =  this.base.sectionList;
      },
      onAddSection: function () {
         this.getSectionList();
         this._showSectionModal();
      },
      _hasCheck: function (id) {
         var checked = false;
         var lst = this.sections;
         for(var i=0;i<lst.length;i++){
            if(lst[i].FSectionId == id){
               checked = true;
            }
         }
         return checked;
      },
      onSelectSection: function (id) {
         var self = this;
         this.loading = true;
         Service.addRoutSection({
            routid:this.selectRoute,
            sectionId:id,
            orderIndex:this.sections.length>0?this.sections[this.sections.length-1].FOrderIndex+1:1
         }, function (rep) {
            self.loading = false;
            self.renderSection(self.selectRoute);
         })
      },
      onSelectChange: function (e) {
         var id = e.target.value;
         if(e.target.checked){
            this.onSelectSection(id);
         }else{
            this.onDelSection(id);
         }
      },
      onDelSection: function (id) {
         var r = confirm("确定删除该区段？");
         if(r){
            var self = this;
            this.loading = true;
            Service.deleteRoutSection({
               routid:this.selectRoute,
               sectionId:id
            }, function (rep) {
               self.loading = false;
               self.renderSection(self.selectRoute);
            })
         }
         event=event?event:window.event;
         event.stopPropagation();

      },
      changeUp: function (id,index) {
         if(index>0&&this.sections.length>1){
            this.loading = true;
            var self = this;
            Service.changeRoutSectionIndex({
               routid:this.selectRoute,
               sectionId:id,
               sectionId2:this.sections[index-1].FSectionId
            },function(rep){
               self.loading = false;
               self.renderSection(self.selectRoute);
            })

         }
         event=event?event:window.event;
         event.stopPropagation();
         event=event?event:window.event;
         event.stopPropagation();
      },
      changeDown: function (id,index) {
         if(index < this.sections.length){
            this.loading = true;
            var self = this;
            Service.changeRoutSectionIndex({
               routid:this.selectRoute,
               sectionId:id,
               sectionId2:this.sections[index+1].FId
            },function(rep){
               self.loading = false;
               self.renderSection(self.selectRoute);
            })

         }
         event=event?event:window.event;
         event.stopPropagation();
      },
      doRoute: function (s) {
         var router = new Router();
         var name = s.sectionName.replace(/#/g,"-%%-");
         router.setRoute("route/"+ s.FId +"/"+ s.FSectionId+"/"+encodeURI(name) );
      }
   },
   ready: function () {
      this.render();
   }
});
