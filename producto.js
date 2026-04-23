document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'aceite-labial';
    const p = PRODUCTOS[id];

    if (!p) { document.getElementById('pdNombre').textContent = 'Producto no encontrado'; return; }

    document.title = p.nombre + ' — Amara';
    document.getElementById('breadcrumb-categoria').textContent = p.categoria;
    document.getElementById('breadcrumb-nombre').textContent = p.nombre;

    const imgPrincipal = document.getElementById('productoImagen');
    imgPrincipal.src = p.imagen;
    imgPrincipal.alt = p.nombre;

    const thumbsEl = document.getElementById('galeriaThumbs');
    [p.imagen, p.imagen, p.imagen].forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'galeria-thumb' + (i === 0 ? ' active' : '');
        img.alt = p.nombre;
        img.addEventListener('click', () => {
            imgPrincipal.src = src;
            document.querySelectorAll('.galeria-thumb').forEach(t => t.classList.remove('active'));
            img.classList.add('active');
        });
        thumbsEl.appendChild(img);
    });

    document.getElementById('pdCategoria').textContent = p.categoria;
    document.getElementById('pdNombre').textContent = p.nombre;
    document.getElementById('pdTagline').textContent = p.descripcionCorta;
    document.getElementById('pdDescripcion').textContent = p.descripcion;
    document.getElementById('pdEstrellas').textContent = '★'.repeat(p.estrellas) + (p.estrellas < 5 ? '☆'.repeat(5 - p.estrellas) : '');
    document.getElementById('pdReseñas').textContent = `${p.estrellas}.0 (${p.reseñas} reseñas)`;
    document.getElementById('pdPrecio').textContent = p.precio.toLocaleString('es-UY');

    if (p.precioAnterior) {
        document.getElementById('pdPrecioAnterior').textContent = p.precioAnterior.toLocaleString('es-UY');
        document.getElementById('pdBadge').style.display = 'inline-flex';
    }

    p.beneficios.forEach(b => {
        const tag = document.createElement('span');
        tag.className = 'pd-beneficio-tag';
        tag.innerHTML = `<span style="color:#C27B4E">✦</span> ${b}`;
        document.getElementById('pdBeneficios').appendChild(tag);
    });

    const ul = document.createElement('ul');
    ul.className = 'ingrediente-lista';
    p.ingredientes.forEach(ing => { const li = document.createElement('li'); li.textContent = ing; ul.appendChild(li); });
    document.getElementById('bodyIngredientes').appendChild(ul);

    const toggleBtn = document.getElementById('toggleIngredientes');
    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('open');
        document.getElementById('bodyIngredientes').classList.toggle('open');
    });

    let cantidad = 1;
    document.getElementById('cantidadMenos').addEventListener('click', () => {
        if (cantidad > 1) { cantidad--; document.getElementById('cantidadNum').textContent = cantidad; }
    });
    document.getElementById('cantidadMas').addEventListener('click', () => {
        cantidad++; document.getElementById('cantidadNum').textContent = cantidad;
    });

    document.getElementById('btnCarrito').addEventListener('click', () => {
        Carrito.agregar(p, cantidad);
        mostrarToast(p.nombre + ' añadido al carrito');
    });

    document.getElementById('btnComprar').addEventListener('click', (e) => {
        e.preventDefault();
        Carrito.agregar(p, cantidad);
        window.location.href = 'carrito.html';
    });

    const grid = document.getElementById('relacionadosGrid');
    (p.relacionados || []).forEach(relId => {
        const rel = PRODUCTOS[relId];
        if (!rel) return;
        const card = document.createElement('a');
        card.href = `producto.html?id=${rel.id}`;
        card.className = 'relacionado-card fade-up';
        card.innerHTML = `
            <div style="overflow:hidden;border-radius:12px 12px 0 0">
                <img src="${rel.imagen}" alt="${rel.nombre}" class="relacionado-img">
            </div>
            <div class="relacionado-info">
                <p class="relacionado-cat">${rel.categoria}</p>
                <p class="relacionado-nombre">${rel.nombre}</p>
                <span class="relacionado-precio">${rel.precio.toLocaleString('es-UY')}</span>
            </div>`;
        grid.appendChild(card);
    });

    document.getElementById('carritoCount').textContent = Carrito.count();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
});

function mostrarToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2800);
}
