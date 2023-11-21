async function searchProblem(event) {
    event.preventDefault();

    const expressionInput = document.getElementById('expressionInput');
    const categorySelect = document.getElementById('categorySelect');
    const solutionCard = document.getElementById('solutionCard');

    const expression = expressionInput.value;
    const category = categorySelect.value;

    // Convert symbols to ASCII before sending the request
    const encodedExpression = encodeURIComponent(expression);

    try {
        const response = await fetch(`https://newton.vercel.app/api/v2/${category}/${encodedExpression}`);
        const data = await response.json();

        if (data.operation && data.expression && data.result) {
            solutionCard.innerHTML = `
                <div>
                    <div style="display:flex; ">
                        <h3><strong>${data.operation}:</strong> ${data.expression}</h3>
                        <button style="margin-left:2rem; height:50px" onclick="savedToHistory('${category}', '${expression}', '${data.result}')">Save to History</button>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>${data.result}</h3>
                        <i class="fas fa-trash" onclick="deleteSolution()"></i>
                    </div>
                </div>
            `;
        } else {
            solutionCard.innerHTML = '<p>Error: Invalid response from the API.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        solutionCard.innerHTML = '<p>Error fetching solution. Please try again.</p>';
    }
}
function deleteSolution() {
    const solutionCard = document.getElementById('solutionCard');
    solutionCard.innerHTML = ''; 

    const problems = JSON.parse(localStorage.getItem('problems')) || [];
    problems.pop(); 
    localStorage.setItem('problems', JSON.stringify(problems));
}

document.addEventListener('DOMContentLoaded', function () {
    showHistory();
});

function showHistory() {
    const historyContent = document.getElementById('history-content');

    const problems = JSON.parse(localStorage.getItem('problems')) || [];

    if (problems.length === 0) {
        historyContent.innerHTML = '<p>No saved solutions.</p>';
        return;
    }

    // Loop through saved problems and display them
    else{

        historyContent.innerHTML = '<p></p>';
    problems.forEach(problem => {
        const historyItem = document.createElement('div');
        historyItem.innerHTML = `
            <div>
                <div style="display:flex; ">
                    <h3><strong>${problem.category}:</strong> ${problem.expression}</h3>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>${problem.result}</h3>
                    <i class="fas fa-trash" onclick="deleteHistorySolution(${problems.indexOf(problem)})"></i>
                </div>
            </div>
        `;
        historyContent.appendChild(historyItem);
    });
}
}

function deleteHistorySolution(index) {
    const problems = JSON.parse(localStorage.getItem('problems')) || [];
    problems.splice(index, 1);
    localStorage.setItem('problems', JSON.stringify(problems));

    // Update the displayed history
    showHistory();
}

function savedToHistory(category, expression, result) {
    const problems = JSON.parse(localStorage.getItem('problems')) || [];
    const newProblem = {
        category,
        expression,
        result
    };
    problems.push(newProblem);
    localStorage.setItem('problems', JSON.stringify(problems));
    alert('Problem saved to local storage!');
}

