class ShoppingCart {
    constructor() {
        this.loadCart();
    }

    loadCart() {
        const cart = sessionStorage.getItem('cart');
        const shipping = sessionStorage.getItem('shipping');
        this.products = cart ? JSON.parse(cart) : [];
        this.shipping = shipping ? JSON.parse(shipping) : { shipping: 0 };
    }

    saveCart() {
        sessionStorage.setItem('cart', JSON.stringify(this.products));
    }

    saveShipping() {
        sessionStorage.setItem('shipping', JSON.stringify(this.shipping));
    }

    addItem(productId, productURL, productName, productBrand, productCategory, productInfo, productPrice, quantity) {
        const existingProductIndex = this.products.findIndex(item => item.productId === productId);
        if (existingProductIndex !== -1) {
            this.products[existingProductIndex].quantity += quantity;
        } else {
            this.products.push({ productId, productURL, productName, productBrand, productCategory, productInfo, productPrice, quantity });
        }
        this.saveCart();
    }

    updateItem(productId, newQuantity) {
        const existingProductIndex = this.products.findIndex(item => item.productId === productId);
        if (existingProductIndex !== -1) {
            if (newQuantity === 0) {
                this.products.splice(existingProductIndex, 1);
            } else {
                this.products[existingProductIndex].quantity = newQuantity;
            }
            this.saveCart();
        } else {
            throw new ShoppingCartException("Producto no encontrado en el carrito.");
        }
    }

    removeItem(productId) {
        this.products = this.products.filter(item => item.productId !== productId);
        this.saveCart();
    }

    calculateTotal() {
        return this.products.reduce((total, item) => total + item.productPrice * item.quantity, 0);
    }

    getProductsDetails() {
        return this.products.map(item => `${item.productName} - ${item.productBrand} - ${item.productCategory}: ${item.quantity} x ${item.productPrice.toFixed(2)}`).join('<br>');
    }
}

class ShoppingCartException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ShoppingCartException';
    }
}

function cargarProductosCarrito() {
    const cartItemsContainer = document.getElementById('contenedor-compras');

    if (!cartItemsContainer) {
        return;
    }

    const shoppingCart = new ShoppingCart();
    const cart = shoppingCart.products;
    cartItemsContainer.innerHTML = '';

    cart.forEach(producto => {
        const productoHTML = `
            <div class="contenedor-compras" data-product-id="${producto.productId}">
                <div class="contenedor-imagen">
                    <img src="../${producto.productURL}" alt="${producto.productName}">
                </div>

                <div class="icon-trash">
                    <span class="trash trash-button" data-product-id="${producto.productId}">
                        <i class="fa-solid fa-trash icon-trash"></i>
                    </span>
                </div>

                <div class="alineador">
                    <div class="contenedor-cantidad">
                        <label class="texto-piezas">Piezas</label><br>
                        <input type="number" class="c-cantidad" min="1" value="${producto.quantity}">
                    </div>
                </div>

                <div class="contenedor-info">
                    <h5 class="title-brand">${producto.productName}</h5>
                    <h5 class="description-brand">${producto.productBrand} - ${producto.productCategory}</h5>
                </div>

                <div class="contenedor-info-p">
                    <p class="descripcion">
                    ${producto.productInfo}
                    </p>
                    <label class="precio-label">$ ${producto.productPrice}</label>
                </div>
            </div>

            <hr class="hr-divisor">
        `;
        cartItemsContainer.innerHTML += productoHTML;
    });

    actualizarTotalCompra();
    checkCart();
}

function actualizarTotalCompra() {
    const shoppingCart = new ShoppingCart();
    const detalleCompra = document.getElementById('detalle-compra');
    const costoEnvio = document.getElementById('costo-envio');
    const montoTotal = document.getElementById('monto-total');

    if (detalleCompra && montoTotal) {
        detalleCompra.innerHTML = shoppingCart.getProductsDetails();
        montoTotal.innerHTML = `Subtotal: $${shoppingCart.calculateTotal().toFixed(2)}`;
    }

    if (shoppingCart.calculateTotal() > 0) {
        if (costoEnvio) {
            const shipping = shoppingCart.shipping.shipping;
            costoEnvio.innerHTML = `Costo del envio: $${shipping.toFixed(2)}`;
            montoTotal.innerHTML = `Subtotal: $${(shoppingCart.calculateTotal() + shipping).toFixed(2)}`;
        }
    } else {
        if (costoEnvio) {
            costoEnvio.innerHTML = '';
            montoTotal.innerHTML = '';
        }
    }

    checkCart();
}

function checkCart() {
    const shoppingCart = new ShoppingCart();
    const nextButton = document.getElementById('next-button');
    if (shoppingCart.products.length === 0) {
        nextButton.disabled = true;
        shoppingCart.shipping.shipping = 0
        shoppingCart.saveShipping();
    } else {
        nextButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    cargarProductosCarrito();

    document.addEventListener('click', function (event) {
        const shoppingCart = new ShoppingCart();

        if (event.target.closest('.trash-button')) {
            const productId = event.target.closest('.trash-button').getAttribute('data-product-id');
            shoppingCart.removeItem(productId);
            cargarProductosCarrito();
            actualizarTotalCompra();
        }
    });

    document.addEventListener('input', function (event) {
        const shoppingCart = new ShoppingCart();

        if (event.target.classList.contains('c-cantidad')) {
            const input = event.target;
            const productId = input.closest('.contenedor-compras').getAttribute('data-product-id');
            const newQuantity = parseInt(input.value);
            if (newQuantity > 0) {
                shoppingCart.updateItem(productId, newQuantity);
                actualizarTotalCompra();
            } else {
                shoppingCart.removeItem(productId);
                cargarProductosCarrito();
                actualizarTotalCompra();
            }
        }
    });

    document.addEventListener('click', function (event) {
        const shoppingCart = new ShoppingCart();

        const button = event.target;
        if (button.classList.contains('btn-add-product')) {
            const productId = button.getAttribute('data-product-id');
            const productURL = button.getAttribute('data-product-url');
            const productName = button.getAttribute('data-product-name');
            const productBrand = button.getAttribute('data-product-brand');
            const productCategory = button.getAttribute('data-product-category');
            const productInfo = button.getAttribute('data-product-info');
            const productPrice = parseFloat(button.getAttribute('data-product-price'));

            const cantidadInput = document.getElementById('cantidadInput');
            const quantity = parseInt(cantidadInput.value);

            if (quantity > 0) {
                shoppingCart.addItem(productId, productURL, productName, productBrand, productCategory, productInfo, productPrice, quantity);
                cargarProductosCarrito();
                window.location.href = '/shopping/shopping_cart';
            }
        }
    });

    // Listeners para actualizar el costo de envío
    document.addEventListener('click', function (event) {
        const shipping = new ShoppingCart();

        if (event.target.id === 'radioFree') {
            shipping.shipping.shipping = 0;
            sessionStorage.setItem('shipping', JSON.stringify(shipping.shipping));
            actualizarTotalCompra();
        }

        if (event.target.id === 'radioPay') {
            shipping.shipping.shipping = 100;
            sessionStorage.setItem('shipping', JSON.stringify(shipping.shipping));
            actualizarTotalCompra();
        }
    });

    document.getElementById('next-button').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/shopping/shipping';
    });

    document.getElementById('cancel-button').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/';
    });
});