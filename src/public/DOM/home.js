function handleScroll() {
    var secondNavbar = document.getElementById('second-navbar');
    var contentAfterNavar = secondNavbar.nextElementSibling;
    var offsetTop = secondNavbar.getAttribute('data-offset-top') || secondNavbar.offsetTop;

    if (!secondNavbar.getAttribute('data-offset-top')) {
        secondNavbar.setAttribute('data-offset-top', offsetTop);
    }

    if (window.pageYOffset >= offsetTop) {
        secondNavbar.classList.add('fixed');
        contentAfterNavar.style.marginTop = secondNavbar.offsetHeight + 'px';
    } else {
        secondNavbar.classList.remove('fixed');
        contentAfterNavar.style.marginTop = '0';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', handleScroll);
});