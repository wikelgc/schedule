
//页面的事件绑定
$(document).on("pagebeforeshow", "#page1", function() {
    var now = new Date();

    //显示时间
    showDateTime(now);

    //获取地理位置
    getLocation();

    //显示天气
    showWeather("武汉");


    //获取下一节课的课堂次数
    var courseTimer = getNowTimer(now);
    //显示第一堂课的信息
    showSubjectSection(now,$("#firstCourse"),courseTimer,0);
    //显示第二堂课的信息
    showSubjectSection(now,$("#secondCourse"),courseTimer+1,1);
});


$(document).on("pagebeforeshow", "#page2", function() {

    var time = $(".time-weeks");

    $.each(time,function(i){
        $(this).text(weeks[i].name);
    });

    //
    for(var i=0 ;i<5;i++){
        var course_am = $(".course:eq("+i+") .time-course-am");
        $.each(course_am,function(j){
            $(this).text(weeks[i].am.subject[j].cname);
        });

        var course_pm = $(".course:eq("+i+") .time-course-pm");
        $.each(course_pm,function(j){
            $(this).text(weeks[i].pm.subject[j].cname);
        });

        var course_ng = $(".course:eq("+i+") .time-course-ng");
        $.each(course_ng,function(j){
            $(this).text(weeks[i].ng.subject[j].cname);
        });
    }

    //
    $(".course li").on("click", "a", function(){
        //获取学科名
        var subjecName= $(this).text().trim();
        for(var i=0;i<subject.length;i++){
            if(subject[i].cname == subjecName){
                //alert("老师:"+subject[i].teacher+"上课地点");
                var Items = "";
                Items = "<a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-right'>关闭</a>"+
                    "<p>课程名:"+subject[i].cname+"</p>"+
                    "<p>教师:"+subject[i].teacher+"</p>"+
                    "<p>上课地点:"+subject[i].location+"</p>";

                $("#tip").html(Items);
            }
        }

        //获取学科

    });
});


//注册页面
$(document).on("pagebeforeshow", "#pageRegister", function() {

    var form = $("#registerForm");
    var email=form.find("input[name='email']");
    var password=form.find("input[name='password']");
    var passwords=form.find("input[name='passwords']");
    var register = form.find("button[name='register']");

    passwords.blur(function(){
        if(passwords.val().trim() == password.val().trim()){
        }else{
            alert("密码不正确,请重新输入");
        }
    });

    register.bind("click",function(){
        if((passwords.val()!="")&&(email.val()!="")&&(password.val()!="")){
            var ref = new Wilddog("https://timetable.wilddogio.com");

            ref.createUser({
                    email:email.val().trim(),
                    password:passwords.val().trim()
                },
                function(err,data){
                    if(err!=null){
                        alert("注册失败");
                    } else {
                        alert("注册成功");


                        $.mobile.changePage($("#page3"));
                    }
                });
        }else{
            alert("请填好数据");
            return;
        }

        //跳转到注册成功页面
    });

});




//登录
$(document).on("pagebeforeshow", "#pageLogin", function() {

    var form = $("#loginForm");
    var password=form.find("input[name='password']");
    var email=form.find("input[name='email']");


    var login = form.find("button[name='login']");

    login.bind("click",function(e){

        if(email!=""&&password!=""){
            var ref = new Wilddog("https://timetable.wilddogio.com");

            ref.authWithPassword({
                email:email.val().trim(),
                password:password.val().trim()
            }, function(error,authData){
                if (error) {
                    //console.log("登录失败", error);
                    //alert("登录失败"+authData.toString());
                } else {
                    //console.log("登录成功", authData);
                    //alert("登录成功"+authData.toString());
                    //登录成功后获取uid;
                    //var authData = ref.getAuth();

                    var _uid =authData.uid.replace(/[^0-9]*/g,"").trim();

                    var uid = '{"'+
                                _uid+'":{' +
                                    '"uid":"'+_uid+'",' +
                                    '"email":"'+email.val().trim()+'"' +
                                '}' +
                        '}';

                    var _uidjson = $.parseJSON(uid);

                    var child = ref.child("users");
                    child.update(_uidjson);


                    //console.log(email);
                    $.mobile.changePage($("#page3"));
                }
            });

        }else{
            alert("请填好数据");
            alert(email+":"+password);
            return;
        }

        //跳转到注册成功页面
    });

});

//登录成功
$(document).on("pagebeforeshow", "#page3", function() {

    var ref = new Wilddog("https://timetable.wilddogio.com");
    var authData = ref.getAuth();

    //判断当前账户是否存在
    if (authData) {
        //console.log("Authenticated user with uid:", authData.uid);
        //alert("Authenticated user with uid:"+authData.uid);
        //alert("登录成功");
        var state = $("#page3").find(".page-state");
        state.html("注销");


        if(state.html()=="注销"){
            state.click(function(){
                state.html("登录/注册");
                ref.unauth();
            })
        }
    }

});



//我的信息
$(document).on("pagebeforeshow", "#myInformation", function() {

    var ref = new Wilddog("https://timetable.wilddogio.com");
    var authData = ref.getAuth();

    //判断当前账户是否存在
    if (authData) {
        //console.log("Authenticated user with uid:", authData.uid);

        //从数据库中获取用户唯一uid
        var uid =authData.uid.replace(/[^0-9]*/g,"");

        //根据uid查询mongodb中对应的uid文档
        var _url = ("users/"+uid).trim();
        var usersRef = ref.child(_url);


        usersRef.once("value", function(snapshot) {
            //如何文档中uid存在则创建相应文档
            if(snapshot.val().uid!=uid){
                console.log(snapshot.val().uid);
                usersRef.update({
                    "uid":uid
                });
            }else{
                var a = snapshot.val();

                var inf = $("#myInformation");
                inf.find("[name='user-uid']").html(a.uid);
                inf.find("[name='user-sex']").html(a.sex);
                inf.find("[name='user-name']").html(a.name);
                inf.find("[name='user-email']").html(a.email);
                inf.find("[name='user-tel']").html(a.tel);

            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });


    }

});


$(document).on("pagebeforeshow", "#modifyData", function() {

    var ref = new Wilddog("https://timetable.wilddogio.com");
    var authData = ref.getAuth();

    //判断当前账户是否存在
    if (authData) {
        //console.log("Authenticated user with uid:", authData.uid);

        //从数据库中获取用户唯一uid
        var uid =authData.uid.replace(/[^0-9]*/g,"");

        //根据uid查询mongodb中对应的uid文档
        var _url = ("users/"+uid).trim();
        var usersRef = ref.child(_url);


        usersRef.once("value", function(snapshot) {
            //如何文档中uid是否存在，如果不存在，则创建
            if(snapshot.val().uid!=uid){
                console.log(snapshot.val().uid);
                usersRef.update({
                    "uid":uid
                });
            }

            if(1){
                var a = snapshot.val();

                var inf = $("#modifyData");

                $("#infname").value="sss";

                inf.find("[name='user-uid']").val(a.uid);
                inf.find("[name='user-email']").val(a.email);
                if(a.sex){
                    inf.find("[name='user-sex']").val(a.sex);
                }
                if(a.name){
                    inf.find("[name='user-name']").val(a.name);
                }
                if(a.tel){
                    inf.find("[name='user-tel']").val(a.tel);
                }


                //绑定submit的click事件
                inf.find("[name='submit']").click(function(event){
                var sex   = inf.find("[name='user-sex']").val(),
                    name  = inf.find("[name='user-name']").val(),
                    email = inf.find("[name='user-email']").val(),
                    tel   = inf.find("[name='user-tel']").val();


                if(sex!=""&&sex!= a.sex){
                    usersRef.update({
                        "sex":sex
                    });
                }
                if(name!=""&&name!= a.name){
                    usersRef.update({
                        "name":name
                    });
                }
                if(email!=""&&email!= a.email){
                    usersRef.update({
                        "email":email
                    });
                }
                if(tel!=""&& tel!= a.tel){
                    usersRef.update({
                        "tel":tel
                    });
                }

                    alert("修改完成");
                    return false;
                });


                //获取相应的值

                //阻止事件冒泡
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });


    }

});


$(".select").on("click", function(){
    var selectDown = $(".selectDown");
    if(selectDown.css("display") == "block"){
        selectDown.css("display", "none");
    }else{
        selectDown.css("display", "block");
    }
    return false;
});

$(document).on("click", function(){
    $(".selectDown").css("display", "none");
});


function getDataTime(){
    var now = new Date();
    console.log(now.getHours()+":"+now.getMinutes());
}

getDataTime();


//显示当周的日期和天气情况
function showDateTime(now){
    var week = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    var hour = now.getHours();
    var minute = now.getMinutes();

    if(hour<10){
        hour="0"+hour;
    }
    if(minute<10){
        minute="0"+minute;
    }

    var current = $("#dateMessage");
    current.find(".current-time").html(hour+":"+minute);
    current.find(".current-date").html((now.getMonth()+1)+"月"+now.getDate()+"日");
    current.find(".current-week").html(week[now.getDay()]);
}


//
function getNowTimer(now){
    var timer = [830,920,1025,1115,1400,1450,1535,1630,1715,1830,1920,2005,2055];
    var time = now.getHours()*100+now.getMinutes();
    var nestTime = 0;


    //不仅要判断当前的时间，还要处理改时间段是否有课
    for(var i=0;i<timer.length;i++){
        if(timer[i]>time){
            nestTime = i;
            break;
        }
    }
    return nestTime;
}


function showSubjectSection(now,id,courseTimer,type){

    var timer = [830,920,1025,1115,1400,1450,1535,1630,1715,1830,1920,2005,2055];
    var weeker = now.getDay();
    if(weeker>4){
        weeker = 0;
    }

    //var courseTimer = getNowTimer(now)+1;
    //var firstCourse = $("#secondCourse");
    var subj = id.find(".course-subject");
    var lastTime = id.find(".last-time");
    var teacN = id.find(".teacher-name");
    var location = id.find(".class-location");
    var time = id.find(".class-time");


    var nowTime = now.getHours()*100+now.getMinutes();
    if(timer[courseTimer]-nowTime > 0){

        var b60 = Math.floor(timer[courseTimer]/100)*60+timer[courseTimer]%100;
        var a60 = +(Math.floor(nowTime/100)*60+nowTime%100);

        lastTime.html(Math.floor((b60-a60)/60)+":"+((b60-a60)%60));

        if(courseTimer<4){
            subj.html(weeks[weeker].am.subject[courseTimer].cname);
            teacN.html(weeks[weeker].am.subject[courseTimer].teacher);
            location.html(weeks[weeker].am.subject[courseTimer].location)

        }else if(courseTimer<8){
            subj.html(weeks[weeker].pm.subject[courseTimer-4].cname);
            teacN.html(weeks[weeker].am.subject[courseTimer-4].teacher);
            location.html(weeks[weeker].am.subject[courseTimer-4].location)
        }else if(courseTimer<12){
            subj.html(weeks[weeker].pm.subject[courseTimer-8].cname);
            teacN.html(weeks[weeker].am.subject[courseTimer-8].teacher);
            location.html(weeks[weeker].am.subject[courseTimer-8].location)
        }
        time.html(Math.floor(timer[courseTimer]/100)+":"+Math.floor(timer[courseTimer]%100)%60);
    }
    else{
        subj.html(weeks[(weeker+1)%5].am.subject[type].cname);
        teacN.html(weeks[(weeker+1)%5].am.subject[type].teacher);
        location.html(weeks[(weeker+1)%5].am.subject[type].location);
        time.html(Math.floor(timer[type]/100)+":"+timer[type]%100);
        lastTime.html("明天")
    }
}





//定位
function getLocation() {
    //检查浏览器是否支持地理位置获取
    if (navigator.geolocation) {
        //若支持地理位置获取,成功调用showPosition(),失败调用showError
        var config = { enableHighAccuracy: true, timeout: 2000, maximumAge: 30000 };
        navigator.geolocation.getCurrentPosition(showPosition, showError, config);
    } else {
        alert("定位失败,用户已禁用位置获取权限");
    }
}
/**
 * 获取地址位置成功
 */

function showPosition(position) {
    //获得经度纬度
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    alert(x+":"+y);
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(x,y);
    var geoc = new BMap.Geocoder();

    geoc.getLocation(point, function(rs){
        var addComp = rs.addressComponents;
        showWeather(addComp.city.substring(0,2));
    });
}
/**
 * 获取地址位置失败[暂不处理]
 */
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("定位失败,用户拒绝请求地理定位");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("定位失败,位置信息是不可用");
            break;
        case error.TIMEOUT:
            alert("定位失败,请求获取用户位置超时");
            break;
        case error.UNKNOWN_ERROR:
            alert("定位失败,定位系统失效");
            break;
    }
}


function showWeather(city){
    var urlPre = "http://www.corsproxy.com/";
    var url1 = "http://apis.baidu.com/apistore/weatherservice/cityname";
    var url2 = "http://apis.baidu.com/heweather/weather/free";
    var url3 = "www.webxml.com.cn/WebServices/TrainTimeWebService.asmx/getDetailInfoByTrainCode?UserID=";

    var _url = url1;
    var _data={
        "cityname":city,
    };
    var _apikey={
        "apikey":"50c252b58e6a04a7b13627cd4ec92da8"
    };

    $.ajax({
        url: _url,
        method: 'GET',
        data:_data,
        headers: _apikey,
        success:function(data){
            //序列化
            var obj = JSON.parse(data);
            var temp = $("#dateMessage").find(".current-weather");
            temp.html(obj.retData.temp+"℃");

            var weather = obj.retData.weather;
            var wea =$("#dateMessage").find(".current-weather-details");
            wea.html(city+" "+weather);

        },
        error:function(data){
            alert(data);
        }
    });
}





