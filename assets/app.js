let products=[],categories=[],settings={},agents=[],quickMessages=[],offers=[],reviews=[],banners=[],compare=[],cat='All';
let cart=[];
try{
  const saved=JSON.parse(localStorage.getItem('gadgets-cart')||'[]');
  cart=Array.isArray(saved)?saved:[];
}catch(e){
  cart=[];
  try{localStorage.removeItem('gadgets-cart')}catch(_){}
}
const FALLBACK_CATS=['Desktop','Laptop','Component','Monitor','Power','Phone','Tablet','Office Equipment','Camera','Security','Networking','Software','Server & Storage','Accessories','Gadget','Gaming','TV','Appliance'];
async function load(){
  // Render the storefront immediately from the built-in catalog so a slow/unavailable
  // database API can never leave Categories and Products blank.
  categories=FALLBACK_CATS.slice();
  products=seedDemoProducts();
  render();
  updateCart();

  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),5000);
    const r=await fetch('api/products.php',{signal:controller.signal,cache:'no-store'});
    clearTimeout(timer);
    if(!r.ok)throw new Error('Products API HTTP '+r.status);
    const j=await r.json();
    if(Array.isArray(j.categories)&&j.categories.length)categories=j.categories;
    if(Array.isArray(j.products)&&j.products.length)products=j.products;
    settings=j.settings||settings;
    agents=j.agents||agents;
    quickMessages=j.quick||quickMessages;
    offers=j.offers||offers;
    reviews=j.reviews||reviews;
    banners=j.banners||banners;
  }catch(e){
    // Keep the complete demo catalog and category list visible when the backend
    // is temporarily unavailable. Admin/database data will replace it when ready.
  }
  render();
  applySettings();
  renderCampaigns();
  renderDeals();
  renderReviews();
  renderBanners();
}
function seedDemoProducts(){
 const img={
  Desktop:'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=85',
  Laptop:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
  Component:'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85',
  Monitor:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85',
  Power:'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=900&q=85',
  Phone:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85',
  Tablet:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85',
  'Office Equipment':'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
  Camera:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85',
  Security:'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=900&q=85',
  Networking:'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85',
  Software:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
  'Server & Storage':'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85',
  Accessories:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
  Gadget:'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=85',
  Gaming:'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=85',
  TV:'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85',
  Appliance:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85'
 };
 const names={
  Desktop:['Dell OptiPlex 7020','HP Pro Tower 290 G9','Lenovo ThinkCentre neo 50t','ASUS ExpertCenter D7','Acer Veriton X5','MSI MAG Infinite E1','Apple Mac mini M4','Apple iMac 24 M4','Dell Precision 3680','HP EliteDesk 800 G9','Lenovo ThinkStation P3','ASUS ROG G22CH','Acer Nitro 50','MSI MAG Codex 6','Dell XPS Desktop 8960','HP ProDesk 600 G6','Lenovo ThinkCentre M70t','ASUS S500SE','Acer Aspire TC-1780','MSI Cubi N ADL','Dell Vostro 3020','HP Pavilion TP01','Lenovo IdeaCentre 3','ASUS S501ME','Acer Aspire XC-1780','MSI MPG Trident AS','Dell Precision 5820','HP Z2 G9 Tower','Lenovo ThinkStation P360','ASUS ProArt Station PD5','Acer Predator Orion 3000','MSI Aegis R2','Dell Alienware Aurora R16','HP Omen 35L','Lenovo Legion Tower 5','ASUS ROG G700','Acer Predator Orion 5000','MSI Infinite RS 13','Dell OptiPlex Micro 7020','HP Elite Mini 800 G9','Lenovo ThinkCentre M90q','ASUS ExpertCenter PN65','Acer Veriton N4','MSI Cubi 5','Dell Precision 3460 SFF','HP EliteDesk 805 G8','Lenovo ThinkStation P3 Tiny','ASUS NUC 14 Pro','Acer Veriton Z4','MSI PRO DP21'],
  Laptop:['Apple MacBook Air M4','Apple MacBook Pro 14 M4','Dell XPS 13 9340','Dell Inspiron 14 5440','HP Spectre x360 14','HP Pavilion Plus 14','Lenovo Yoga 7i 14','Lenovo ThinkPad T14 Gen 5','ASUS Zenbook 14 OLED','ASUS ROG Zephyrus G14','Acer Swift Go 14','Acer Aspire 5','MSI Prestige 14 AI Evo','MSI Katana 15','Microsoft Surface Laptop 7'],
  Component:['AMD Ryzen 7 7800X3D','Intel Core i7-14700K','ASUS TUF RTX 4070 SUPER','MSI GeForce RTX 4060 Ti','Gigabyte B650 AORUS Elite','ASRock B760M Pro RS','Corsair Vengeance DDR5 32GB','Kingston Fury Beast DDR5 32GB','Samsung 990 PRO 2TB','WD Black SN850X 2TB','Seagate BarraCuda 2TB','Cooler Master MWE 750 Gold','DeepCool AK620','NZXT Kraken 240','Lian Li LANCOOL 216'],
  Monitor:['AOC 24G2SP 24in','LG UltraGear 27GR75Q','Samsung Odyssey G5 27','Dell G2724D','ASUS TUF VG27AQ','MSI G274QPF-QD','Gigabyte M27Q','BenQ MOBIUZ EX2710Q','ViewSonic VX2728J-2K','Acer Nitro XV272U','HP OMEN 27q','Lenovo Legion R27q','Philips Evnia 27M1N','LG UltraFine 27','Samsung ViewFinity S7 32'],
  Power:['Anker SOLIX C1000','EcoFlow DELTA 2','EcoFlow RIVER 2 Pro','Jackery Explorer 1000 Plus','Bluetti AC180','Bluetti EB3A','APC Back-UPS Pro 1200','CyberPower CP1500PFCLCD','Corsair RM850x PSU','Seasonic Focus GX-850','Cooler Master MWE 650','FSP Hydro G Pro 750','Antec NeoEco Gold 750','Thermaltake Toughpower GF3','UGREEN PowerRoam 1200'],
  Phone:['Apple iPhone 17 Pro','Samsung Galaxy S26 Ultra','Google Pixel 10 Pro','OnePlus 14','Xiaomi 16','Nothing Phone 4','Vivo X300 Pro','OPPO Find X9 Pro','Honor Magic8 Pro','Motorola Edge 70 Pro','Realme GT 8 Pro','ASUS ROG Phone 9','Sony Xperia 1 VII','Huawei Pura 80 Pro','Nokia X50'],
  Tablet:['Apple iPad Pro M5','Apple iPad Air M3','Samsung Galaxy Tab S11 Ultra','Samsung Galaxy Tab S11','Lenovo Tab Extreme','Lenovo Tab P12','Xiaomi Pad 7 Pro','OnePlus Pad 3','Google Pixel Tablet','Huawei MatePad Pro 13.2','Microsoft Surface Pro 11','ASUS ROG Flow Z13','Acer Iconia X12','HONOR MagicPad 3','OPPO Pad 4 Pro'],
  'Office Equipment':['HP LaserJet Pro 4001','Canon imageCLASS MF465','Brother HL-L2460DW','Epson EcoTank L3250','Logitech MX Keys S','Microsoft Surface Keyboard','Fellowes Saturn 3i','APC SurgeArrest 11-Outlet','Kensington SD5780T','BenQ ScreenBar Halo','Elgato Stream Deck MK.2','JBL Professional 104','Poly Studio P5','Jabra Evolve2 65','TP-Link Archer AX55'],
  Camera:['Sony Alpha A7 IV','Canon EOS R6 Mark II','Nikon Z6 III','Fujifilm X-T5','Sony Alpha A6700','Canon EOS R50','Nikon Z50 II','Panasonic Lumix S5 II','GoPro HERO13 Black','DJI Osmo Pocket 3','Insta360 X5','Fujifilm X100VI','Sony ZV-E10 II','Canon PowerShot V1','Nikon Zf'],
  Security:['TP-Link Tapo C520WS','Hikvision DS-2CD2043G2','Dahua IPC-HFW2449S','EZVIZ C6N','Imou Ranger 2','Reolink Argus 4 Pro','Xiaomi Smart Camera C500 Pro','Ring Indoor Cam 2nd Gen','Arlo Pro 5S','Eufy Indoor Cam S350','Hikvision DS-7608NI','Dahua NVR4108HS','TP-Link VIGI C540','Ubiquiti G5 Bullet','Reolink Duo 3 PoE'],
  Networking:['TP-Link Archer AX72','TP-Link Deco X50','ASUS RT-AX86U Pro','NETGEAR Nighthawk AX5400','Ubiquiti UniFi Dream Router','MikroTik hAP ax3','Tenda RX9 Pro','D-Link DIR-X5460','Linksys Hydra Pro 6','Mercusys Halo H80X','TP-Link TL-SG108','Ubiquiti USW-Lite-8-PoE','NETGEAR GS308','ASUS ZenWiFi XT9','Xiaomi Mesh System AX3000'],
  Software:['Microsoft Windows 11 Pro','Microsoft 365 Personal','Microsoft Office Home 2024','Adobe Photoshop','Adobe Premiere Pro','Adobe Acrobat Pro','CorelDRAW Graphics Suite','Autodesk AutoCAD','Autodesk 3ds Max','ESET Internet Security','Bitdefender Total Security','Kaspersky Standard','Norton 360 Deluxe','Windows 11 Home','Microsoft 365 Family'],
  'Server & Storage':['Synology DS224+','Synology DS923+','QNAP TS-464','QNAP TS-673A','WD My Cloud EX2 Ultra','Synology RS1221+','Dell PowerVault ME4024','HPE ProLiant DL360 Gen11','Dell PowerEdge R350','HPE ProLiant ML30 Gen11','Lenovo ThinkSystem SR250 V3','Seagate IronWolf Pro 8TB','WD Red Pro 12TB','Samsung PM9A3 3.84TB','Kingston DC600M 3.84TB'],
  Accessories:['Logitech MX Master 3S','Logitech G Pro X Superlight 2','Razer DeathAdder V3','Keychron K8 Pro','Logitech MX Mechanical','Razer BlackWidow V4','SteelSeries Arctis Nova 7','Sony WH-1000XM6','JBL Tune 770NC','Anker 737 Power Bank','UGREEN 100W GaN Charger','Belkin 3-in-1 Charger','Elgato Wave:3','Anker 565 USB-C Hub','Baseus Metal Gleam Hub'],
  Gadget:['Apple Watch Series 11','Samsung Galaxy Watch8','Google Pixel Watch 4','Garmin Venu 4','Xiaomi Watch S4','Anker Soundcore Liberty 5','Apple AirPods Pro 3','Samsung Galaxy Buds4 Pro','Sony WF-1000XM6','DJI Osmo Mobile 7','Amazon Echo Dot 5','Google Nest Hub 2nd Gen','Tile Pro','Apple AirTag','Anker Soundcore Motion X600'],
  Gaming:['PlayStation 5 Pro','Xbox Series X','Nintendo Switch 2','Steam Deck OLED','ASUS ROG Ally X','Lenovo Legion Go','MSI Claw 8 AI+','Razer Blade 16','Alienware 16 Area-51','Acer Predator Helios 18','ASUS ROG Strix G16','MSI Raider 18 HX','Logitech G Pro X 60','Razer BlackShark V2 Pro','SteelSeries Apex Pro TKL'],
  TV:['Samsung QN90F 55','LG OLED C5 55','Sony BRAVIA 8 II 55','TCL C7K 55','Hisense U7N 55','Samsung QN800F 65','LG OLED G5 65','Sony BRAVIA 9 65','TCL QM7K 65','Hisense U8N 65','Samsung Crystal UHD 55','LG QNED90 65','Sony X90L 55','TCL P755 55','Xiaomi TV S Pro 65'],
  Appliance:['LG DualCool AC 1.5 Ton','Samsung WindFree AC 1.5 Ton','Daikin Inverter AC 1.5 Ton','Walton Inverter AC 1.5 Ton','LG 260L Refrigerator','Samsung 253L Refrigerator','Whirlpool 265L Refrigerator','Panasonic Microwave NN-ST34','Samsung Air Fryer 4.5L','Philips Air Fryer HD9252','Miyako Electric Kettle','Singer Washing Machine 7KG','LG Front Load Washer 8KG','Samsung Bespoke Oven','Xiaomi Smart Air Purifier 4']
 };
 let id=900000;const out=[];
 Object.keys(names).forEach(catName=>names[catName].forEach((name,i)=>out.push({id:id++,name,category:catName,price:Math.round((2500+i*1350+(catName==='Desktop'?i*1800:catName==='Laptop'?i*1200:0))/50)*50,image:img[catName],details:'Genuine brand model · New stock · Warranty support',featured:i<3?1:0}));
 return out;
}

function icon(c){return({Desktop:'▣',Laptop:'▰',Component:'◈',Monitor:'▤',Power:'⚡',Phone:'▯',Tablet:'▤','Office Equipment':'▥',Camera:'◉',Security:'◌',Networking:'⌁',Software:'⌘','Server & Storage':'▦',Accessories:'⌁',Gadget:'✦',Gaming:'◈',TV:'▤',Appliance:'◇'}[c]||'✦')}
function goCategory(c){cat=c;window.filterCategory=c;window.location.href='shop.html?cat='+encodeURIComponent(c)}
function selectCategory(c){cat=c;window.filterCategory=c;render();document.getElementById('shop')?.scrollIntoView({behavior:'smooth',block:'start'})}
function render(){
 const q=(document.getElementById('search')?.value||'').trim().toLowerCase();const filter=window.filterCategory||cat||'All';
 let p=products.filter(x=>{const pc=String(x.category||'').trim().toLowerCase();const fc=String(filter||'All').trim().toLowerCase();return (fc==='all'||pc===fc)&&((x.name+' '+x.category+' '+(x.details||'')).toLowerCase().includes(q))});
 const sort=document.getElementById('sort')?.value||'featured';if(sort==='low')p.sort((a,b)=>a.price-b.price);if(sort==='high')p.sort((a,b)=>b.price-a.price);
 const grid=document.getElementById('products');if(grid)grid.innerHTML=p.map(x=>'<article class="card"><div class="pic">'+((x.image_url||x.image)?'<img src="'+(x.image_url||x.image)+'" alt="'+x.name+'" loading="lazy">':(x.icon||'▣'))+'</div><div class="card-copy"><span class="product-cat">'+x.category+'</span><h3>'+x.name+'</h3><div class="muted">'+(x.details||'')+'</div><p class="price">৳'+Number(x.price).toLocaleString()+'</p><div class="product-actions"><button onclick="add('+x.id+')">Add to cart</button><button class="compare-btn" onclick="addCompare('+x.id+')">Compare</button></div></div></article>').join('')||'<p class="muted">No products found in this category.</p>';
 const cats=document.getElementById('cats');if(cats)cats.innerHTML=['All',...categories].map(c=>'<a class="category-tile '+(c===cat?'active':'')+'" href="shop.html?cat='+encodeURIComponent(c)+'"><span class="cat-icon">'+icon(c)+'</span><b>'+c+'</b><small>Explore products →</small></a>').join('')
}
function renderDeals(){const o=document.getElementById('offersGrid'),h=document.getElementById('happyGrid');const cards=(arr)=>arr.map(x=>'<article class="campaign-card '+(x.type==='happy-hour'?'happy':'')+'">'+(x.image_url?'<img src="'+x.image_url+'" alt="">':'')+'<span>'+String(x.type||'offer').replace('-',' ').toUpperCase()+'</span><h3>'+x.title+'</h3><p>'+x.subtitle+'</p><b>'+x.discount_text+'</b></article>').join('');if(o)o.innerHTML=cards(offers.filter(x=>x.type!=='happy-hour'))||'<p class="muted">No active offers.</p>';if(h)h.innerHTML=cards(offers.filter(x=>x.type==='happy-hour'))||'<p class="muted">No active Happy Hour campaigns.</p>'}
function renderCampaigns(){
 const el=document.getElementById('campaigns');if(!el)return;
 el.innerHTML=offers.map(o=>'<a class="campaign-card '+(o.type==='happy-hour'?'happy':'')+'" href="'+(o.link_url||'deals.html')+'">'+(o.image_url?'<img src="'+o.image_url+'" alt="">':'')+'<div><span>'+String(o.type||'offer').replace('-',' ').toUpperCase()+'</span><h3>'+o.title+'</h3><p>'+o.subtitle+'</p><b>'+o.discount_text+'</b></div></a>').join('')
}
function renderReviews(){
 const el=document.getElementById('reviewTrack');if(!el)return;const data=reviews.length?reviews:[{name:'Rafi',rating:5,review:'Fast delivery and genuine products.'},{name:'Nila',rating:5,review:'Helpful product guidance.'},{name:'Arman',rating:5,review:'Easy checkout and support.'}];
 el.innerHTML=[...data,...data].map(r=>'<article>★★★★★<b>“'+r.review+'”</b><span>— '+r.name+'</span></article>').join('')
}
function renderBanners(){
 const hero=document.getElementById('heroDynamic');if(!hero||!banners.length)return;
 hero.innerHTML=banners.filter(b=>b.position==='hero').map(b=>'<a href="'+(b.link_url||'shop.html')+'" class="dynamic-banner" style="background-image:url(\''+b.image_url+'\')"><div><small>GADGETS / FEATURED</small><h2>'+b.title+'</h2><p>'+b.subtitle+'</p></div></a>').join('')
}
function toggleCompare(){document.getElementById('compare')?.classList.toggle('open');renderCompare()}
function addCompare(id){const x=products.find(p=>p.id==id);if(!x)return;if(!compare.some(p=>p.id==id)){if(compare.length>=3)compare.shift();compare.push(x)}renderCompare();document.getElementById('compare')?.classList.add('open')}
function renderCompare(){const e=document.getElementById('compareItems');if(e)e.innerHTML=compare.length?compare.map(x=>'<div class="compare-row"><b>'+x.name+'</b><span>৳'+Number(x.price).toLocaleString()+'</span><small>'+x.details+'</small></div>').join(''):'<p class="muted">Add products from the compare button.</p>';const c=document.getElementById('compareCount');if(c)c.textContent=compare.length}
function add(id){const x=products.find(p=>p.id==id);if(!x)return;const o=cart.find(p=>p.id==id);o?o.qty++:cart.push({...x,qty:1});save();openCart()}
function save(){localStorage.setItem('gadgets-cart',JSON.stringify(cart));updateCart()}
function updateCart(){const count=cart.reduce((s,x)=>s+x.qty,0);document.querySelectorAll('#count,#floatCount').forEach(e=>e.textContent=count);const ci=document.getElementById('cartItems');if(ci)ci.innerHTML=cart.map(x=>'<div class="cartrow"><span>'+x.name+' × '+x.qty+'</span><b>৳'+(x.price*x.qty).toLocaleString()+'</b></div>').join('')||'<p class="muted">Your cart is empty.</p>';const t=document.getElementById('total');if(t)t.textContent=cart.reduce((s,x)=>s+x.price*x.qty,0).toLocaleString()}
function openCart(){document.getElementById('cart')?.classList.add('open');updateCart()}function closeCart(){document.getElementById('cart')?.classList.remove('open')}
function toggleChat(){document.getElementById('chat')?.classList.toggle('open')}function toggleAgent(){document.getElementById('agent')?.classList.toggle('open')}
function showAssistantOrderForm(){const m=document.getElementById('messages');if(!m)return;m.innerHTML+='<div class="bot order-form"><b>Order details</b><input id="aiName" placeholder="Full name"><input id="aiPhone" placeholder="Phone number"><input id="aiEmail" placeholder="Email address"><textarea id="aiAddress" placeholder="Full delivery address"></textarea><select id="aiPayment"><option>Cash on Delivery</option><option>bKash / Nagad</option><option>Bank Transfer</option><option>Card Payment</option></select><button onclick="submitAssistantOrder()">Place order</button></div>';m.scrollTop=m.scrollHeight}
async function submitAssistantOrder(){const items=cart;if(!items.length){appendBot('Your cart is empty. Please choose a product first.');return}const d={name:document.getElementById('aiName')?.value.trim(),phone:document.getElementById('aiPhone')?.value.trim(),email:document.getElementById('aiEmail')?.value.trim(),address:document.getElementById('aiAddress')?.value.trim(),payment:document.getElementById('aiPayment')?.value,items};if(!d.name||!d.phone||!d.email||!d.address){appendBot('Please complete your name, phone, email and delivery address.');return}try{const r=await fetch('api/orders.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const j=await r.json();if(j.success){cart=[];save();appendBot('<b>Order received successfully.</b><br>Order ID: '+j.order_id+'<br>Our team will contact you for confirmation.')}else appendBot(j.error||'Could not place the order.')}catch(e){appendBot('Order service is unavailable right now. Please try again.')}}
function appendBot(html){const m=document.getElementById('messages');if(m){m.innerHTML+='<div class="bot">'+html+'</div>';m.scrollTop=m.scrollHeight}}
async function askAI(){const i=document.getElementById('chatInput'),q=i?.value.trim();if(!q)return;const m=document.getElementById('messages');m.innerHTML+='<div class="user">'+q+'</div>';i.value='';try{const r=await fetch('api/assistant.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q,cart})});const j=await r.json();appendBot(String(j.answer||'Please tell me what you need.').replaceAll('\n','<br>'));if(j.order_intent&&j.matches?.length){add(j.matches[0].id);appendBot('<b>Product added to cart.</b><br>I can take the order here. Please provide your customer details below.');showAssistantOrderForm()}}catch(e){appendBot('Sorry, assistant connection failed. Please try again or contact an agent.')}}
function applySettings(){const s=settings||{};document.querySelectorAll('[data-social]').forEach(a=>{const k=a.dataset.social;if(s[k])a.href=s[k];else a.style.display='none'});document.querySelectorAll('[data-store-name]').forEach(e=>e.textContent=s.store_name||'Gadgets');const first=agents[0],link=document.getElementById('agentLink');if(link&&first){link.href=first.whatsapp||first.messenger||('mailto:'+(first.email||s.support_email||''));link.textContent='Contact '+first.name}}
document.addEventListener('DOMContentLoaded',()=>{const urlCat=new URLSearchParams(location.search).get('cat');if(urlCat){cat=decodeURIComponent(urlCat);window.filterCategory=cat;}document.getElementById('search')?.addEventListener('input',render);document.getElementById('sort')?.addEventListener('change',render);document.querySelector('.searchbox button')?.addEventListener('click',render);load();updateCart()});
