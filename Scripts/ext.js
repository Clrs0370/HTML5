// Put your custom code here

//电子邮箱
var Email = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-|_)[A-Za-z0-9]+)*\.([a-zA-Z0-9_-])+$/;
var userInfo;
var ServerURL = "http://h5.ot.yuantel.net/";
var localHost = "http://localhost:11968/";
//ServerURL = localHost;
var index = 1;
var size = 10;

function sendfax()
{
    var faxNumbers = $("#txtFaxNo").val();
    var Sub = $("#txtSub").val();
    var Content = $("#txtContent").val();

    //验证号码
    //var faxs = faxNumbers.split(';');
    //for (var i = 0; i < faxs.length; i++) {


    //}
    showLoader("正在发送……");
   
    var url = ServerURL + "sendfax.ashx?fns=" + faxNumbers + "&sub=" + Sub + "&fcn=" + Content;
    YtAjax(
            url,
            "hide",
            function (data, textStatus, jqXHR) {
                //console.log(data.ResultCode);

                if (data.ResultCode == 100) {
                    hideLoader();
                    $("#txtFaxNo").val("");
                    $("#txtSub").val("");
                    $("#txtContent").val("");
                }
                else {
                    hideLoader();
                    msgBox("用户名或密码有误！");
                }
            },
            function (jqXHR, textStatus, errorThrown) {
                hideLoader();
                msgBox("Error:" + textStatus + "," + errorThrown);
            }

        );
}

function hide(data)
{}
//登录提交
function sumit()
{
    var userAccount = $("#txtUserAccount").val();
    var password = $("#txtpassword").val();
    
    if (!Email.test(userAccount)) {
        return;
    }

    //编码密码
    //password = escape(password);

    //YtAjax(
    //        ServerURL+"ytauth.ashx?Acd="+userAccount+"&Pwd="+password,"","showalert",""
    //    );
    var url = ServerURL + "ytauth.ashx?Acd=" + userAccount + "&Pwd=" + password;
    YtAjax(
            url,
            "hide",
            function (data, textStatus, jqXHR) {
                //console.log(data.ResultCode);

                if (data.ResultCode == 100) {

                    var jsonObj = JSON.stringify(data);

                    Session.Set("UserInfo", jsonObj);//存储用户信息
                    Session.Set("UserName", userAccount);

                    changePage("home.html", "slide", true);
                }
                else {
                    msgBox("用户名或密码有误！");
                }
            },
            function (jqXHR, textStatus, errorThrown) {
              msgBox("Error:" + textStatus + "," + errorThrown);
            }

        );

    //ytAjax(
    //        ServerURL+"ytauth.ashx",
    //        {
    //            Acd: userAccount,
    //            Pwd: password
    //        },
            //function (data, textStatus,jqXHR)
            //{
            //    //console.log(data.ResultCode);
              
            //    if (data.ResultCode == 100) {

            //        var jsonObj = JSON.stringify(data);

            //        Session.Set("UserInfo", jsonObj);//存储用户信息
            //        Session.Set("UserName", userAccount);

            //        changePage("home.html", "slide", true);
            //    }
            //    else {
            //        msgBox("用户名或密码有误！");
            //    }
            //},
            //function (jqXHR,textStatus,errorThrown)
            //{
            //   msgBox("Error:"+textStatus+","+errorThrown);
            //},
    //        function (jqXHR,textStatus){}
    //    );
}

$("#homePage").live("pageinit", function (event)
{
    $("#sp_Name").html(Session.Get("UserName"));
    $("#sp_Date").html(new Date().toLocaleDateString());

    $("<p>").html("账户：" + Session.Get("UserName")).appendTo("#div_UserInfo");
    $("<p>").html("金额：" + userInfo.Amount+"元").appendTo("#div_UserInfo");
    $("<p>").html("注册日期：" + userInfo.RegDate).appendTo("#div_UserInfo");
});

$('#homePage').live('pagecreate', function (event) {

    showLoader("正在加载……");
    userInfo = JSON.parse(Session.Get("UserInfo"));

    YtAjax(
           ServerURL+"UnReadCount.ashx?seq="+userInfo.SeqNo,
           "hide",
           function (data, textStatus, jqXHR) {

               if (data.ResultCode == 100) {
                   hideLoader();
                   var jsonObj = JSON.stringify(data);

                   Session.Set("UnReadFaxCount", jsonObj);//存储用户信息

                   $("#sp_RecvCount").html(data.RecvCount);
                   //$("#sp_SendCount").html(data.SendCount);
                   //$("#sp_DelCount").html(data.DelCount);
               }
               else {
                   hideLoader();
                   //msgBox("用户名或密码有误！");
               }
           },
           function (jqXHR, textStatus, errorThrown) {
               hideLoader();
               msgBox("Error:" + textStatus + "," + errorThrown);
           }
       );
});



function CreateList(list)
{
    var content = "";
    
    for (var i = 1; i < list.length; i++) {
        content = content + "<li>";
        content = content + "<a href=\"#\" onclick=\"goTo('details.html?fn=" + list[i].FaxNumber + "&sub=" + list[i].Sub + "&date=" + list[i].RecvDate + "&url=" + list[i].FileURL + "')\">";
        //content = content + "<img src=\"./img/headpic/5.jpg\" onerror=\"errpic(this)\" class=\"listpic\"/>";
        content = content + "<h3 class=\"listtitle\">&nbsp;&nbsp;&nbsp;&nbsp;传真号码：" + list[i].FaxNumber + "</h3>";
        content = content + "<p>";
        content = content + "主题："+list[i].Sub+" <span class=\"timestyle\">时间："+list[i].RecvDate+"</span>";
        content = content + "</p>";
        content = content + "</a>";
        content = content + "</li>";
    }
    $("#contentList1").append(content).listview('refresh');
}

$("#recvBoxPage").live("pagebeforeshow", function () {
    setTimeout(loaded2, 200);
});
$("#recvBoxPage").live("pageshow", function () {

});


function beforechange(e, data) {
    if (typeof data.toPage != "string") {
        var url = $.mobile.path.parseUrl(e.target.baseURI);
        var re = 'details.html';

        if (url.href.search(re) != -1) {
            var page = $(e.target).find("#detailsPage");
            var d = data.options.data;
            var data = getUrlParam(url.href);
           
            //page.find("#headpic").each(function (i) {
            //    this.src = decodeURIComponent(data[0]);
            //});
            page.find("#nameDiv").html(decodeURIComponent(data[0]));
            page.find("#timeDiv").html(decodeURIComponent(data[2]));
            page.find("#contentDiv").html(decodeURIComponent(data[1]));
            var picSrc = decodeURIComponent(data[3]);
            if (picSrc != '') {
                page.find("#picDiv").html("<img src=" + picSrc + " onerror='errpic(this)'/>");
            }

        }
    }
}
$('#recvBoxPage').live('pageinit', function (event) {
    showLoader("正在加载……");
    userInfo = JSON.parse(Session.Get("UserInfo"));
    $(document).bind("pagebeforechange", beforechange);
    YtAjax(
           ServerURL + "recvfaxs.ashx?seq=" + userInfo.SeqNo,
           "hide",
           function (data, textStatus, jqXHR) {

               if (data != undefined && data.length>0) {
                  
                   hideLoader();
                   CreateList(data);
               }
               else {
                   hideLoader();
                   //msgBox("用户名或密码有误！");
               }
           },
           function (jqXHR, textStatus, errorThrown) {
               hideLoader();
               msgBox("Error:" + textStatus + "," + errorThrown);
           }
       );
});
//$('#homePage').live('pagebeforehide', function (event, ui) {
//    alert('pagebeforehide');
//});
//$('#homePage').live('pageshow', function (event, ui) {
//    alert('pageshow');
//});

//$('#homePage').live('pagehide', function (event, ui) {
//    alert('pagehide');
//});














//---全局函数

//消息框
function msgBox(txt)
{
    showLoader(txt);
    setTimeout(hideLoader, 1000);
}
//显示加载器  
function showLoader(txt) {  
    //显示加载器.for jQuery Mobile 1.2.0  
  $.mobile.loading('show', {  
      text: txt, //加载器中显示的文字  
      textVisible: true, //是否显示文字  
      theme: 'a',        //加载器主题样式a-e  
      textonly: true,   //是否只显示文字  
      html: ''           //要显示的html内容，如图片等  
    });  
}  
  
//隐藏加载器.for jQuery Mobile 1.2.0  
function hideLoader()  
{  
   //隐藏加载器  
   $.mobile.loading('hide');  
}  


//跳转页面
function changePage(pageName)
{
    $.mobile.changePage(
            pageName,
            {
                transition: "slide",
                reverse: true
            }
        );
}

function changePage(pageName, transition,reverse) {
    $.mobile.changePage(
            pageName,
            {
                transition: transition,
                reverse: reverse
            }
        );
}



function YtAjax(url, callback, succFun, errorFun)
{
    $.ajax({
        type: "get",
        async: false,
        url: url,
        dataType: "jsonp",
        jsonp: "cb",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback: callback,//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: succFun,
        error: errorFun
    });
}
//Ajax通信
function ytAjax(url,data,succFun,errorFun,completeFun)
{
    //$.post(url, data, function (result) {

    //    alert(result);
    //})

    
    $.ajax(
        {
            url: url,
            contentType: "application/json",
            type:"post",
            data: data,
            dataType: "json",
            timeout: 30000,
            success: succFun,
            error: errorFun,
            complete: completeFun
        });
}

//临时存储
var Session = {
    Default: function (value) {
        sessionStorage.setItem("Cache", value);
    },
    GetDefault: function () {
        return sessionStorage.getItem("Cache");
    },
    Set: function (key, value) {
        sessionStorage.setItem(key, value);
    },
    Get: function (key) {
        return sessionStorage.getItem(key);
    },
    removeItem: function (key) {
        return sessionStorage.removeItem(key);
    }
};