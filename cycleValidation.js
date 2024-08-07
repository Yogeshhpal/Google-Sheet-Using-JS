//Storage -> 2D matrix (Basics needed)
let collectedGraphComponent = []; //for cycle detection in  multiple sheets, each sheet has it's own graphComponentMatrix
let graphComponentMatrix = [];

// for (let i = 0; i < rows; i++) {
//     let row = [];
//     for (let j = 0; j < cols; j++) {
//         //why array ? -> More than one child relation (dependency) 
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }

function isGraphCylic(graphComponentMatrix) {
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

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (visited[i][j] === false) {
                if (isCyclicHelper(i, j, visited, pathVisited, graphComponentMatrix)) {
                    return [i, j];
                }
            }
        }
    }
    return null;
}

function isCyclicHelper(row, col, visited, pathVisited, graphComponentMatrix) {
    visited[row][col] = true;
    pathVisited[row][col] = true;

    for (let children = 0; children < graphComponentMatrix[row][col].length; children++) {
        let [childRow, childCol] = graphComponentMatrix[row][col][children];
        if (!visited[childRow][childCol]) {
            if (isCyclicHelper(childRow, childCol, visited, pathVisited, graphComponentMatrix)) {
                return true;
            }
        } else if (pathVisited[childRow][childCol]) {
            return true;
        }
    }
    pathVisited[row][col] = false;
    return false;
}
