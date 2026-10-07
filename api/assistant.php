<?php
header('Content-Type: application/json; charset=utf-8');
try {
  $c=require __DIR__.'/config.php';
  $p=new PDO("mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4",$c['db_user'],$c['db_pass'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
  $d=json_decode(file_get_contents('php://input'),true)??[];
  $message=trim($d['message']??'');
  $low=mb_strtolower($message,'UTF-8');
  $bn=preg_match('/[\x{0980}-\x{09FF}]/u',$message);
  $banglish=preg_match('/\b(ami|amake|amar|chai|lagbe|korbo|den|dao|koto|dam|ki|ache|ase|nibo|order|kinbo|product|laptop|computer|mobile|phone|budget)\b/i',$message);
  $mode=$bn?'bn':($banglish?'banglish':'en');
  $map=['কম্পিউটার'=>'Desktop','desktop'=>'Desktop','laptop'=>'Laptop','ল্যাপটপ'=>'Laptop','monitor'=>'Monitor','মনিটর'=>'Monitor','phone'=>'Phone','mobile'=>'Phone','মোবাইল'=>'Phone','tablet'=>'Tablet','camera'=>'Camera','ক্যামেরা'=>'Camera','gaming'=>'Gaming','গেমিং'=>'Gaming','keyboard'=>'Accessories','mouse'=>'Accessories','tv'=>'TV','টিভি'=>'TV','router'=>'Networking','ups'=>'Power'];
  foreach($map as $k=>$v) if(mb_stripos($low,$k)!==false) $low.=' '.$v;
  $words=array_values(array_filter(preg_split('/[^\p{L}\p{N}]+/u',$low),fn($w)=>mb_strlen($w,'UTF-8')>2));
  $clauses=[];$args=[];
  foreach(array_slice($words,0,10) as $w){$clauses[]='(LOWER(name) LIKE ? OR LOWER(category) LIKE ? OR LOWER(details) LIKE ?)';$args[]='%'.$w.'%';$args[]='%'.$w.'%';$args[]='%'.$w.'%';}
  $found=[];
  if($clauses){$s=$p->prepare('SELECT id,name,category,price,image_url,details FROM products WHERE active=1 AND ('.implode(' OR ',$clauses).') ORDER BY featured DESC,id DESC LIMIT 8');$s->execute($args);$found=$s->fetchAll(PDO::FETCH_ASSOC);}
  $store=$p->query("SELECT setting_key,setting_value FROM store_settings")->fetchAll(PDO::FETCH_KEY_PAIR);
  $intentOrder=(bool)(preg_match('/\b(order|buy|kinbo|nibo|niben|order korbo)\b/i',$message)||preg_match('/অর্ডার|কিনব|নেব|নিতে চাই|অর্ডার করব/u',$message));
  $reply='';
  if($found){
    $list=implode("\n",array_map(fn($x)=>'• '.$x['name'].' — ৳'.number_format((float)$x['price']).' | '.$x['details'],array_slice($found,0,5)));
    if($mode==='bn') $reply="আপনার জন্য মিল পাওয়া পণ্যগুলো:\n".$list."\n\nঅর্ডার করতে চাইলে বলুন “অর্ডার করব” এবং আপনার নাম, ফোন ও ঠিকানা দিন।";
    elseif($mode==='banglish') $reply="Apnar jonno matching product pelam:\n".$list."\n\nOrder korte chaile bolun “order korbo” ebong naam, phone, address din.";
    else $reply="Here are the closest matches:\n".$list."\n\nTo order, say “order” and provide your name, phone and delivery address.";
  } else {
    $info=[];
    if(preg_match('/(contact|phone|number|যোগাযোগ|নম্বর)/i',$message)) $info[]=$store['support_phone']??$store['support_email']??'Our support team is available.';
    if(preg_match('/(delivery|shipping|ডেলিভারি)/i',$message)) $info[]=$store['delivery_info']??'Fast delivery across Bangladesh.';
    if(preg_match('/(address|store|ঠিকানা|দোকান)/i',$message)) $info[]=$store['store_address']??'Please contact us for store location.';
    if($mode==='bn') $reply=$info?implode("\n",$info):"আমি product search, price, specification, category, delivery, support এবং order-এর ব্যাপারে সাহায্য করতে পারি। আপনি কী খুঁজছেন?";
    elseif($mode==='banglish') $reply=$info?implode("\n",$info):"Ami product search, price, specification, category, delivery, support ebong order-e help korte pari. Ki khujchen?";
    else $reply=$info?implode("\n",$info):"I can search products, explain specs and prices, tell you about store services, and help start an order. What are you looking for?";
  }
  echo json_encode(['answer'=>$reply,'matches'=>$found,'order_intent'=>$intentOrder,'store'=>$store],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
} catch(Throwable $e) {
  http_response_code(400);
  echo json_encode(['answer'=>'Sorry, the assistant is temporarily unavailable.','error'=>$e->getMessage()],JSON_UNESCAPED_UNICODE);
}