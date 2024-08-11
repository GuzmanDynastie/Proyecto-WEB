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