/**
 * Created by admin on 2016/4/29.
 */
/**
 * Created by admin on 2016/4/28.
 */


//页面的事件绑定
$(document).on("pagebeforeshow", "#page1", function() {
    var now = new Date();

    //section1
    showDateTime(now);

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

