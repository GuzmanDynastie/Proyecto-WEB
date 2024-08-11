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

function submitInformationForm(search) {
    const form = document.createElement('form');
    form.action = '/shopping/shop';
    form.method = 'POST';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'search';
    input.value = search;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('scroll', handleScroll);
});