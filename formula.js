for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        if (!cell) {
            console.error(`Cell not found for rid: ${i}, cid: ${j}`);
            continue;
        }
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            if (!activeCell || !cellProp) {
                console.error(`Active cell or cellProp not found for address: ${address}`);
                return;
            }
            let enteredData = activeCell.innerText;

            //No need to change because value are same
            if (enteredData === cellProp.value) return;

            cellProp.value = enteredData;
            // console.log(cellProp)
            //if data modifies then remove Parent-Child relationship , make formula empty because now it is not depends on anything ,  then update that cell childrens because children are depends on that cell
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        });
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async(e) => {
    //find that key
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {

        //if there is any change in formula , then break old parent-child relationship
        //and evalaute new formula and , add new parent-child relationship
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        if (inputFormula !== cellProp.formula) {
            removeChildFromParent(cellProp.formula)
        }
        let evaluatedValue = evaluateFormula(inputFormula);

        addChildToGraphComponent(inputFormula, address);
        //check formula is cyclic or not, then only evaluate
        let cycleResponse = isGraphCylic(graphComponentMatrix); //it will return true if graph is cyclic
        if (cycleResponse) {
            // alert("Your formula is cyclic , please enter a valid formula!!");
            let response = confirm("Your formula is cyclic . Do you want to trace the path of cycle ?");
            while (response === true) {
                //Keep on asking until user press cancel
                await isGraphCylicTracePath(graphComponentMatrix, cycleResponse); //I want to complete full iteration of color tracking, so i will await here also.
                response = confirm("Your formula is cyclic . Do you want to trace the path of cycle ?");
            }
            removeChildFromGraphComponent(inputFormula, address);
            return;
        }


        //To update UI and Cell properties in Database
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula)
        console.log(sheetDB)
        updateChildrenCells(address)
    }
});

function addChildToGraphComponent(formula, childAddress) {
    let [childRowId, childColId] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentRowId, parentColId] = decodeRIDCIDFromAddress(encodedFormula[i]);
            //B1:A1+10
            // (rid,cid)=(i,j)
            graphComponentMatrix[parentRowId][parentColId].push([childRowId, childColId]);
        }
    }

}

function removeChildFromGraphComponent(formula, childAddress) {
    let [childRowId, childColId] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentRowId, parentColId] = decodeRIDCIDFromAddress(encodedFormula[i]);
            //B1:A1+10
            // (rid,cid)=(i,j)
            graphComponentMatrix[parentRowId][parentColId].pop();
        }
    }
}

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;
    //No base case because when it reaches that cell which do not have any children , that means
    //child length is zero then in this case it will not enter into the loop and function stops!!
    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula) {
    let ChildAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [ParentCell, ParentCellProp] = getCellAndCellProp(encodedFormula[i]);
            ParentCellProp.children.push(ChildAddress)
        }
    }
}

function removeChildFromParent(formula) {
    let ChildAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [ParentCell, ParentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let index = ParentCellProp.children.indexOf(ChildAddress);
            ParentCellProp.children.splice(index, 1)
        }
    }
}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
    // let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    if (!cell || !cellProp) {
        console.error(`Cell or cellProp not found for address: ${address}`);
        return;
    }

    cell.innerText = evaluatedValue; // UI Update
    cellProp.value = evaluatedValue; // Database Update
    cellProp.formula = formula; // Database update
}
