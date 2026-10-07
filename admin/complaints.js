async function loadComplaints(){
 const b=document.getElementById('complaintRows');if(!b)return;
 try{
  const r=await fetch('../api/complaints.php?action=all'),j=await r.json(),rows=j.complaints||[];
  b.innerHTML=rows.map(c=>'<tr><td><b>'+escC(c.reference_no)+'</b><small>'+escC(c.created_at)+'</small></td><td>'+escC(c.customer_name)+'<small>'+escC(c.phone)+'</small></td><td>'+escC(c.subject)+'</td><td>'+escC(c.details)+'</td><td><select onchange="setComplaintStatus('+c.id+',this.value)">'+['Pending','Reviewing','Resolved','Rejected'].map(s=>'<option '+(c.status===s?'selected':'')+'>'+s+'</option>').join('')+'</select></td></tr>').join('')||'<tr><td colspan="5">No complaints.</td></tr>';
 }catch(e){b.innerHTML='<tr><td colspan="5">Complaint service unavailable.</td></tr>'}
}
function escC(s){return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
async function setComplaintStatus(id,status){await fetch('../api/complaints.php?action=status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})});loadComplaints()}
loadComplaints();