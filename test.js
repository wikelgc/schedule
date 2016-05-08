/**
 * Created by admin on 2016/5/6.
 */
var ref = new Wilddog("https://timetable.wilddogio.com");

ref.set({
        "name":"王泽"});
//$.getJSON("./js/test.json",function(result){
//   ref.set(result);
//   // alert("d");
//});

//ref.child("location/city").on("value", function(datasnapshot) {
//    console.log(datasnapshot.val());   // ������� console �д�ӡ�� "beijing"
//});




//function authDataCallback(authData) {
//    if (authData) {
//        console.log("User " + authData.uid + " is logged in with " + authData.provider);
//    } else {
//        console.log("User is logged out");
//    }
//}
//// ע��ص���������ÿ���ն��û���֤״̬�����ı�ʱ���ص�������ִ�С�
//var ref = new Wilddog("https://timetable.wilddogio.com");
//
////���û�״̬���м���
//ref.onAuth(authDataCallback);
//
//
////ȡ���û�״̬�ļ���
//ref.offAuth(authDataCallback);



//����ʹ��getAuth()��������ն��û���֤״̬

//var ref = new Wilddog("https://timetable.wilddogio.com");
//var authData = ref.getAuth();
//if (authData) {
//    console.log("User " + 1462439111086107 + " is logged in with " + 123456);
//} else {
//    console.log("User is logged out");
//}


//ʹ�������������е�½
//var ref = new Wilddog("https://timetable.wilddogio.com");
//function authHandler(error, authData) {
//    if (error) {
//        console.log("Login Failed!", error);
//    } else {
//        console.log("Authenticated successfully with payload:", authData);
//    }
//}
//
//
//ref.authWithPassword({
//    email    : '124578842@qq.com',
//    password : '123456'
//}, authHandler);
//
//
////�û��˳�
//ref.unauth();


//�û�ע��
//ref.createUser({email:"14835@qq.com",password:"123456"},
//    function(err,data){
//        if(err!=null){
//            console.log("失败");
//        } else {
//            console.log("成功");
//        }
//    });