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
   template:__inline("position.html"),
   data: function () {
      return {
         do:"添加",
         selectPosition:"",
         positionList:[],
         selectObjects:[],
         position:{
            id:"",
            name:"",
            parentId:"",
            locationX:"",
            locationY:"",
            locationZ:""
         },
         position2:{
            id:"",
            name:"",
            parentId:"",
            locationX:"",
            locationY:"",
            locationZ:""
         }
      }
   },
   methods:{
      render: function () {
         this.getTreeData();
         this.init();
      },
      init: function () {
         var self = this;

      },
      getTreeData: function () {
         var self = this;
         Service.GetLocationList({}, function (rep) {
            var data = [
               {
                  pId:-1,
                  id:-1,
                  name:"全部部位"
               }
            ];
            for(var i=0;i<rep.length;i++){
               rep[i].pId = rep[i].FParentId;
               rep[i].id = rep[i].FId;
               rep[i].name = rep[i].FName;
               data.push(rep[i]);
            }

            self.renderTree(data);
         });
      },
      getObjectData: function () {
         var self = this;
         this.loading = true;
         Service.getInspectObjectList({}, function (rep) {
            self.loading = false;
            self.positionList = rep;
         })
      },
      getPositionObj: function () {
         var self = this;
         this.loading = true;
         Service.GetObjectByLocation({LocationId:this.selectPosition}, function (rep) {
            self.loading = false;
            self.selectObjects = rep;
         })
      },
      _hasCheck: function (id) {
         var checked = false;
         var lst = this.selectObjects;
         for(var i=0;i<lst.length;i++){
            if(lst[i].FId == id){
               checked = true;
            }
         }
         return checked;
      },
      onSubmitObj: function () {
         var inputs = $("#objectModal").find("input:checked"),lst = [];
         inputs.each(function (index,ele) {
            lst.push($(ele).data("value"));
         });
         var self = this;
         Service.updateLocationObjectList(JSON.stringify({
            locationId:String(this.selectPosition),
            objectList:lst
         }), function (rep) {
            self._hideObjectModal();
            self.getPositionObj();
         })

      },
      renderTree: function (data) {
         data[0].open = true;
         $.fn.zTree.init($("#tree"), {
            data: {
               simpleData: {
                  enable: true
               }
            },
            callback:{
               onClick: this.onTreeSelect
            }
         }, data);
      },
      onTreeSelect: function (e,type,data) {
         this.selectPosition = data.id;
         this.position2.id= data.id;
         this.position2.name= data.name;
         this.position2.parentId= data.pId;
         this.position2.locationX= data.FLocationX;
         this.position2.locationY= data.FLocationY;
         this.position2.locationZ= data.FLocationZ;

         this.getPositionObj();
      },
      onAddPosition: function () {
         this.position.id= "";
         this.position.name= "";
         this.position.parentId= "";
         this.position.locationX= "";
         this.position.locationY= "";
         this.position.locationZ= "";
         this._showModal();

         this.do = "添加";
      },
      onSubmitPosition: function () {
         this.position.parentId = this.selectPosition;
         var self = this;
         this.loading = true;
        if(this.position.id){
           Service.UpdateLocation(this.position, function (rep) {
              self.loading = false;
              self._hideModal();
              self.getTreeData();
           })
        }else{
           Service.AddLocation(this.position, function (rep) {
              self.loading = false;
              self._hideModal();
              self.getTreeData();
           })
        }
      },
      onDelPosition: function () {
         var r = confirm("是否删除该巡检部位？");
         if(r){
            var self = this;
            this.loading = true;
            Service.DeleteLocation(this.position2.id, function () {
               self.getTreeData();
               self.loading = false;
            });
         }
      },
      onEditPosition: function () {
         this.position.id=this.position2.id;
         this.position.name= this.position2.name;
         this.position.parentId= this.position2.parentId;
         this.position.locationX= this.position2.locationX;
         this.position.locationY= this.position2.locationY;
         this.position.locationZ= this.position2.locationZ;

         this.do = "编辑";

         this._showModal();
      },
      onAddObject: function () {
         this.getObjectData();
         this._showObjectModal();
      },
      _hideModal: function () {
         $('#positionModal').modal('hide');
      },
      _showModal: function () {
         $('#positionModal').modal('show')
      },
      _hideObjectModal: function () {
         $('#objectModal').modal('hide');
      },
      _showObjectModal: function () {
         $('#objectModal').modal('show');
      }
   },
   ready: function () {
      this.render();
   }
});