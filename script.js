const fetchData = async () => {
    try {
        const response = await fetch('https://data.gov.bh/api/explore/v2.1/catalog/datasets/01-statistics-of-students-nationalities_updated/records?where=colleges%20like%20%22IT%22%20AND%20the_programs%20like%20%22bachelor%22&limit=100');
        const data = await response.json();
        return data.results;
    } catch (error) {
        throw new Error('Failed to fetch data: ' + error.message);
    }
};

const displayData = (data) => {
    const tableBody = document.getElementById('tableBody');
    const summaryDiv = document.getElementById('summary');
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    // Sort data by year and semester
    data.sort((a, b) => {
        if (a.year !== b.year) return a.year.localeCompare(b.year);
        const semesterOrder = {
            'First Semester': 1,
            'Second Semester': 2,
            'Summer Semester': 3
        };
        return semesterOrder[a.semester] - semesterOrder[b.semester];
    });

    // Display data in table
    data.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.year}</td>
            <td>${record.semester}</td>
            <td>${record.the_programs}</td>
            <td>${record.nationality}</td>
            <td>${record.colleges}</td>
            <td>${record.number_of_students}</td>
        `;
        tableBody.appendChild(row);
    });

    // Calculate and display summary
    const totalStudents = data.reduce((sum, record) => sum + record.number_of_students, 0);
    const uniqueYears = [...new Set(data.map(record => record.year))];
    const uniqueNationalities = [...new Set(data.map(record => record.nationality))];

    summaryDiv.innerHTML = `
        <h3>Summary Statistics</h3>
        <p>Total Students: ${totalStudents}</p>
        <p>Academic Years: ${uniqueYears.join(', ')}</p>
        <p>Nationalities: ${uniqueNationalities.join(', ')}</p>
    `;
};

// Main execution
document.addEventListener('DOMContentLoaded', async () => {
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const contentDiv = document.getElementById('content');

    try {
        const data = await fetchData();
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        displayData(data);
    } catch (error) {
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.textContent = error.message;
    }
});
