// Muestra las tablas para sus caracteristicas
document.addEventListener('DOMContentLoaded', function () {

    let tablesVisibles = false;

    document.getElementById('toggleTable').addEventListener('click', function (event) {
        event.preventDefault();
        const tables = document.querySelectorAll('.contenedor-together-info .table');
        const icon = this.querySelector('.fa-chevron-down');

        tablesVisibles = !tablesVisibles;

        tables.forEach(function (table) {
            table.style.display = tablesVisibles ? 'table' : 'none';
        });

        if (tablesVisibles) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            const icon = this.querySelector('.fa-chevron-up');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    });
});

// Elimina las filas que no cntengan informacion
document.addEventListener('DOMContentLoaded', function () {
    const rows = document.querySelectorAll('tbody tr');
    const tables = document.querySelectorAll('.table');

    rows.forEach(function (row) {
        const secondTd = row.querySelector('td:nth-child(2)');
        if (secondTd.textContent.trim() === '') {
            row.style.display = 'none';
        }
    });

    tables.forEach(function (table) {
        const title = table.querySelector('caption');
        const secondTd = table.querySelectorAll('td:nth-child(2)');

        const allEmptySecondValues = [...secondTd].every(cell => cell.textContent.trim() === '');

        if (allEmptySecondValues) {
            title.style.display = 'none';
        }
    });
});
