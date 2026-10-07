<?php
header('Content-Type: application/json; charset=utf-8');
try{
$c=require __DIR__.'/config.php';
$p=new PDO("mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4",$c['db_user'],$c['db_pass'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$a=$_GET['action']??'stats';$d=json_decode(file_get_contents('php://input'),true)??[];
if($a==='all'){
 echo json_encode([
 'products'=>$p->query("SELECT id,name,category,price,image_url,icon,details,active,featured FROM products ORDER BY featured DESC,id DESC")->fetchAll(PDO::FETCH_ASSOC),
 'categories'=>$p->query("SELECT id,name,sort_order,active FROM categories ORDER BY sort_order,id")->fetchAll(PDO::FETCH_ASSOC),
 'orders'=>$p->query("SELECT id,order_no,customer_name,phone,email,address,payment_method,total,note,status,created_at FROM orders ORDER BY id DESC LIMIT 100")->fetchAll(PDO::FETCH_ASSOC),
 'agents'=>$p->query("SELECT id,name,phone,email,whatsapp,messenger,active FROM agents ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC),
 'quick'=>$p->query("SELECT id,message,sort_order,active FROM quick_messages ORDER BY sort_order,id")->fetchAll(PDO::FETCH_ASSOC),
 'settings'=>array_column($p->query("SELECT setting_key,setting_value FROM store_settings")->fetchAll(PDO::FETCH_ASSOC),'setting_value','setting_key'),
 'offers'=>$p->query("SELECT * FROM offers ORDER BY sort_order,id DESC")->fetchAll(PDO::FETCH_ASSOC),
 'reviews'=>$p->query("SELECT * FROM reviews ORDER BY sort_order,id DESC")->fetchAll(PDO::FETCH_ASSOC),
 'banners'=>$p->query("SELECT * FROM banners ORDER BY position,sort_order,id DESC")->fetchAll(PDO::FETCH_ASSOC)
 ],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;
}
if($a==='stats'){echo json_encode(['products'=>(int)$p->query("SELECT COUNT(*) FROM products")->fetchColumn(),'orders'=>(int)$p->query("SELECT COUNT(*) FROM orders")->fetchColumn(),'agents'=>(int)$p->query("SELECT COUNT(*) FROM agents WHERE active=1")->fetchColumn(),'offers'=>(int)$p->query("SELECT COUNT(*) FROM offers WHERE active=1")->fetchColumn()]);exit;}
if($a==='product'){if(!empty($d['id'])){$s=$p->prepare("UPDATE products SET name=?,category=?,price=?,image_url=?,icon=?,details=?,featured=?,active=? WHERE id=?");$s->execute([$d['name'],$d['category'],$d['price'],$d['image_url']??'',$d['icon']??'▣',$d['details']??'',$d['featured']??0,$d['active']??1,(int)$d['id']]);}else{$s=$p->prepare("INSERT INTO products(name,category,price,image_url,icon,details,featured,active) VALUES(?,?,?,?,?,?,?,?)");$s->execute([$d['name'],$d['category'],$d['price'],$d['image_url']??'',$d['icon']??'▣',$d['details']??'',$d['featured']??0,$d['active']??1]);}echo json_encode(['success'=>true]);exit;}
if($a==='delete_product'){$s=$p->prepare("DELETE FROM products WHERE id=?");$s->execute([(int)$d['id']]);echo json_encode(['success'=>true]);exit;}
if($a==='category'){if(!empty($d['id'])){$s=$p->prepare("UPDATE categories SET name=?,sort_order=?,active=? WHERE id=?");$s->execute([trim($d['name']),$d['sort_order']??0,$d['active']??1,(int)$d['id']]);}else{$s=$p->prepare("INSERT INTO categories(name,sort_order) VALUES(?,?)");$s->execute([trim($d['name']),$d['sort_order']??0]);}echo json_encode(['success'=>true]);exit;}
if($a==='delete_category'){$s=$p->prepare("UPDATE categories SET active=0 WHERE id=?");$s->execute([(int)$d['id']]);echo json_encode(['success'=>true]);exit;}
if($a==='order_status'){$s=$p->prepare("UPDATE orders SET status=? WHERE id=?");$s->execute([$d['status'],(int)$d['id']]);echo json_encode(['success'=>true]);exit;}
if($a==='quick'){if(isset($d['messages'])){$p->exec("DELETE FROM quick_messages");$s=$p->prepare("INSERT INTO quick_messages(message,sort_order,active) VALUES(?,?,1)");foreach($d['messages'] as $i=>$m)if(trim($m))$s->execute([trim($m),$i]);}echo json_encode(['success'=>true]);exit;}
if($a==='agent'){if(!empty($d['id'])){$s=$p->prepare("UPDATE agents SET name=?,phone=?,email=?,whatsapp=?,messenger=?,active=? WHERE id=?");$s->execute([$d['name'],$d['phone']??'',$d['email']??'',$d['whatsapp']??'',$d['messenger']??'',$d['active']??1,(int)$d['id']]);}else{$s=$p->prepare("INSERT INTO agents(name,phone,email,whatsapp,messenger) VALUES(?,?,?,?,?)");$s->execute([$d['name'],$d['phone']??'',$d['email']??'',$d['whatsapp']??'',$d['messenger']??'']);}echo json_encode(['success'=>true]);exit;}
if($a==='delete_agent'){$s=$p->prepare("UPDATE agents SET active=0 WHERE id=?");$s->execute([(int)$d['id']]);echo json_encode(['success'=>true]);exit;}
if($a==='offer'){if(!empty($d['id'])){$s=$p->prepare("UPDATE offers SET title=?,subtitle=?,discount_text=?,image_url=?,link_url=?,type=?,start_at=?,end_at=?,sort_order=?,active=? WHERE id=?");$s->execute([$d['title'],$d['subtitle']??'',$d['discount_text']??'',$d['image_url']??'',$d['link_url']??'',$d['type']??'offer',$d['start_at']?:null,$d['end_at']?:null,$d['sort_order']??0,$d['active']??1,(int)$d['id']]);}else{$s=$p->prepare("INSERT INTO offers(title,subtitle,discount_text,image_url,link_url,type,start_at,end_at,sort_order,active) VALUES(?,?,?,?,?,?,?,?,?,?)");$s->execute([$d['title'],$d['subtitle']??'',$d['discount_text']??'',$d['image_url']??'',$d['link_url']??'',$d['type']??'offer',$d['start_at']?:null,$d['end_at']?:null,$d['sort_order']??0,$d['active']??1]);}echo json_encode(['success'=>true]);exit;}
if($a==='delete_offer'){$s=$p->prepare("DELETE FROM offers WHERE id=?");$s->execute([(int)$d['id']]);echo json_encode(['success'=>true]);exit;}
if($a==='review'){if(!empty($d['id'])){$s=$p->prepare("UPDATE reviews SET name=?,rating=?,review=?,sort_order=?,active=? WHERE id=?");$s->execute([$d['name'],$d['rating']??5,$d['review'],$d['sort_order']??0,$d['active']??1,(int)$d['id']]);}else{$s=$p->prepare("INSERT INTO reviews(name,rating,review,sort_order,active) VALUES(?,?,?,?,?)");$s->execute([$d['name'],$d['rating']??5,$d['review'],$d['sort_order']??0,$d['active']??1]);}echo json_encode(['success'=>true]);exit;}
if($a==='delete_review'){$s=$p->prepare("DELETE FROM reviews WHERE id=?");$s->execute([(int)$d['id']]);echo json_encode(['success'=>true]);exit;}
if($a==='banner'){if(!empty($d['id'])){$s=$p->prepare("UPDATE banners SET title=?,subtitle=?,image_url=?,link_url=?,position=?,sort_order=?,active=? WHERE id=?");$s->execute([$d['title'],$d['subtitle']??'',$d['image_url']??'',$d['link_url']??'',$d['position']??'hero',$d['sort_order']??0,$d['active']??1,(int)$d['id']]);}else{$s=$p->prepare("INSERT INTO banners(title,subtitle,image_url,link_url,position,sort_order,active) VALUES(?,?,?,?,?,?,?)");$s->execute([$d['title'],$d['subtitle']??'',$d['image_url']??'',$d['link_url']??'',$d['position']??'hero',$d['sort_order']??0,$d['active']??1]);}echo json_encode(['success'=>true]);exit;}
if($a==='delete_banner'){$s=$p->prepare("DELETE FROM banners WHERE id=?");$s->execute([(int)$d['id']]);echo json_encode(['success'=>true]);exit;}
if($a==='settings'){foreach($d as $k=>$v){$s=$p->prepare("INSERT INTO store_settings(setting_key,setting_value) VALUES(?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)");$s->execute([$k,$v]);}echo json_encode(['success'=>true]);exit;}
throw new Exception('Unknown action');
}catch(Throwable $e){http_response_code(400);echo json_encode(['success'=>false,'error'=>$e->getMessage()],JSON_UNESCAPED_UNICODE);}
