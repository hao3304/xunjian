/**
 * Created by jack on 2015/8/24.
 */

var Vue = require("component_modules/vue.js");
var filter = require("component/filter/filter.js");

module.exports = Vue.component("c-datagrid",{
    template:__inline("datagrid.html"),
    props:["options"],
    data: function () {
        return {

        }
    },
    methods:{
        render:function(){
            this.autoWidth();
        },
        autoWidth:function(){
            var tds = $(this.$el).find(".c-datagrid-header .table tr:first th");
            for (var i = 0; i < tds.length; i++) {
                var w = $(tds[i]).width();
                $(this.$el).find(".c-datagrid-row-"+this.options.columns[i].field).width(w);
                $(this.$el).find(".c-datagrid-th-"+this.options.columns[i].field).width(w);
            }
        },
        getText:function(val,o){
            if(o.filter){
                return o.filter(val);
            }else{
                return val;
            }
        },
        onClick: function (option,data) {
            if(option.onClick){
                option.onClick.call(this.$parent,data);
            }
        }
    },
    watch:{
        "options.data":function(){
            var self = this;
            Vue.nextTick(function(){
                self.render();
            })
        }
    },
    ready:function(){
        this.render();
    }
});