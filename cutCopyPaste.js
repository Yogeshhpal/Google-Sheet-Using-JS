let ctrlKey;
document.addEventListener('keydown', function (e) {
    ctrlKey = e.ctrlKey;
})
document.addEventListener('keyup', function (e) {
    ctrlKey = e.ctrlKey;
})

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", function (e) {
        //select cell range work
        if (!ctrlKey) return;

        if (rangeStorage.length >= 2) {
            // console.log("rangeStorage", rangeStorage);
            defaultSelectedCell();
            rangeStorage = [];
            // console.log("rangeStorage", rangeStorage);
        }

        //UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
    })
}

function defaultSelectedCell() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let r1 = rangeStorage[i][0];
        let c1 = rangeStorage[i][1];

        let cell = document.querySelector(`.cell[rid="${r1}"][cid="${c1}"]`);
        // console.log("cell", cell);
        cell.style.border = "1px solid lightgrey";
    }
}

let copyData = [];
copyBtn.addEventListener("click", function (e) {
    if (rangeStorage.length < 2) return;

    copyData = [];

    for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
        let copyRow = [];
        for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push({ ...cellProp });
        }
        copyData.push(copyRow);
    }
    // console.log("copyData", copyData);
});

cutBtn.addEventListener("click", function (e) {
    if (rangeStorage.length < 2) return;

    for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
        for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
            let cellProp = sheetDB[i][j];
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.alignment = "left";
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            //UI
            cell.click();
        }
    }
    defaultSelectedCell();
});

pasteBtn.addEventListener("click", function (e) {
    if (rangeStorage.length < 2) return;

    //paste cells
    let rowDiff = Math.abs(rangeStorage[1][0] - rangeStorage[0][0]);
    let colDiff = Math.abs(rangeStorage[1][1] - rangeStorage[0][1]);

    let address = addressBar.value;
    let [startRow, startCol] = decodeRIDCIDFromAddress(address);

    // r=refers to the copyData row 
    // c=refers to the copyData column
    for (let i = startRow, r = 0; i <= startRow + rowDiff; i++, r++) {
        for (let j = startCol, c = 0; j <= startCol + colDiff; j++, c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if (!cell) continue;

            let data = copyData[r][c];
            // console.log("data", data);
            let cellProp = sheetDB[i][j];
            //DB
            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;
            //UI
            cell.click();
        }
    }
    defaultSelectedCell();
});