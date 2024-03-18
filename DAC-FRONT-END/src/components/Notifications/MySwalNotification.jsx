
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const useAlert = () => {
  const showToast = (type, title) => {
    MySwal.fire({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      showCloseButton: true,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
      icon: type,
      title: title,
    });
  };

  return showToast;
};

