import React from 'react'

const SearchBar = () => {
  return (
    <div className=" relative text-gray-600">
    <input className="rounded-main border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
      type="search" name="search" placeholder="Search"/>
    <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
    <svg className="text-gray-600 h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
    </button>
  </div>
  )
}

export default SearchBar