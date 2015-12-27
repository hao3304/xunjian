/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Router = require("component_modules/director.js").Router;
var grid = require("datagrid/datagrid.js");

module.exports = Vue.extend({
   inherit:true,
   template:__inline("login.html"),
   data: function () {
      return {
         logName:"dam_feid",
         logPass:"fei123",
         isWarn:false
      }
   },
   methods:{
      onLogin: function () {
         this.loading = true;
         var self = this;
         Service.onLogin({logName:this.logName,logPass:this.logPass}, function (rep) {
            if(rep){
               Service.setCookie("FUserId",rep.FUserId,3600*1000);
               self.$parent.init();
            }else{
               self.loading = false;
               self.isWarn = true;
            }

         })

      }
   },
   computed:{
      "progress": function () {
         var s = this.nstep/this.step;
         if(s==1){
            setTimeout(function () {
               var router = new Router();
               router.setRoute("home");
               this.loading = false;
            },500)
         }
         return Math.round(s*100,2) +"%";
      }
   },
   ready: function () {

   }
});