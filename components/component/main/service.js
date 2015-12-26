/**
 * Created by jack on 2015/8/17.
 */
//var prefix = "";
var prefix = "http://221.12.173.124:8080/inspectservice/DataManagerService/";

$.del = function (url,callback) {
    return $.ajax({
        type:"delete",
        contentType:"application/json",
        success:callback,
        dataType:"json",
        url:url
    })
};

$.put = function (url,data,callback) {
    return $.ajax({
        type:"put",
        contentType:"application/json",
        success:callback,
        dataType:"json",
        data:data,
        url:url
    })
};

$.getJSONP = function(url,callback,async){
    if(typeof async == "undefined"){
        async = true;
    }
    return $.ajax({
        url:url,
        dataType:"jsonp",
        async:async,
        contentType:"text/javascript",
        jsonp:"callback",
        success:callback
    });
}

$.getJSONP2 = function(url,data,success,error){
    return $.ajax({
        url:url,
        data:data,
        dataType:"jsonp",
        jsonp:"callback",
        contentType:"text/javascript",
        success:success,
        error:error
    });
}



function setCookie(cname,cvalue,exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + exdays);
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function clearCookie(name) {
    setCookie(name, "", -1);
}

/*获取最近个数的巡检记录*/
function getRecentRecordList(p,c){
    $.getJSONP(prefix + "GetRecentRecordList/"+p, c);
}

function setSession(p,c){
    $.getJSONP(prefix +"SetSession/stationId/"+p,c,false);
}
/*获取最新任务*/
function getRecentTaskList(p,c){
    $.getJSONP(prefix + "getRecentTaskList/"+p, c);
}

/*获取巡检任务*/
function getPlanTaskList(p,c){
    $.getJSONP2(prefix + "getPlanTaskList",p, c);
}

/*添加巡检任务*/
function addPlanTask(p,c){
    $.getJSONP2(prefix + "addPlanTask",p, c);
}

/*删除巡检任务*/
function deletePlanTask(id,c){
    $.getJSONP(prefix + "deletePlanTask/"+id, c);
}

/*更新巡检任务*/
function updatePlanTask(p,c){
    $.getJSONP2(prefix + "updatePlanTask",p, c);
}

/*获取巡检记录*/
function getRecordList(p,c){
    $.getJSONP2(prefix + "getRecordList",p, c);
}

/*审核巡检记录*/
function checkRecord(id,state,c){
    $.getJSONP(prefix + "checkRecord/"+id+"/"+state, c);
}

/*删除巡检记录*/
function deleteRecord(p,c){
    $.getJSONP(prefix + "deleteRecord/"+p, c);
}

/*获取巡检记录BY id*/
function getRecordById(id,c){
    $.getJSONP(prefix + "getRecordById/"+id, c);
}

/*获取巡检计划*/
function GetInspectPlanList(p,c){
    $.getJSONP2(prefix + "GetInspectPlanList",p, c);
}

/*添加巡检计划*/
function AddInspectPlan(p,c){
    $.getJSONP2(prefix + "AddInspectPlan",p, c);
}

/*更新巡检计划*/
function UpdateInspectPlan(p,c){
    $.getJSONP2(prefix + "UpdateInspectPlan",p, c);
}

/*删除巡检计划*/
function DeleteInspectPlan(id,c){
    $.getJSONP(prefix + "DeleteInspectPlan/"+id, c);
}

/*获取路线*/
function GetRoutList(p,c){
    $.getJSONP2(prefix + "GetRoutList",p, c);
}

/*获取巡检对象*/
function getInspectObjectList(p,c){
    $.getJSONP2(prefix + "getInspectObjectList",p, c);
}

/*添加巡检对象*/
function AddInspectObject(p,c){
    $.getJSONP2(prefix + "AddInspectObject",p, c);
}

/*删除巡检对象*/
function deleteInspectObject(id,c){
    $.getJSONP(prefix + "deleteInspectObject/"+id, c);
}


/*更新巡检对象*/
function UpdateInspectObject(p,c){
    $.getJSONP2(prefix + "UpdateInspectObject",p, c);
}


/*获取巡检类型*/
function GetInspectCategoryList(p,c){
    $.getJSONP2(prefix + "GetInspectCategoryList",p, c);
}

/*获取巡检区段*/
function GetInspectSectionList(p,c){
    $.getJSONP2(prefix + "GetInspectSectionList",p, c);
}

/*获取巡检部位*/
function GetLocationList(p,c){
    $.getJSONP2(prefix + "GetLocationList",p, c);
}

/*获取一条巡检记录的详细检查内容列表*/
function getObjectContentResultListByRecord(id,c){
    $.getJSONP(prefix + "getObjectContentResultListByRecord/"+id, c);
}

/*获取部位类型导航树 */
function GetLocationTypeTree(p,c){
    $.getJSONP2(prefix + "GetLocationTypeTree",p, c);
}

/*获取巡检类型导航树 */
function GetCategoryTypeTree(p,c){
    $.getJSONP2(prefix + "GetCategoryTypeTree",p, c);
}

/*获取巡检路线导航树*/
function GetRoutTypeTree(p,c){
    $.getJSONP2(prefix + "GetRoutTypeTree",p, c);
}


/*根据条件获取指定部位下对象的检查结果*/
function GetLocationObjectDataList(p,c){
    $.getJSONP2(prefix + "GetLocationObjectDataList",p, c);
}

/*根据条件获取指定对象的检查结果*/
function GetObjectDataList(p,c){
    $.getJSONP2(prefix + "GetObjectDataList",p, c);
}

/*根据条件获取指定巡检类型的对象的检查结果*/
function GetCategoryObjectDataList(p,c){
    $.getJSONP2(prefix + "GetCategoryObjectDataList",p, c);
}

/*根据条件获取指定巡检路线的对象的检查结果*/
function GetRoutObjectDataList(p,c){
    $.getJSONP2(prefix + "GetRoutObjectDataList",p, c);
}

/*根据条件获取指定巡检区段的对象的检查结果*/
function GetSectionObjectDataList(p,c){
    $.getJSONP2(prefix + "GetSectionObjectDataList",p, c);
}

function getInspectObjectContentResultFileList(p,c){
    $.getJSONP(prefix + "getInspectObjectContentResultFileList/"+p, c);
}


function onLogin(p,c){
    $.getJSONP2(prefix + "logUser",p, c);
}


function getUserList(c){
    $.getJSONP(prefix + "getUserList", c);
}

function getStationList(c){
    $.getJSONP(prefix + "getStationList", c,false);
}

/*根据路线获取区段*/
function GetRoutSectionList(p,c){
    $.getJSONP(prefix + "GetRoutSectionRelateList/"+p, c);
}

/*添加路线*/
function AddRout(p,c){
    $.getJSONP2(prefix + "AddRout",p, c);
}

/*删除路线*/
function DeleteRout(p,c){
    $.getJSONP(prefix + "DeleteRout/"+p, c);
}

/*修改路线*/
function UpdateRout(p,c){
    $.getJSONP2(prefix + "UpdateRout",p, c);
}

/*添加区段*/
function AddInspectSection(p,c){
    $.getJSONP2(prefix + "AddInspectSection",p, c);
}

/*删除路线中区段*/
function deleteRoutSection(p,c){
    $.getJSONP(prefix + "deleteRoutSection/"+ p.routid+"/"+ p.sectionId, c);
}

/*为路线添加区段*/
function addRoutSection(p,c){
    $.getJSONP(prefix + "addRoutSection/"+ p.routid+"/"+ p.sectionId+"/"+ p.orderIndex, c);
}

/*获取路线区段中的对象列表*/
function GetRoutSectionObjectRelateList(p,c){
    $.getJSONP(prefix + "GetRoutSectionObjectRelateList/"+ p, c);
}

/*修改路线区段顺序*/
function changeRoutSectionIndex(p,c){
    $.getJSONP(prefix + "changeRoutSectionIndex/"+ p.routid+"/"+ p.sectionId+"/"+ p.sectionId2, c);
}

/*修改区段中对象顺序*/
function changeRoutSectionObjectIndex(p,c){
    $.getJSONP(prefix + "changeRoutSectionObjectIndex/"+ p.sectionId+"/"+ p.objectId1+"/"+ p.objectId2, c);
}

/*删除区段跟路线的关系*/
function deleteRoutSectionObject(p,c){
    $.getJSONP(prefix + "deleteRoutSectionObject/"+ p, c);
}

/*添加路线中区段对象关系*/
function AddRoutSectionObject(p,c){
    $.getJSONP(prefix + "AddRoutSectionObject/"+ p.routSectionId+"/"+ p.sectionId+"/"+ p.objectId+"/"+ p.orderIndex, c);
}

/*添加巡检类型*/
function AddInspectCategory(p,c){
    $.getJSONP2(prefix + "AddInspectCategory",p, c);
}

/*删除巡检类型*/
function DeleteInspectCategory(p,c){
    $.getJSONP(prefix + "DeleteInspectCategory/"+ p, c);
}

function DeleteInspectSection(p,c){
    $.getJSONP(prefix + "DeleteInspectSection/"+ p, c);
}

/*获取巡检类型的巡检内容列表*/
function getInspectCategoryContentList(p,c){
    $.getJSONP(prefix + "getInspectCategoryContentList/"+ p, c);
}

/*更新巡检类型*/
function UpdateInspectCategory(p,c){
    $.getJSONP2(prefix + "UpdateInspectCategory",p, c);
}

/*获取标准列表*/
function GetInspectStandardList(c){
    $.getJSONP(prefix + "GetInspectStandardList", c);
}

/*获取方法列表*/
function GetInspectMethodList(c){
    $.getJSONP(prefix + "GetInspectMethodList", c);
}

/*添加巡检类型的巡检内容*/
function addInspectCategoryContent(p,c){
    $.getJSONP2(prefix + "addInspectCategoryContent",p, c);
}

/*删除类型中的内容*/
function deleteInspectCategoryContent(p,c){
    $.getJSONP(prefix + "deleteInspectCategoryContent/"+p, c);
}

/*更新类型中的内容*/
function updateInspectCategoryContent(p,c){
    $.getJSONP2(prefix + "updateInspectCategoryContent",p, c);
}

/*增加部位节点*/
function AddLocation(p,c){
    $.getJSONP2(prefix + "AddLocation",p, c);
}

/*获取最新照片*/
function GetRecentFileInfo(p,c){
    $.getJSONP(prefix+"GetRecentFileInfo/"+p,c);
}

function GetInspectSectionObjectList(p,c){
    $.getJSONP(prefix+"GetInspectSectionObjectList/"+p,c);
}

/*获取部位下子对象列表*/
function GetObjectByLocation(p,c){
    $.getJSONP2(prefix+"GetObjectByLocationId",p,c);
}
/*更新巡检区段*/
function UpdateInspectSection(p,c){
    $.getJSONP2(prefix+"UpdateInspectSection",p,c);
}

/*获取路线下的区段和对象*/
function getRoutStruct(p,c){
    $.getJSONP(prefix+"getRoutStruct/"+p,c);
}


/*修改部位子对象列表*/
function updateLocationObjectList(p,c){
    $.ajax({
        type:"POST",
        contentType:"application/json",
        url:prefix + "updateLocationObjectList",
        data:p,
        success: c
    })
}

/*删除巡检部位*/
function DeleteLocation(p,c){
    $.getJSONP(prefix+"DeleteLocation/"+p,c);
}

/*更新巡检部位*/
function UpdateLocation(p,c){
    $.getJSONP2(prefix+"UpdateLocation",p,c);
}


function updateSectionObjectList(p,c){
    $.ajax({
        type:"POST",
        contentType:"application/json",
        url:prefix + "updateSectionObjectList",
        data:p,
        success: c
    })
}

/*添加巡检记录*/
function addNewRecord(p,c){
    $.ajax({
        type:"POST",
        contentType:"application/json",
        url:prefix + "addNewRecord",
        data:p,
        success: c
    })
}

function upFile(p,c){
    $.ajaxFileUpload
    (
        {
            url:'http://221.12.173.124:8080/inspectservice/fileuploadhandle.ashx?OutID=1&FileOutType=1', //用于文件上传的服务器端请求地址
            secureuri: false,
            fileElementId: '_f'+p,
            dataType: 'json',
            success: c
        }
    )
}


module.exports = {
    setCookie:setCookie,
    getCookie:getCookie,
    clearCookie:clearCookie,
    getRecentRecordList:getRecentRecordList,
    getRecentTaskList:getRecentTaskList,
    setSession:setSession,
    getPlanTaskList:getPlanTaskList,
    addPlanTask:addPlanTask,
    deletePlanTask:deletePlanTask,
    getRecordList:getRecordList,
    checkRecord:checkRecord,
    getRecordById:getRecordById,
    deleteRecord:deleteRecord,
    GetInspectPlanList:GetInspectPlanList,
    UpdateInspectPlan:UpdateInspectPlan,
    AddInspectPlan:AddInspectPlan,
    DeleteInspectPlan:DeleteInspectPlan,
    GetRoutList:GetRoutList,
    getInspectObjectList:getInspectObjectList,
    deleteInspectObject:deleteInspectObject,
    AddInspectObject:AddInspectObject,
    UpdateInspectObject:UpdateInspectObject,
    GetInspectCategoryList:GetInspectCategoryList,
    GetInspectSectionList:GetInspectSectionList,
    GetLocationList:GetLocationList,
    getObjectContentResultListByRecord:getObjectContentResultListByRecord,
    GetLocationTypeTree:GetLocationTypeTree,
    GetCategoryTypeTree:GetCategoryTypeTree,
    GetRoutTypeTree:GetRoutTypeTree,
    GetLocationObjectDataList:GetLocationObjectDataList,
    GetCategoryObjectDataList:GetCategoryObjectDataList,
    GetRoutObjectDataList:GetRoutObjectDataList,
    GetObjectDataList:GetObjectDataList,
    GetSectionObjectDataList:GetSectionObjectDataList,
    getInspectObjectContentResultFileList:getInspectObjectContentResultFileList,
    getUserList:getUserList,
    onLogin:onLogin,
    getStationList:getStationList,
    GetRoutSectionList:GetRoutSectionList,
    AddRout:AddRout,
    UpdateRout:UpdateRout,
    DeleteRout:DeleteRout,
    AddInspectSection:AddInspectSection,
    deleteRoutSection:deleteRoutSection,
    addRoutSection:addRoutSection,
    GetRoutSectionObjectRelateList:GetRoutSectionObjectRelateList,
    changeRoutSectionIndex:changeRoutSectionIndex,
    deleteRoutSectionObject:deleteRoutSectionObject,
    AddRoutSectionObject:AddRoutSectionObject,
    AddInspectCategory:AddInspectCategory,
    DeleteInspectSection:DeleteInspectSection,
    getInspectCategoryContentList:getInspectCategoryContentList,
    DeleteInspectCategory:DeleteInspectCategory,
    UpdateInspectCategory:UpdateInspectCategory,
    GetInspectStandardList:GetInspectStandardList,
    GetInspectMethodList:GetInspectMethodList,
    addInspectCategoryContent:addInspectCategoryContent,
    deleteInspectCategoryContent:deleteInspectCategoryContent,
    updateInspectCategoryContent:updateInspectCategoryContent,
    AddLocation:AddLocation,
    GetRecentFileInfo:GetRecentFileInfo,
    GetInspectSectionObjectList:GetInspectSectionObjectList,
    updateSectionObjectList:updateSectionObjectList,
    GetObjectByLocation:GetObjectByLocation,
    updateLocationObjectList:updateLocationObjectList,
    getRoutStruct:getRoutStruct,
    upFile:upFile,
    addNewRecord:addNewRecord,
    UpdateInspectSection:UpdateInspectSection,
    changeRoutSectionObjectIndex:changeRoutSectionObjectIndex,
    DeleteLocation:DeleteLocation,
    UpdateLocation:UpdateLocation
};