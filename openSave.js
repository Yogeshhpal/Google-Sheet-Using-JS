let downloadBtn = document.querySelector('.download');
let openBtn = document.querySelector('.open');


downloadBtn.addEventListener('click', function () {
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], { type: 'application/json' });

    let a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
});

openBtn.addEventListener('click', function () {
    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.addEventListener("change", function () {
        let fr = new FileReader();
        let files = input.files[0];

        fr.readAsText(files);
        fr.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fr.result);

            addSheetBtn.click();

            sheetDB = readSheetData[0];
            graphComponentMatrix = readSheetData[1];

            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent.length - 1] = graphComponentMatrix;

            handleSheetProperties();
        });
    });
});

