/**
 * PLATAFORMA PWA REPORTES URBANOS - LÓGICA DE NEGOCIO Y DOM (JS Vanilla)
 * Incremento Técnico #3: Validación asíncrona, sanitización y empaquetado del formulario.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const form = document.getElementById('form-reporte');
  const inputDesc = document.getElementById('desc-reporte');
  const inputUbi = document.getElementById('ubicacion');
  const checkAnonimo = document.getElementById('anonimo');
  const btnEnviar = document.getElementById('btn-enviar');
  const mensajeExito = document.getElementById('mensaje-exito');
  const descError = document.getElementById('desc-error');
  const ubiError = document.getElementById('ubi-error');
  const contadorCaracteres = document.getElementById('contador-caracteres');

  // 1. Contador dinámico de caracteres para la descripción
  inputDesc.addEventListener('input', () => {
    const longitud = inputDesc.value.length;
    contadorCaracteres.textContent = `${longitud} / 300`;
    limpiarError(inputDesc, descError);
  });

  inputUbi.addEventListener('input', () => {
    limpiarError(inputUbi, ubiError);
  });

  /**
   * Limpia los estados y mensajes de error en un campo
   */
  function limpiarError(input, errorElement) {
    input.classList.remove('campo-invalido');
    input.removeAttribute('aria-invalid');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  /**
   * Muestra el error visual y accesible en un campo
   */
  function marcarError(input, errorElement, mensaje) {
    input.classList.add('campo-invalido');
    input.setAttribute('aria-invalid', 'true');
    if (errorElement) {
      errorElement.textContent = mensaje;
      errorElement.style.display = 'block';
    }
  }

  // 2. Manejo del evento Submit con validación estricta
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const descValor = inputDesc.value.trim();
    const ubiValor = inputUbi.value.trim();
    let esValido = true;

    // Validación de descripción (no vacía ni puros espacios)
    if (descValor === '') {
      marcarError(inputDesc, descError, 'La descripción es obligatoria y no puede contener únicamente espacios.');
      esValido = false;
    }

    // Validación de ubicación (no vacía ni puros espacios)
    if (ubiValor === '') {
      marcarError(inputUbi, ubiError, 'La ubicación o punto de referencia es obligatoria.');
      esValido = false;
    }

    // Si algún campo no pasa la validación, detener el flujo y hacer foco en el primer error
    if (!esValido) {
      if (descValor === '') {
        inputDesc.focus();
      } else {
        inputUbi.focus();
      }
      return;
    }

    // 3. Estructuración y empaquetado del objeto reporte
    const reporteEmpaquetado = {
      folio: 'REP-' + Date.now().toString(36).toUpperCase(),
      descripcion: descValor,
      ubicacion: ubiValor,
      anonimo: checkAnonimo.checked,
      fechaCreacion: new Date().toISOString(),
      estado: 'PENDIENTE_PERSISTENCIA'
    };

    // Log analítico del objeto en consola
    console.log('--- REPORTE CIUDADANO EMPAQUETADO CON ÉXITO ---');
    console.log(JSON.stringify(reporteEmpaquetado, null, 2));

    // 4. Retroalimentación visual y prevención de doble clic
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando reporte...';
    mensajeExito.classList.remove('oculto');

    // Limpieza de campos del formulario
    form.reset();
    contadorCaracteres.textContent = '0 / 300';

    // 5. Temporizador para rehabilitar el botón tras 3 segundos (Baby Step UX)
    setTimeout(() => {
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Registrar Reporte Anónimo';
    }, 3000);

    // Ocultar notificación de éxito tras 4.5 segundos
    setTimeout(() => {
      mensajeExito.classList.add('oculto');
    }, 4500);
  });

  // 6. Registro del Service Worker para capacidades PWA Offline
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((registro) => {
          console.log('[PWA] Service Worker registrado exitosamente con scope:', registro.scope);
        })
        .catch((error) => {
          console.error('[PWA] Fallo en el registro del Service Worker:', error);
        });
    });
  }
});
