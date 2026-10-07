<?php
header('Content-Type: application/json; charset=utf-8');
try{
$c=require __DIR__.'/config.php';
$p=new PDO("mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4",$c['db_user'],$c['db_pass'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$p->exec("CREATE TABLE IF NOT EXISTS complaints(id INT AUTO_INCREMENT PRIMARY KEY,reference_no VARCHAR(60) UNIQUE NOT NULL,customer_name VARCHAR(150) NOT NULL,phone VARCHAR(40) NOT NULL,email VARCHAR(180),subject VARCHAR(255) NOT NULL,details TEXT NOT NULL,status VARCHAR(40) DEFAULT 'Pending',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
$a=$_GET['action']??'create';$d=json_decode(file_get_contents('php://input'),true)??[];
if($a==='all'){echo json_encode(['success'=>true,'complaints'=>$p->query("SELECT * FROM complaints ORDER BY id DESC LIMIT 300")->fetchAll(PDO::FETCH_ASSOC)],JSON_UNESCAPED_UNICODE);exit;}
if($a==='status'){$s=$p->prepare("UPDATE complaints SET status=? WHERE id=?");$s->execute([$d['status']??'Pending',(int)($d['id']??0)]);echo json_encode(['success'=>true]);exit;}
foreach(['name','phone','subject','details'] as $k)if(trim((string)($d[$k]??''))==='')throw new Exception("Missing $k");
if(!empty($d['email'])&&!filter_var($d['email'],FILTER_VALIDATE_EMAIL))throw new Exception('Invalid email address.');
$ref='CP-'.date('YmdHis').'-'.random_int(100,999);
$s=$p->prepare("INSERT INTO complaints(reference_no,customer_name,phone,email,subject,details,status) VALUES(?,?,?,?,?,?,?)");
$s->execute([$ref,trim($d['name']),trim($d['phone']),trim($d['email']??''),trim($d['subject']),trim($d['details']),'Pending']);
echo json_encode(['success'=>true,'reference'=>$ref],JSON_UNESCAPED_UNICODE);
}catch(Throwable $e){http_response_code(400);echo json_encode(['success'=>false,'error'=>$e->getMessage()],JSON_UNESCAPED_UNICODE);}
?>