<?php

require 'vendor/autoload.php';

include "Top/TopSdk.php";


$app = new \Slim\Slim();

$client = new TopClient;

$appKey = '23257991';
$appSecret = '8bc00d052fb2b8aaaee35cb957c7cc89';

$client->appkey = $appKey;
$client->secretKey = $appSecret;

//cors
header("Access-Control-Allow-Origin: *");

function objectToArray($object)
{
    //对象编程数组，递归搞来搞去搞
    if (!is_object($object) && !is_array($object))
        return $object;

    return array_map('objectToArray', (array)$object);
}

$app->get('/', function () {
    //存在的价值大概就是判断api服务有没有的拉
    echo '<h1>let barrage fly api</h1>';
});

$app->post('/register', function () use ($client) {

    $requset = new OpenimUsersAddRequest;
    $userinfo = new Userinfos;

    $requestBody = json_decode(@file_get_contents('php://input'), true);


    $username = isset($requestBody['username']) && $requestBody['username'] != '' ? $requestBody['username'] : '';
    $password = isset($requestBody['password']) && $requestBody['password'] != '' ? md5($requestBody['password']) : '';

    $userinfo->userid = $username;
    $userinfo->password = $password;


    $requset->setUserinfos(json_encode($userinfo));

    $response = $client->execute($requset);

    $responseArray = objectToArray($response);



    if (isset($responseArray['uid_succ']['string']) && $responseArray['uid_succ']['string'] == $userinfo->userid) {
        //判断是否注册成功，直接返回密码，用来登录，也就是credential
        echo json_encode(array(
            'msg' => 'success register',
            'code' => 'success',
            'username' => $userinfo->userid,
            'password' => $userinfo->password,
        ));
    } else {

        throw new \Exception(json_encode($responseArray));
//        echo json_encode($responseArray);
    }

});

$app->post('/login', function () use ($client) {
    $request = new OpenimUsersGetRequest;

    $requestBody = json_decode(@file_get_contents('php://input'), true);

    if($requestBody == null) {
        $username = isset($_POST['username']) ? $_POST['username'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';
    } else {
        $username = isset($requestBody['username']) ? $requestBody['username'] : '';
        $password = isset($requestBody['password']) ? $requestBody['password'] : '';
    }



    $request->setUserids($username);
    $response = $client->execute($request);


    $responseArray = objectToArray($response);


    if (isset($responseArray['userinfos']['userinfos']['password']) && $responseArray['userinfos']['userinfos']['password'] === md5($password)) {
        //判断是否注册成功,如果成功就返回密码什么的，可以用来登录
        echo json_encode($responseArray['userinfos']['userinfos']);
    } else {
        echo json_encode(array(
            'msg' => 'error login.maybe you have no right password',
            'code' => 'error',
        ));
    }
});

$app->get('/tribe/hostuser', function() use ($client, $appKey) {

    $request = new OpenimTribeGetmembersRequest;
    $user = new OpenImUser;

    $username = isset($_GET['username']) ? $_GET['username'] : '';
    $tribe_id = isset($_GET['tribe_id']) ? $_GET['tribe_id'] : '';

    $user->uid=$username;
    $user->taobao_account="false";
    $user->app_key=$appKey;
    $request->setUser(json_encode($user));
    $request->setTribeId($tribe_id);
    $response = $client->execute($request);

    $responseArray = objectToArray($response);

    $host_user = '';

    if(isset($responseArray['tribe_user_list'])) {
        foreach($responseArray['tribe_user_list']['tribe_user'] as $tribe_user) {
            if ($tribe_user['role'] == 'host') {
                $host_user = $tribe_user;
            }
        }
        echo json_encode($host_user);
    } else {
        echo json_encode($response);
    }



});

$app->post('/tribe/create', function () use ($client, $appKey) {
    //创建群聊
    $request = new OpenimTribeCreateRequest;
    $user = new OpenImUser;

    $requestBody = json_decode(@file_get_contents('php://input'), true);


    $user->uid = $requestBody['username'];
    $user->taobao_account = "false";
    $user->app_key = $appKey;


    $request->setUser(json_encode($user));
    $request->setTribeName($requestBody['tribe_name']);
    $request->setNotice($requestBody['tribe_notice']);
    $request->setTribeType($requestBody['tribe_type']);

    $members = new OpenImUser;

    $members->uid = $requestBody['username'];
    $members->taobao_account = "false";
    $members->app_key = $appKey;

    $request->setMembers(json_encode($members));

    $response = $client->execute($request);


    echo json_encode($response);

});

$app->post('/tribe/join', function () use ($client, $appKey) {
    //加入群

    $request = new OpenimTribeJoinRequest;
    $user = new OpenImUser;

    $requestBody = json_decode(@file_get_contents('php://input'), true);

    $user->uid = $requestBody['username'];
    $user->taobao_account = "false";
    $user->app_key = $appKey;

    $request->setUser(json_encode($user));
    $request->setTribeId($requestBody['tribe_id']);

    $response = $client->execute($request);

    echo json_encode($response);

});

$app->post('/tribe/quit', function () use ($client, $appKey) {
    //离开群

    $request = new OpenimTribeQuitRequest;

    $user = new OpenImUser;

    $requestBody = json_decode(@file_get_contents('php://input'), true);

    $user->uid = $requestBody['username'];
    $user->taobao_account = "false";
    $user->app_key = $appKey;
    $request->setUser(json_encode($user));
    $request->setTribeId($requestBody['tribe_id']);
    $response = $client->execute($request);

    echo json_encode($response);

});

$app->post('/custmsg/push', function() use ($client, $appKey) {

    $request = new OpenimCustmsgPushRequest;
    $custmsg = new CustMsg;

    $requestBody = json_decode(@file_get_contents('php://input'), true);

    $custmsg->from_user=$requestBody['from_user'];
    $custmsg->to_appkey=$appKey;
    $custmsg->to_users=$requestBody['to_user'];
    $custmsg->summary=$requestBody['summary'];//消息摘要
    $custmsg->data=$requestBody['data'];//自定义消息内容

    $request->setCustmsg(json_encode($custmsg));
    $response = $client->execute($request);
    echo json_encode($response);
});


$app->error(function (\Exception $e) use ($app) {
    echo json_encode($e);
});




$app->run();