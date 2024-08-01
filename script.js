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
    a.download = ${filename}.txt; 
    a.click(); 
     
    // Clean up the URL object 
    URL.revokeObjectURL(url); 
});
