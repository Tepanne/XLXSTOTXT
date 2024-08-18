document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('#mainContent > .section');
  
    function showSection(targetId) {
      sections.forEach(section => {
        section.style.display = section.id === targetId ? 'block' : 'none';
      });
    }
  
    // Event listener untuk navigasi
    navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('data-target');
        showSection(targetId);
      });
    });
  
    // Menampilkan bagian default
    showSection('convertTxtToVcf'); // Menampilkan bagian default jika tidak ada hash
  
    // Kode JavaScript untuk fungsionalitas yang ada
    const whitelist = {
      'topa12dewa': 'User1',
      'ca1915': 'User2',
    };
  
    function isWhitelisted(keyword) {
      return whitelist.hasOwnProperty(keyword);
    }
  
    document.getElementById('txtFileInput').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const content = e.target.result;
          document.getElementById('txtContentBox').value = content;
        };
        reader.readAsText(file);
      }
    });
  
    document.getElementById('convertTxtToVcfButton').addEventListener('click', function() {
      const txtContent = document.getElementById('txtContentBox').value.trim();
      const adminName = document.getElementById('adminNameInput').value.trim() || 'Admin';
      const navyName = document.getElementById('navyNameInput').value.trim() || 'Navy';
      const anggotaName = document.getElementById('anggotaNameInput').value.trim() || 'Anggota';
      const filename = document.getElementById('vcfFilenameInput').value.trim() || 'kontak';
  
      if (!txtContent) {
        alert('Isi textarea tidak boleh kosong!');
        return;
      }
  
      const lines = txtContent.split('\n').map(line => line.trim());
      let vcfContent = '';
      let currentCategory = '';
      let contactIndex = 1;
  
      lines.forEach(line => {
        if (line.toLowerCase() === 'admin') {
          currentCategory = adminName;
          contactIndex = 1;
        } else if (line.toLowerCase() === 'navy') {
          currentCategory = navyName;
          contactIndex = 1;
        } else if (line.toLowerCase() === 'anggota') {
          currentCategory = anggotaName;
          contactIndex = 1;
        } else if (line) {
          let phoneNumber = line;
          if (!phoneNumber.startsWith('+')) {
            phoneNumber = '+' + phoneNumber;
          }
          vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${currentCategory} ${contactIndex}\nTEL:${phoneNumber}\nEND:VCARD\n\n`;
          contactIndex++;
        }
      });
  
      const blob = new Blob([vcfContent], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.vcf`;
      a.click();
      URL.revokeObjectURL(url);
    });
  
    document.getElementById('fileInput').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const text = XLSX.utils.sheet_to_txt(sheet);
          document.getElementById('textBox').value = text;
        };
        reader.readAsBinaryString(file);
      }
    });
  
    document.getElementById('saveBtn').addEventListener('click', function() {
      const text = document.getElementById('textBox').value;
      const filename = document.getElementById('filenameInput').value || 'file.txt';
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  
    document.getElementById('processFilesBtn').addEventListener('click', function() {
      const files = document.getElementById('file-input').files;
      const contactName = document.getElementById('contact-name').value.trim();
      const fileAreas = document.getElementById('file-areas');
      fileAreas.innerHTML = ''; // Kosongkan div sebelum menambahkan textarea baru
  
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const textArea = document.createElement('textarea');
          textArea.classList.add('small-textarea'); // Terapkan kelas kecil
          textArea.value = e.target.result;
          fileAreas.appendChild(textArea);
        };
        reader.readAsText(file);
      });
    });
  
    document.getElementById('convertToVCFBtn').addEventListener('click', function() {
      const contactName = document.getElementById('contact-name').value.trim();
      const fileAreas = document.getElementById('file-areas');
      const textAreas = fileAreas.querySelectorAll('textarea');
      let vcfContent = '';
  
      textAreas.forEach(textArea => {
        const lines = textArea.value.split('\n').map(line => line.trim());
        let contactIndex = 1;
  
        lines.forEach(line => {
          if (line) {
            let phoneNumber = line;
            if (!phoneNumber.startsWith('+')) {
              phoneNumber = '+' + phoneNumber;
            }
            vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName} ${contactIndex}\nTEL:${phoneNumber}\nEND:VCARD\n\n`;
            contactIndex++;
          }
        });
      });
  
      const filename = 'contacts.vcf';
      const blob = new Blob([vcfContent], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  });
  
