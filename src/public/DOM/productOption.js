function mostrarInfo(id) {
    const filaInfo = document.getElementById(id);
    if (filaInfo.style.display === "none") {
        filaInfo.style.display = "table-row";
    } else {
        filaInfo.style.display = "none";
    }
}
