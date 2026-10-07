<?php
header('Content-Type: application/json; charset=utf-8');
try {
  $c=require __DIR__.'/config.php';
  $p=new PDO("mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4",$c['db_user'],$c['db_pass'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
  $products=$p->query("SELECT id,name,category,price,image_url,image_url AS image,icon,details,featured FROM products WHERE active=1 ORDER BY featured DESC,id DESC")->fetchAll(PDO::FETCH_ASSOC);
  $categories=$p->query("SELECT name FROM categories WHERE active=1 ORDER BY sort_order,id")->fetchAll(PDO::FETCH_COLUMN);
  $settings=array_column($p->query("SELECT setting_key,setting_value FROM store_settings")->fetchAll(PDO::FETCH_ASSOC),'setting_value','setting_key');
  $agents=$p->query("SELECT id,name,phone,email,whatsapp,messenger FROM agents WHERE active=1 ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
  $quick=$p->query("SELECT message FROM quick_messages WHERE active=1 ORDER BY sort_order")->fetchAll(PDO::FETCH_COLUMN);
  $offers=$p->query("SELECT id,title,subtitle,discount_text,image_url,link_url,type,start_at,end_at,active FROM offers WHERE active=1 AND (end_at IS NULL OR end_at>=NOW()) ORDER BY sort_order,id DESC")->fetchAll(PDO::FETCH_ASSOC);
  $reviews=$p->query("SELECT id,name,rating,review,active FROM reviews WHERE active=1 ORDER BY sort_order,id DESC")->fetchAll(PDO::FETCH_ASSOC);
  $banners=$p->query("SELECT id,title,subtitle,image_url,link_url,position,active FROM banners WHERE active=1 ORDER BY sort_order,id DESC")->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode(['products'=>$products,'categories'=>$categories,'settings'=>$settings,'agents'=>$agents,'quick'=>$quick,'offers'=>$offers,'reviews'=>$reviews,'banners'=>$banners],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
} catch(Throwable $e) {
  echo json_encode(['products'=>[],'categories'=>[],'settings'=>[],'agents'=>[],'quick'=>[],'offers'=>[],'reviews'=>[],'banners'=>[],'error'=>$e->getMessage()],JSON_UNESCAPED_UNICODE);
}