// Daftar whitelist pengguna
const whitelist = {
  'topa12dewa': 'User1',
  'ca1915': 'User2',
  
};

function isWhitelisted(keyword) {
  return whitelist.hasOwnProperty(keyword);
}

document.getElementById('whitelistButton').addEventListener('click', function() {
  const keyword = document.getElementById('whitelistInput').value.trim();
  if (isWhitelisted(keyword)) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
  } else {
    alert('Kata kunci tidak valid!');
  }
});

// Fungsi untuk membaca dan menampilkan isi file TXT ke textarea
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

// Fungsi untuk mengkonversi TXT ke VCF dengan validasi kategori
document.getElementById('convertTxtToVcfButton').addEventListener('click', function() {
  const txtContent = document.getElementById('txtContentBox').value.trim();
  const adminName = document.getElementById('adminNameInput').value.trim() || 'Admin';
  const navyName = document.getElementById('navyNameInput').value.trim() || 'Navy';
  const anggotaName = document.getElementById('anggotaNameInput').value.trim() || 'Anggota';
  const filename = document.getElementById('vcfFilenameInput').value.trim() || 'contacts';

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
      vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${currentCategory} ${contactIndex}\nTEL:${phoneNumber}\nEND:VCARD\n`;
      contactIndex++;
    }
  });

  const blob = new Blob([vcfContent], { type: 'text/vcard' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.vcf`;
  link.click();
});

// Fungsi untuk membaca dan menampilkan isi file XLSX ke textarea
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    let txtContent = '';

    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      json.forEach(row => {
        txtContent += row.join('\t') + '\n';
      });
    });

    document.getElementById('textBox').value = txtContent;
  };

  reader.readAsArrayBuffer(file);
});

document.getElementById('saveBtn').addEventListener('click', function() {
  const textBox = document.getElementById('textBox');
  const txtContent = textBox.value;
  const filenameInput = document.getElementById('filenameInput');
  const filename = filenameInput.value.trim() || 'converted-file'; // Default filename if input is empty
  const blob = new Blob([txtContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
});
