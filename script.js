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
        const filename = filenameInput.value.trim() || 'file-terkonversi';
        const blob = new Blob([txtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        a.click();
  
        URL.revokeObjectURL(url);
    });
  
    // Fungsi Baru
    function processFiles() {
        const fileInput = document.getElementById('file-input');
        const fileAreas = document.getElementById('file-areas');
        fileAreas.innerHTML = '';
  
        for (const file of fileInput.files) {
            const reader = new FileReader();
  
            reader.onload = function(event) {
                const content = event.target.result;
                const container = document.createElement('div');
  
                const textArea = document.createElement('textarea');
                textArea.value = content;
                textArea.readOnly = true;
                container.appendChild(textArea);
  
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.placeholder = `Nama file keluaran untuk ${file.name}`;
                nameInput.classList.add('file-name-input');
                container.appendChild(nameInput);
  
                fileAreas.appendChild(container);
            };
  
            reader.readAsText(file);
        }
    }
  
    function convertToVCF() {
        const contactName = document.getElementById('contact-name').value.trim();
        if (!contactName) {
            alert('Harap masukkan nama kontak.');
            return;
        }
  
        const fileAreas = document.querySelectorAll('#file-areas > div');
  
        fileAreas.forEach((area, index) => {
            const textArea = area.querySelector('textarea');
            const nameInput = area.querySelector('input[type="text"]');
            const fileName = nameInput.value.trim() || 'kontak';
  
            const lines = textArea.value.split('\n');
            let vcfContent = '';
            let contactIndex = 1;
  
            lines.forEach(line => {
                let formattedLine = line.trim();
  
                if (formattedLine && !formattedLine.startsWith('+')) {
                    formattedLine = '+' + formattedLine;
                }
  
                if (formattedLine) {
                    vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName} ${contactIndex}\nTEL:${formattedLine}\nEND:VCARD\n`;
                    contactIndex++;
                }
            });
  
            const blob = new Blob([vcfContent], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);
  
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.vcf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
  
    document.getElementById('processFilesBtn').addEventListener('click', processFiles);
    document.getElementById('convertToVCFBtn').addEventListener('click', convertToVCF);
  
    // Fitur Split VCF
    document.getElementById('splitButton').addEventListener('click', function() {
        const file = document.getElementById('vcfFileInput').files[0];
        const contactsPerFile = parseInt(document.getElementById('contactsPerFile').value, 10);
        const fileName = document.getElementById('splitFileNameInput').value.trim();

        if (!file || isNaN(contactsPerFile) || contactsPerFile <= 0 || !fileName) {
            alert('Masukkan file VCF, jumlah kontak per file, dan nama file yang valid!');
            return;
        }

        // Ekstrak nama dasar dan nomor
        const baseNameMatch = fileName.match(/^(.+?)(\d*)$/);
        const baseName = baseNameMatch[1];
        const startNumber = parseInt(baseNameMatch[2], 10) || 1;

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const contacts = content.split('END:VCARD').filter(contact => contact.trim() !== '');
            const numberOfFiles = Math.ceil(contacts.length / contactsPerFile);

            for (let i = 0; i < numberOfFiles; i++) {
                const start = i * contactsPerFile;
                const end = start + contactsPerFile;
                const chunk = contacts.slice(start, end).join('END:VCARD') + 'END:VCARD';

                const blob = new Blob([chunk], { type: 'text/vcard' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${baseName}${startNumber + i}.vcf`;
                link.click();
            }
        };

        reader.readAsText(file);
    });
});
