//Storage
let collectedSheetDB = []; //for multiple sheets storage, each sheet has it's own sheetDB
let sheetDB = [];

{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
}

// for (let i = 0; i < rows; i++) {
//     let sheetRow = [];
//     for (let j = 0; j < cols; j++) {
//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             BGcolor: "#000000", //just for indication purpose
//             value: "",
//             formula: "",
//             children: [],
//         };
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

//Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

// Application of Two-way Binding
// Attach Properties Listeners
bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (!cell || !cellProp) return; // Add check for undefined cell or cellProp

    //Modification on active/selected cell
    cellProp.bold = !cellProp.bold; //Data Change inside SheetDB
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //Changes on UI
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; //Changes in UI
});

italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (!cell || !cellProp) return; // Add check for undefined cell or cellProp

    //Modification on active/selected cell
    cellProp.italic = !cellProp.italic; //Data Change inside SheetDB
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; //Changes on UI
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; //Changes in UI
});

underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (!cell || !cellProp) return; // Add check for undefined cell or cellProp

    //Modification on active/selected cell
    cellProp.underline = !cellProp.underline; //Data Change inside SheetDB
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; //Changes on UI
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; //Changes in UI
});

fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (!cell || !cellProp) return; // Add check for undefined cell or cellProp

    // Modification on active/selected cell
    cellProp.fontSize = fontSize.value; // Data Change inside SheetDB
    cell.style.fontSize = cellProp.fontSize + "px"; // Changes on UI
    fontSize.value = cellProp.fontSize;
});

fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (!cell || !cellProp) return; // Add check for undefined cell or cellProp

    // Modification on active/selected cell
    cellProp.fontFamily = fontFamily.value; // Data Change inside SheetDB
    cell.style.fontFamily = cellProp.fontFamily; // Changes on UI
    fontFamily.value = cellProp.fontFamily;
});

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (!cell || !cellProp) return; // Add check for undefined cell or cellProp

    // Modification on active/selected cell
    cellProp.fontColor = fontColor.value; // Data Change inside SheetDB
    cell.style.color = cellProp.fontColor; // Changes on UI
    fontColor.value = cellProp.fontColor;
});

BGcolor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (!cell || !cellProp) return; // Add check for undefined cell or cellProp

    // Modification on active/selected cell
    cellProp.BGcolor = BGcolor.value; // Data Change inside SheetDB
    cell.style.backgroundColor = cellProp.BGcolor; // Changes on UI
    BGcolor.value = cellProp.BGcolor;
});

// by default left alignment is enable and we can only select only one alignment at the time
alignment.forEach((alignElement) => {
    alignElement.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        if (!cell || !cellProp) return; // Add check for undefined cell or cellProp

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; //Data Change in DB
        cell.style.textAlign = cellProp.alignment; //UI Changes

        switch (alignValue) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

    });
});

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
    // Work
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];
        if (!cellProp) return; // Add check for undefined cellProp

        // Apply Cell Properties 
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;

        //Apply Properties to UI Props Container
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; //Changes in UI
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; //Changes in UI
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; //Changes in UI
        fontColor.value = cellProp.fontColor;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        BGcolor.value = cellProp.BGcolor;

        switch (cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
        let formulaBar = document.querySelector('.formula-bar');
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    });
}

function getCellAndCellProp(address) {
    //decode row id and col id
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    //Access Cell and storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
    //let address-> "A1"
    let rid = Number(address.slice(1) - 1); //Why -1 ? Because we consider 0-based indexing
    let cid = Number(address.charCodeAt(0)) - 65; //A -> 65
    return [rid, cid];
}
