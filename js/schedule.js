
//页面的事件绑定
$(document).on("pagebeforeshow", "#page1", function() {
    var now = new Date();

    //section1
    showDateTime(now);


    getLocation();
    //天气

    showWeather("武汉");

    //section2
    //获取下一节课的课堂次数
    var courseTimer = getNowTimer(now);

    showSubjectSection(now,$("#firstCourse"),courseTimer,0);
    //section3
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
    var username=form.find("input[name='username']");
    var email=form.find("input[name='email']");
    var password=form.find("input[name='password']");
    var passwords=form.find("input[name='passwords']");
    var submit = form.find("button[name='register']");

    passwords.blur(function(){
        alert(passwords.val());
        if(passwords.val().trim() == password.val().trim()){
        }else{
            alert("密码不正确,请重新输入");
        }
    });


    $("#register").bind("click",function(){
        alert("注册成功");
        //跳转到注册成功页面
    });

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
        var config = { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 };
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
            var wea =$("#dateMessage").find(".current-weather-img");
            wea.html("<br>"+weather);

        },
        error:function(data){
            alert(data);
        }
    });
}


