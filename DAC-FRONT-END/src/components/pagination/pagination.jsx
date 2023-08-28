

// eslint-disable-next-line react/prop-types
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="pagination w-full  flex justify-center gap-10">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={currentPage === 1 ? 'opacity-25 ' : ''}
      >
        Anterior
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          className={currentPage === index + 1 ? 'active bg-main-blue text-white   rounded-full w-10 h-10' : 'w-10 h-10'}
          onClick={() => handlePageClick(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? 'opacity-25 ' : ''}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
