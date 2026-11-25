const menuToggle=document.getElementById('menuToggle');
const navMenu=document.getElementById('navMenu');
menuToggle?.addEventListener('click',()=>{
  const open=navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(open));
});
navMenu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  navMenu.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');
}));
document.getElementById('year').textContent=new Date().getFullYear();

// API Apps Script Portal Kegiatan
const API_URL='https://script.google.com/macros/s/AKfycbzyKf2pufqLt8R1ELa4UcVByjzDRj1A-mMb2ut1kbyXOj0hFq5OFwcwz6WoQeWUc2N9YA/exec';
const graduationForm=document.getElementById('graduationForm');
const nisInput=document.getElementById('nisInput');
const birthDateInput=document.getElementById('birthDateInput');
const resultBox=document.getElementById('graduationResult');
const submitButton=document.getElementById('graduationSubmit');

function escapeHTML(value){
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
graduationForm?.addEventListener('submit',async event=>{
  event.preventDefault();
  const nis=nisInput.value.trim();
  const tanggalLahir=birthDateInput.value;
  if(!nis || !tanggalLahir) return;
  resultBox.className='graduation-result result-loading';
  resultBox.textContent='Sedang memeriksa data kelulusan…';
  submitButton.disabled=true;
  submitButton.textContent='Memeriksa…';
  try{
    const response=await fetch(`${API_URL}?action=kelulusan&nis=${encodeURIComponent(nis)}&tanggalLahir=${encodeURIComponent(tanggalLahir)}`);
    const data=await response.json();
    if(data.success && data.ditemukan && data.data){
      const student=data.data;
      const status=String(student.status||'').trim();
      const passed=status.toUpperCase()==='LULUS';
      resultBox.className='graduation-result result-found';
      resultBox.innerHTML=`<div class="result-title">Data siswa ditemukan</div><div class="result-data"><div><small>Nama</small><strong>${escapeHTML(student.nama)}</strong></div><div><small>NIS</small><strong>${escapeHTML(student.nis)}</strong></div><div><small>Status Kelulusan</small><strong class="result-status ${passed?'status-passed':'status-other'}">${escapeHTML(status||'Belum ada status')}</strong></div>${student.tahun?`<div><small>Tahun Ajaran</small><strong>${escapeHTML(student.tahun)}</strong></div>`:''}</div>`;
    }else{
      resultBox.className='graduation-result result-error';
      resultBox.textContent=data.message||'NIS tidak ditemukan. Silakan periksa kembali nomor yang Anda masukkan.';
    }
  }catch(error){
    resultBox.className='graduation-result result-error';
    resultBox.textContent='Tidak dapat terhubung ke server. Silakan coba kembali beberapa saat lagi.';
  }finally{
    submitButton.disabled=false;
    submitButton.innerHTML='Cek Kelulusan <span>→</span>';
  }
});
