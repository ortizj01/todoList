document.getElementById('btnGuardarTarea').addEventListener('click', async () => {
  const nombre = document.getElementById('recipient-name').value;

  if (!nombre.trim()) {
    alert('Debes ingresar un nombre para la tarea');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, estado: 'pendiente' }) 
    });

    const data = await res.json();
    console.log('Tarea creada:', data);
    alert('Tarea creada correctamente');

    document.getElementById('recipient-name').value = '';
    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    modal.hide();

    cargarTareas();
  } catch (err) {
    console.error('Error al crear la tarea:', err);
    alert('Error al crear la tarea');
  }
});



async function cargarTareas() {
  const res = await fetch('http://localhost:3000/api/tareas');
  const tareas = await res.json();

  // Limpia columnas
  document.getElementById('tareas-pendientes').innerHTML = '';
  document.getElementById('tareas-completadas').innerHTML = '';
  document.getElementById('tareas-aplazadas').innerHTML = '';
  document.getElementById('tareas-rechazadas').innerHTML = '';

  tareas.forEach(t => {
    const el = document.createElement('p');
    el.textContent = t.nombre;
    el.className = 'task bg-light p-2 my-1 rounded border';
    el.draggable = true;
    el.id = t._id;

    el.addEventListener('dragstart', ev => {
      ev.dataTransfer.setData("text", ev.target.id);
    });


    switch (t.estado) {
      case 'pendiente':
        document.getElementById('tareas-pendientes').appendChild(el);
        break;
      case 'completada':
        document.getElementById('tareas-completadas').appendChild(el);
        break;
      case 'aplazada':
        document.getElementById('tareas-aplazadas').appendChild(el);
        break;
      case 'rechazada':
        document.getElementById('tareas-rechazadas').appendChild(el);
        break;
    }
  });
}

function permitirSoltar(ev) {
  ev.preventDefault(); 
}

async function soltarTarea(ev, nuevoEstado) {
  ev.preventDefault();
  const idTarea = ev.dataTransfer.getData("text");

  try {
    const res = await fetch(`http://localhost:3000/api/tareas/${idTarea}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!res.ok) throw new Error('Error al actualizar tarea');
    const data = await res.json();
    console.log('Tarea actualizada:', data);
    
    await cargarTareas();
  } catch (err) {
    console.error('Error actualizando tarea:', err);
    alert('No se pudo mover la tarea. Intenta de nuevo.');
  }
}


cargarTareas();
