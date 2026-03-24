import Swal from "sweetalert2"
import { useToast } from "vue-toastification"

const toast = useToast()

// SUCCESS
export const notifySuccess = (message) => {
  toast.success(message)
}

// ERROR
export const notifyError = (message) => {
  toast.error(message)
}

// INFO
export const notifyInfo = (message) => {
  toast.info(message)
}

// WARNING
export const notifyWarning = (message) => {
  toast.warning(message)
}

// CONFIRM DELETE
export const confirmDelete = async (
  message = "Voulez-vous vraiment supprimer cet élément ?"
) => {
  const result = await Swal.fire({
    title: "Confirmation",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6"
  })

  return result.isConfirmed
}