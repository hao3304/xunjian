/**
 * Created by jack on 2015/8/19.
 */

var Vue = require("component_modules/vue.js");
var foot = require("foot/foot.js");
var pager = require("pager/pager.js");


module.exports = Vue.extend({
   inherit:true,
   template:__inline("marker.html"),
   data: function () {
      return {
         list:[]
      }
   },
   methods:{
      render: function () {
         
      }
   },
   ready: function () {
      this.render();
   }
});