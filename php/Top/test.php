<?php
	include "TopSdk.php";
	date_default_timezone_set('Asia/Shanghai'); 

	$httpdns = new HttpdnsGetRequest;
	$client = new ClusterTopClient("appkey","appscret");
	$client->gatewayUrl = "http://gw.api.taobao.com/router/rest";
	var_dump($client->execute($httpdns));

?>