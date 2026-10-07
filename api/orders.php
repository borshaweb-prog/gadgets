<?php
header('Content-Type: application/json; charset=utf-8');
if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);exit(json_encode(['error'=>'POST required']));}
try{
$c=require __DIR__.'/config.php';$d=json_decode(file_get_contents('php://input'),true)??[];
foreach(['name','phone','email','address','payment','items'] as $k)if(empty($d[$k]))throw new Exception("Missing $k");
if(!filter_var($d['email'],FILTER_VALIDATE_EMAIL))throw new Exception('Invalid email address.');
if(!is_array($d['items'])||!count($d['items']))throw new Exception('Cart is empty.');
$p=new PDO("mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4",$c['db_user'],$c['db_pass'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$total=0;$clean=[];
$s=$p->prepare("SELECT id,name,price FROM products WHERE id=? AND active=1");
foreach($d['items'] as $i){$id=(int)($i['id']??0);$qty=max(1,min(99,(int)($i['qty']??1)));$s->execute([$id]);$product=$s->fetch(PDO::FETCH_ASSOC);if(!$product)continue;$price=(float)$product['price'];$total+=$price*$qty;$clean[]=['id'=>$id,'name'=>$product['name'],'qty'=>$qty,'price'=>$price];}
if(!$clean)throw new Exception('No active products found in cart.');
$no='GD-'.date('YmdHis').'-'.random_int(100,999);
$s=$p->prepare("INSERT INTO orders(order_no,customer_name,phone,email,address,payment_method,total,note,status) VALUES(?,?,?,?,?,?,?,?,?)");
$s->execute([$no,trim($d['name']),trim($d['phone']),trim($d['email']),trim($d['address']),trim($d['payment']),$total,trim($d['note']??''),'Pending']);
$oid=$p->lastInsertId();
$s=$p->prepare("INSERT INTO order_items(order_id,product_id,product_name,qty,price) VALUES(?,?,?,?,?)");
foreach($clean as $i)$s->execute([$oid,$i['id'],$i['name'],$i['qty'],$i['price']]);
echo json_encode(['success'=>true,'order_id'=>$no,'total'=>$total],JSON_UNESCAPED_UNICODE);
}catch(Throwable $e){http_response_code(400);echo json_encode(['success'=>false,'error'=>$e->getMessage()],JSON_UNESCAPED_UNICODE);}
