import Swal from 'sweetalert2'

export function success(message, title = 'OK') {
  return Swal.fire({ icon: 'success', title, text: message })
}

export function error(message, title = 'Erreur') {
  return Swal.fire({ icon: 'error', title, text: message })
}

export function info(message, title = '') {
  return Swal.fire({ icon: 'info', title, text: message })
}
