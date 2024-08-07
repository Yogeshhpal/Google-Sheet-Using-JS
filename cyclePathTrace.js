// For delay and await 
function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

async function isGraphCylicTracePath(graphComponentMatrix, cycleResponse) {
    let [startRow, startCol] = cycleResponse;
    let visited = [];
    let pathVisited = [];
    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let pathVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            pathVisitedRow.push(false); // Corrected initialization here
        }
        visited.push(visitedRow);
        pathVisited.push(pathVisitedRow);
    }

    // for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < cols; j++) {
    //         if (visited[i][j] === false) {
    //             if (isCyclicHelperTracePath(i, j, visited, pathVisited, graphComponentMatrix)) {
    //                 return true;
    //             }
    //         }
    //     }
    // }

    let response = await isCyclicHelperTracePath(startRow, startCol, visited, pathVisited, graphComponentMatrix);
    if (response === true) {
        return Promise.resolve(true);
    }

    return Promise.resolve(false);
}



// Color Cells for tracking path 
async function isCyclicHelperTracePath(row, col, visited, pathVisited, graphComponentMatrix) {
    visited[row][col] = true;
    pathVisited[row][col] = true;

    let cell = document.querySelector(`.cell[rid="${row}"][cid="${col}"]`);

    cell.style.backgroundColor = "lightblue";
    await colorPromise();

    for (let children = 0; children < graphComponentMatrix[row][col].length; children++) {
        let [childRow, childCol] = graphComponentMatrix[row][col][children];
        if (!visited[childRow][childCol]) {

            let response = await isCyclicHelperTracePath(childRow, childCol, visited, pathVisited, graphComponentMatrix);
            if (response === true) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
            }
        } else if (pathVisited[childRow][childCol]) {
            let cyclicCell = document.querySelector(`.cell[rid="${childRow}"][cid="${childCol}"]`);
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";
            await colorPromise();
            cell.style.backgroundColor = "transparent";
            await colorPromise();
            return Promise.resolve(true);
        }
    }
    pathVisited[row][col] = false;
    return Promise.resolve(false);
}
