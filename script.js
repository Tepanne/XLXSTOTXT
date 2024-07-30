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
                // Format each cell as needed (e.g., remove spaces, add new lines)
                const formattedRow = row.map(cell => cell.toString().trim()).join('\t');
                txtContent += formattedRow + '\n';
            });
            // Add an extra newline after each sheet's content for better separation
            txtContent += '\n';
        });

        // Set the formatted text in the textarea
        document.getElementById('textBox').value = txtContent.trim(); // Trim trailing whitespace
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
