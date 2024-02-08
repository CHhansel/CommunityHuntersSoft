import React from 'react'

const CategoryLabel = ({name, selected}) => {

  const isSelected = selected ? 'bg-main-color text-white scale-110 transition-transform duration-500' : ''; // Agrega 'bg-main' si selected es true

  return (
    <div className={`rounded-main px-5 py-3 cursor-pointer border border-main-color whitespace-nowrap hover:scale-110 transition-transform duration-500 ${isSelected}`}>{name}</div>
  )
}

export default CategoryLabel