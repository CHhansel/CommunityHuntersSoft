import React from 'react'

const CategoryLabel = ({name}) => {
  return (
    <div className='rounded-main px-5 py-3 cursor-pointer border border-main-color whitespace-nowrap hover:scale-110 transition-transform duration-500 '>{name}</div>
  )
}

export default CategoryLabel